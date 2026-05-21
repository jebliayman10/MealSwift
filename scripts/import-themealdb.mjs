// Bulk-import recipes from TheMealDB (free, no API key required).
//
// Strategy: list every area (cuisine) -> list its meals -> look up each meal's
// full record (ingredients + instructions + image). Write the result to
// lib/recipes.generated.ts in our Recipe shape.
//
// Re-run anytime to refresh. The committed JSON-in-TS file means zero runtime
// API dependency and no rate limits at request time.

import { writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = "https://www.themealdb.com/api/json/v1/1";

// Visual mapping per cuisine (emoji, gradient, region label our app uses)
const CUISINE_META = {
  American:   { emoji: "🍔", flag: "🇺🇸", gradient: "linear-gradient(135deg, oklch(80% 0.10 30), oklch(70% 0.14 40))" },
  British:    { emoji: "🍵", flag: "🇬🇧", gradient: "linear-gradient(135deg, oklch(76% 0.08 240), oklch(64% 0.10 260))" },
  Canadian:   { emoji: "🍁", flag: "🇨🇦", gradient: "linear-gradient(135deg, oklch(72% 0.18 30), oklch(60% 0.20 25))" },
  Chinese:    { emoji: "🥢", flag: "🇨🇳", gradient: "linear-gradient(135deg, oklch(68% 0.16 25), oklch(60% 0.18 20))" },
  Croatian:   { emoji: "🌊", flag: "🇭🇷", gradient: "linear-gradient(135deg, oklch(70% 0.10 210), oklch(60% 0.12 200))" },
  Dutch:      { emoji: "🌷", flag: "🇳🇱", gradient: "linear-gradient(135deg, oklch(76% 0.14 50), oklch(66% 0.16 45))" },
  Egyptian:   { emoji: "🏺", flag: "🇪🇬", gradient: "linear-gradient(135deg, oklch(78% 0.10 75), oklch(64% 0.14 55))" },
  Filipino:   { emoji: "🌴", flag: "🇵🇭", gradient: "linear-gradient(135deg, oklch(78% 0.14 95), oklch(64% 0.18 70))" },
  French:     { emoji: "🥐", flag: "🇫🇷", gradient: "linear-gradient(135deg, oklch(82% 0.08 280), oklch(70% 0.12 270))" },
  Greek:      { emoji: "🫒", flag: "🇬🇷", gradient: "linear-gradient(135deg, oklch(72% 0.10 195), oklch(82% 0.08 200))" },
  Indian:     { emoji: "🍛", flag: "🇮🇳", gradient: "linear-gradient(135deg, oklch(72% 0.18 55), oklch(60% 0.20 35))" },
  Irish:      { emoji: "🍀", flag: "🇮🇪", gradient: "linear-gradient(135deg, oklch(70% 0.14 150), oklch(58% 0.16 140))" },
  Italian:    { emoji: "🍝", flag: "🇮🇹", gradient: "linear-gradient(135deg, oklch(82% 0.10 30), oklch(70% 0.15 40))" },
  Jamaican:   { emoji: "🌶️", flag: "🇯🇲", gradient: "linear-gradient(135deg, oklch(74% 0.18 100), oklch(60% 0.20 60))" },
  Japanese:   { emoji: "🍣", flag: "🇯🇵", gradient: "linear-gradient(135deg, oklch(86% 0.06 0), oklch(70% 0.14 10))" },
  Kenyan:     { emoji: "🌾", flag: "🇰🇪", gradient: "linear-gradient(135deg, oklch(72% 0.14 70), oklch(60% 0.16 50))" },
  Malaysian:  { emoji: "🌶️", flag: "🇲🇾", gradient: "linear-gradient(135deg, oklch(72% 0.16 40), oklch(60% 0.18 25))" },
  Mexican:    { emoji: "🌮", flag: "🇲🇽", gradient: "linear-gradient(135deg, oklch(74% 0.18 60), oklch(62% 0.20 35))" },
  Moroccan:   { emoji: "🌶", flag: "🇲🇦", gradient: "linear-gradient(135deg, oklch(72% 0.16 50), oklch(60% 0.18 30))" },
  Polish:     { emoji: "🥟", flag: "🇵🇱", gradient: "linear-gradient(135deg, oklch(76% 0.10 30), oklch(64% 0.14 20))" },
  Portuguese: { emoji: "🐟", flag: "🇵🇹", gradient: "linear-gradient(135deg, oklch(72% 0.14 30), oklch(60% 0.16 20))" },
  Russian:    { emoji: "🥟", flag: "🇷🇺", gradient: "linear-gradient(135deg, oklch(76% 0.08 250), oklch(64% 0.10 240))" },
  Spanish:    { emoji: "🥘", flag: "🇪🇸", gradient: "linear-gradient(135deg, oklch(74% 0.16 50), oklch(62% 0.18 30))" },
  Thai:       { emoji: "🍜", flag: "🇹🇭", gradient: "linear-gradient(135deg, oklch(74% 0.16 80), oklch(62% 0.18 50))" },
  Tunisian:   { emoji: "🌶", flag: "🇹🇳", gradient: "linear-gradient(135deg, oklch(72% 0.14 55), oklch(60% 0.16 35))" },
  Turkish:    { emoji: "🥙", flag: "🇹🇷", gradient: "linear-gradient(135deg, oklch(72% 0.14 45), oklch(60% 0.16 25))" },
  Ukrainian:  { emoji: "🌻", flag: "🇺🇦", gradient: "linear-gradient(135deg, oklch(82% 0.14 95), oklch(72% 0.10 240))" },
  Vietnamese: { emoji: "🍲", flag: "🇻🇳", gradient: "linear-gradient(135deg, oklch(74% 0.14 100), oklch(62% 0.16 70))" },
  Unknown:    { emoji: "🍽️", flag: "🌍", gradient: "linear-gradient(135deg, oklch(74% 0.08 60), oklch(62% 0.10 50))" },
};

const CATEGORY_TO_TAGS = {
  Beef: [], Chicken: [], Lamb: [], Pork: [], Goat: [], Seafood: [],
  Pasta: ["quick"],
  Vegetarian: ["veg"], Vegan: ["veg"],
  Dessert: ["dessert"], Side: ["snack"], Starter: ["snack"], Miscellaneous: [],
  Breakfast: ["breakfast"],
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function extractIngredients(meal) {
  const out = [];
  for (let i = 1; i <= 20; i++) {
    const name = (meal[`strIngredient${i}`] || "").trim();
    const qty = (meal[`strMeasure${i}`] || "").trim();
    if (name) out.push({ qty: qty || "to taste", name });
  }
  return out;
}

function extractSteps(instructions) {
  if (!instructions) return [];
  // TheMealDB sometimes uses "STEP 1", "1.", or plain paragraphs. Normalize.
  return instructions
    .replace(/\r/g, "")
    .split(/\n+|(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8 && s.length < 600)
    .slice(0, 14);
}

function extractYoutubeId(url) {
  if (!url) return "";
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/);
  return m ? m[1] : "";
}

function pickTags(meal) {
  const tags = new Set();
  const fromCategory = CATEGORY_TO_TAGS[meal.strCategory] ?? [];
  fromCategory.forEach((t) => tags.add(t));

  // "global" for non-American/non-British (subjective but matches our nav)
  if (!["American", "British"].includes(meal.strArea)) tags.add("global");

  // Mark anything with <= 6 ingredients as quick-ish
  if (extractIngredients(meal).length <= 6) tags.add("quick");
  return [...tags];
}

async function getJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}

function recipeFromMeal(meal) {
  const area = meal.strArea && CUISINE_META[meal.strArea] ? meal.strArea : "Unknown";
  const meta = CUISINE_META[area];
  const ingredients = extractIngredients(meal);
  const steps = extractSteps(meal.strInstructions);

  return {
    id: `tmdb-${meal.idMeal}-${slugify(meal.strMeal)}`,
    name: meal.strMeal,
    emoji: meta.emoji,
    gradient: meta.gradient,
    photo: "", // legacy field — unused when imageUrl is set
    imageUrl: meal.strMealThumb || "",
    youtubeId: extractYoutubeId(meal.strYoutube),
    youtubeTitle: meal.strMeal,
    tags: pickTags(meal),
    region: area,
    minutes: Math.max(15, Math.min(90, 20 + ingredients.length * 4)), // estimated
    rating: 4.5,
    servings: 4,
    calories: Math.round(280 + ingredients.length * 22), // rough estimate
    ingredients,
    steps,
    description: (meal.strInstructions || "").slice(0, 240).split("\n")[0],
    source: meal.strSource || `https://www.themealdb.com/meal.php?c=${meal.idMeal}`,
  };
}

async function main() {
  console.log("Fetching areas (cuisines)...");
  const { meals: areas } = await getJson(`${BASE}/list.php?a=list`);
  console.log(`  → ${areas.length} cuisines`);

  const allMeals = [];

  for (const { strArea } of areas) {
    if (!CUISINE_META[strArea]) {
      console.log(`  skipping unmapped area: ${strArea}`);
      continue;
    }
    const { meals } = await getJson(
      `${BASE}/filter.php?a=${encodeURIComponent(strArea)}`
    );
    console.log(`  ${strArea}: ${meals?.length || 0} meals`);
    if (!meals) continue;

    for (const m of meals) {
      // Be a polite client — small pause between detail lookups.
      await sleep(40);
      const detail = await getJson(`${BASE}/lookup.php?i=${m.idMeal}`);
      const meal = detail.meals?.[0];
      if (!meal) continue;
      const recipe = recipeFromMeal(meal);
      // Skip recipes with no real instructions or image
      if (!recipe.imageUrl || recipe.steps.length < 2) continue;
      allMeals.push(recipe);
    }
  }

  console.log(`\nTotal usable recipes: ${allMeals.length}`);

  const fileBody =
    `// AUTO-GENERATED by scripts/import-themealdb.mjs — do not edit by hand.\n` +
    `// Source: TheMealDB (free, public). Re-run \`node scripts/import-themealdb.mjs\` to refresh.\n` +
    `import type { Recipe } from "./recipes";\n\n` +
    `export const importedRecipes: Recipe[] = ${JSON.stringify(allMeals, null, 2)};\n`;

  writeFileSync("lib/recipes.generated.ts", fileBody);
  console.log("Wrote lib/recipes.generated.ts");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
