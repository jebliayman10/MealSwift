import Link from "next/link";
import { auth } from "@/auth";
import { getCuisines, recipesByCuisine } from "@/lib/recipes";
import { getSavedRecipeIds } from "@/lib/actions";
import { WebRecipeCard } from "@/components/web/WebRecipeCard";
import { CuisineGrid } from "@/components/web/CuisineGrid";

interface PageProps {
  searchParams: Promise<{ cuisine?: string }>;
}

// Saved-state is per-user, so render dynamically.
export const dynamic = "force-dynamic";

export default async function ExplorePage({ searchParams }: PageProps) {
  const { cuisine } = await searchParams;
  const session = await auth();
  const isAuthed = !!session?.user;
  const savedIds = isAuthed
    ? new Set(await getSavedRecipeIds())
    : new Set<string>();

  // ── Filtered view: a single cuisine ──
  if (cuisine) {
    const recipes = recipesByCuisine(cuisine);
    return (
      <>
        <section
          style={{
            background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
            padding: "40px 24px 28px",
            borderBottom: "1px solid #fed7aa",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Link
              href="/explore"
              style={{
                fontSize: 13,
                color: "#9a3412",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ← All cuisines
            </Link>
            <h1
              style={{
                fontFamily: "var(--font-d)",
                fontSize: 36,
                fontWeight: 800,
                margin: "10px 0 6px",
                letterSpacing: "-0.02em",
              }}
            >
              {cuisine} cuisine
            </h1>
            <p style={{ color: "#6b7280", margin: 0 }}>
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>
        </section>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "32px 24px 80px",
          }}
        >
          {recipes.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                padding: "40px 0",
              }}
            >
              No recipes in this cuisine yet.
            </p>
          ) : (
            <div className="recipe-grid">
              {recipes.map((r) => (
                <WebRecipeCard
                  key={r.id}
                  recipe={r}
                  initialSaved={savedIds.has(r.id)}
                  isAuthed={isAuthed}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // ── Index view: cuisine grid ──
  const cuisines = getCuisines();
  const total = cuisines.reduce((sum, c) => sum + c.count, 0);
  return (
    <>
      <section
        style={{
          background:
            "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
          padding: "56px 24px 40px",
          borderBottom: "1px solid #fed7aa",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#ea580c",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}
          >
            Explore the world
          </div>
          <h1
            style={{
              fontFamily: "var(--font-d)",
              fontSize: 38,
              fontWeight: 800,
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            Recipes by cuisine
          </h1>
          <p style={{ color: "#6b7280", margin: 0, maxWidth: 520 }}>
            Browse {total} recipes across {cuisines.length} cuisines — from
            home favourites to dishes you&apos;ve never cooked before.
          </p>
        </div>
      </section>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 24px 80px",
        }}
      >
        <CuisineGrid />
      </div>
    </>
  );
}
