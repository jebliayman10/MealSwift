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
