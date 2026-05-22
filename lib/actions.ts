"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { recipes, type Recipe } from "@/lib/recipes";

/**
 * Returns the authenticated user's id, or null if signed out.
 * Server actions use this to enforce auth — never trust the client.
 */
async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getSavedRecipeIds(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const rows = await prisma.savedRecipe.findMany({
    where: { userId },
    select: { recipeId: true },
  });
  return rows.map((r) => r.recipeId);
}

export async function getSavedRecipes(): Promise<Recipe[]> {
  const ids = await getSavedRecipeIds();
  const idSet = new Set(ids);
  return recipes.filter((r) => idSet.has(r.id));
}

/**
 * Toggle a recipe in the user's saved list.
 * Returns the new saved state, or { error } if not authenticated /
 * the recipe id is invalid.
 */
export async function toggleSavedRecipe(
  recipeId: string
): Promise<{ saved: boolean } | { error: string }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "AUTH_REQUIRED" };

  // Validate the recipe id against the known catalog — don't let arbitrary
  // strings into the database.
  if (!recipes.some((r) => r.id === recipeId)) {
    return { error: "INVALID_RECIPE" };
  }

  const existing = await prisma.savedRecipe.findUnique({
    where: { userId_recipeId: { userId, recipeId } },
  });

  if (existing) {
    await prisma.savedRecipe.delete({ where: { id: existing.id } });
  } else {
    await prisma.savedRecipe.create({ data: { userId, recipeId } });
  }

  revalidatePath("/profile");
  revalidatePath("/home");
  return { saved: !existing };
}

// ─────────────────────────── Meal plan ───────────────────────────────────

export type MealSlotName = "breakfast" | "lunch" | "dinner";
const SLOTS: MealSlotName[] = ["breakfast", "lunch", "dinner"];

/** Light shape returned to the client — no Date instances, just yyyy-mm-dd. */
export interface PlannedMeal {
  id: string;
  dateKey: string; // "2026-05-22"
  slot: MealSlotName;
  recipe: {
    id: string;
    name: string;
    photo: string;
    imageUrl?: string;
    minutes: number;
    calories: number;
  };
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDayUTC(input: string | Date): Date {
  const d = typeof input === "string" ? new Date(input + "T00:00:00Z") : input;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Returns the user's planned meals across a date range, joined with recipe
 *  catalog data for rendering. Empty when signed out. */
export async function getMealPlan(
  startDateKey: string,
  endDateKey: string
): Promise<PlannedMeal[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const start = startOfDayUTC(startDateKey);
  const end = startOfDayUTC(endDateKey);

  const rows = await prisma.mealPlanEntry.findMany({
    where: { userId, date: { gte: start, lte: end } },
    orderBy: [{ date: "asc" }],
  });

  const byId = new Map(recipes.map((r) => [r.id, r]));
  const out: PlannedMeal[] = [];
  for (const row of rows) {
    const recipe = byId.get(row.recipeId);
    if (!recipe) continue; // catalog drift — skip stale entries
    out.push({
      id: row.id,
      dateKey: dateKey(new Date(row.date)),
      slot: row.slot as MealSlotName,
      recipe: {
        id: recipe.id,
        name: recipe.name,
        photo: recipe.photo,
        imageUrl: recipe.imageUrl,
        minutes: recipe.minutes,
        calories: recipe.calories,
      },
    });
  }
  return out;
}

/** Add (or replace, if a meal already exists for that date/slot) one meal. */
export async function setMealPlanEntry(
  dateKeyIn: string,
  slot: MealSlotName,
  recipeId: string
): Promise<{ ok: true } | { error: string }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "AUTH_REQUIRED" };
  if (!SLOTS.includes(slot)) return { error: "INVALID_SLOT" };
  if (!recipes.some((r) => r.id === recipeId)) return { error: "INVALID_RECIPE" };

  const date = startOfDayUTC(dateKeyIn);

  // No DB-level unique on (userId,date,slot) yet → enforce here.
  await prisma.mealPlanEntry.deleteMany({ where: { userId, date, slot } });
  await prisma.mealPlanEntry.create({
    data: { userId, recipeId, date, slot },
  });

