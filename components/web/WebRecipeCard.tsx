/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Recipe, recipeImage } from "@/lib/recipes";
import { Tag } from "@/components/Tag";
import { ClockIcon, StarIcon } from "@/components/Icons";
import { toggleSavedRecipe } from "@/lib/actions";

interface WebRecipeCardProps {
  recipe: Recipe;
  /** Height of the photo hero area in px. Default 200. */
  heroHeight?: number;
  /** Show a pantry match badge e.g. "3/5 match" */
  matchBadge?: string;
  /** Extra class names on the root link */
  className?: string;
  /** Whether the current user has this recipe saved (server-provided). */
  initialSaved?: boolean;
  /** Whether a user is signed in. Controls save-vs-redirect behaviour. */
  isAuthed?: boolean;
}

export function WebRecipeCard({
  recipe,
  heroHeight = 200,
  matchBadge,
  className = "",
  initialSaved = false,
  isAuthed = false,
}: WebRecipeCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.MouseEvent) => {
    // The card is wrapped in a Link — don't navigate when hitting the heart.
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthed) {
      router.push("/sign-in");
      return;
    }

    // Optimistic update, reconciled with the server result.
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      const res = await toggleSavedRecipe(recipe.id);
      if ("error" in res) {
        setSaved(!next); // roll back
        if (res.error === "AUTH_REQUIRED") router.push("/sign-in");
      } else {
        setSaved(res.saved);
      }
    });
  };

  return (
    <Link href={`/recipe/${recipe.id}`} className={`recipe-card-web ${className}`}>
      {/* ── Photo hero ── */}
      <div
        className="recipe-card-web-hero"
        style={{ height: heroHeight, position: "relative", overflow: "hidden" }}
      >
        {/* Gradient fallback sits under the photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: recipe.gradient,
            zIndex: 0,
          }}
        />
        <img
          src={recipeImage(recipe, 600)}
          alt={recipe.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "sepia(5%) saturate(115%) brightness(0.97)",
            zIndex: 1,
          }}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Scrim */}
        <div className="recipe-card-web-scrim" style={{ zIndex: 1 }} />

        {/* Tag badges */}
        <div className="recipe-card-web-badges" style={{ zIndex: 2 }}>
          {recipe.tags.slice(0, 1).map((tag) => (
            <Tag key={tag} variant={tag} />
          ))}
        </div>

        {/* Save (bookmark) button */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Remove from saved" : "Save recipe"}
          aria-pressed={saved}
          disabled={isPending}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 3,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isPending ? "wait" : "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            transition: "transform 0.12s, background 0.12s",
            transform: isPending ? "scale(0.92)" : "scale(1)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={saved ? "#f97316" : "none"}
            stroke={saved ? "#f97316" : "#6b7280"}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* Pantry match badge */}
        {matchBadge && (
          <div className="pantry-match-badge" style={{ zIndex: 2 }}>
            {matchBadge}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="recipe-card-web-body">
        <div className="recipe-card-web-name">{recipe.name}</div>
        <div className="recipe-card-web-meta">
          <div className="recipe-card-web-meta-item">
            <ClockIcon width={14} height={14} />
            {recipe.minutes} min
          </div>
          <div className="recipe-card-web-meta-item star">
            <StarIcon width={14} height={14} />
            {recipe.rating}
          </div>
          <div className="recipe-card-web-meta-item">{recipe.calories} kcal</div>
        </div>
      </div>
    </Link>
  );
}
