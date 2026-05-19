// Integration check for the persistence layer.
// Proves the schema + core saved-recipe logic works end-to-end against
// the real database, including the unique constraint and cascade delete.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let pass = 0;
let fail = 0;
const ok = (c, m) => (c ? (pass++, console.log("  PASS " + m)) : (fail++, console.log("  FAIL " + m)));

const TEST_EMAIL = "verify+" + Date.now() + "@test.local";

try {
  // 1. Create a user (mirrors what the Auth.js adapter does on first sign-in)
  const user = await prisma.user.create({
    data: { email: TEST_EMAIL, name: "Verify Bot" },
  });
  ok(!!user.id, "user created via adapter-shaped model");

  // 2. Save a recipe
  const s1 = await prisma.savedRecipe.create({
    data: { userId: user.id, recipeId: "pasta-pomodoro" },
  });
  ok(!!s1.id, "recipe saved");

  // 3. Unique constraint blocks duplicate saves
  let dup = false;
  try {
    await prisma.savedRecipe.create({
      data: { userId: user.id, recipeId: "pasta-pomodoro" },
    });
  } catch {
    dup = true;
  }
  ok(dup, "duplicate save rejected by @@unique([userId, recipeId])");

  // 4. Read back the user's saved list
  const list = await prisma.savedRecipe.findMany({ where: { userId: user.id } });
  ok(list.length === 1 && list[0].recipeId === "pasta-pomodoro", "saved list reads back correctly");

  // 5. Unsave (delete)
  await prisma.savedRecipe.delete({ where: { id: s1.id } });
  const after = await prisma.savedRecipe.count({ where: { userId: user.id } });
  ok(after === 0, "unsave removes the row");

  // 6. Cascade delete: removing the user removes their data
  await prisma.savedRecipe.create({ data: { userId: user.id, recipeId: "shakshuka" } });
  await prisma.user.delete({ where: { id: user.id } });
  const orphans = await prisma.savedRecipe.count({ where: { userId: user.id } });
  ok(orphans === 0, "deleting user cascades to saved recipes");
} catch (e) {
  fail++;
  console.log("  FAIL unexpected error: " + e.message);
} finally {
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } }).catch(() => {});
  await prisma.$disconnect();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