  revalidatePath("/calendar");
  revalidatePath("/profile");
  return { ok: true };
}

/** Remove one planned meal by id (must belong to the caller). */
export async function removeMealPlanEntry(
  id: string
): Promise<{ ok: true } | { error: string }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "AUTH_REQUIRED" };

  const row = await prisma.mealPlanEntry.findUnique({ where: { id } });
  if (!row || row.userId !== userId) return { error: "NOT_FOUND" };

  await prisma.mealPlanEntry.delete({ where: { id } });
  revalidatePath("/calendar");
  return { ok: true };
}

/** Generates a balanced 7-day plan starting from startDateKey. Replaces any
 *  existing meals for that week so calling it twice doesn't duplicate. */
export async function generateWeekPlan(
  startDateKey: string
): Promise<{ ok: true; count: number } | { error: string }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "AUTH_REQUIRED" };

  const start = startOfDayUTC(startDateKey);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    days.push(d);
  }
  const last = days[days.length - 1];

  // Wipe the existing week first so this is idempotent.
  await prisma.mealPlanEntry.deleteMany({
    where: { userId, date: { gte: days[0], lte: last } },
  });

  // Filter helpers: don't suggest ice cream for lunch, don't suggest solo
  // sides as dinner, etc. A "meal-like" recipe has enough substance.
  const isDessertish = (r: Recipe) =>
    r.tags.includes("dessert") ||
    /\b(cake|tart|pudding|ice ?cream|sorbet|brulee|cheesecake|cookie|brownie|muffin|donut|doughnut)\b/i.test(r.name);

  const isBreakfastish = (r: Recipe) =>
    r.tags.includes("breakfast") ||
    /\b(pancake|waffle|granola|cereal|porridge|oatmeal|smoothie|french toast)\b/i.test(r.name);

  const isSnackOrSide = (r: Recipe) =>
    r.tags.includes("snack") ||
    /\b(dip|chips|salsa|pickled|sauce|dressing|side|condiment|relish|jam|marinade)\b/i.test(r.name);

  // A meal needs real substance: enough ingredients AND enough steps. This
  // filters out solo-vegetable plates ("just peppers"), drinks, single-item
  // snacks, etc.
  const isMealLike = (r: Recipe) =>
    r.ingredients.length >= 5 && r.steps.length >= 3 && !isSnackOrSide(r);

  const pickPool = (predicate: (r: Recipe) => boolean) => {
    const pool = recipes.filter(predicate);
    return pool.length ? pool : recipes;
  };

  const breakfastPool = pickPool(
    (r) => isMealLike(r) && (isBreakfastish(r) || (!isDessertish(r) && r.tags.includes("quick")))
  );
  const lunchPool = pickPool(
    (r) => isMealLike(r) && !isDessertish(r) && !isBreakfastish(r) &&
           (r.tags.includes("quick") || r.tags.includes("salad") || r.tags.includes("soup"))
  );
  const dinnerPool = pickPool(
    (r) => isMealLike(r) && !isDessertish(r) && !isBreakfastish(r)
  );

  const usedIds = new Set<string>();
  const pickOne = (pool: Recipe[]): Recipe => {
    const fresh = pool.filter((r) => !usedIds.has(r.id));
    const chosen = (fresh.length ? fresh : pool)[
      Math.floor(Math.random() * (fresh.length ? fresh.length : pool.length))
    ];
    usedIds.add(chosen.id);
    return chosen;
  };

  const rows: { userId: string; recipeId: string; date: Date; slot: MealSlotName }[] = [];
  for (const d of days) {
    rows.push({ userId, date: d, slot: "breakfast", recipeId: pickOne(breakfastPool).id });
    rows.push({ userId, date: d, slot: "lunch",     recipeId: pickOne(lunchPool).id });
    rows.push({ userId, date: d, slot: "dinner",    recipeId: pickOne(dinnerPool).id });
  }

  await prisma.mealPlanEntry.createMany({ data: rows });
  revalidatePath("/calendar");
  return { ok: true, count: rows.length };
}
