/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Recipe } from "@/lib/recipes";
import { Tag } from "@/components/Tag";
import { ClockIcon, StarIcon } from "@/components/Icons";

interface WebRecipeCardProps {
  recipe: Recipe;
  /** Height of the photo hero area in px. Default 200. */
  heroHeight?: number;
  /** Show a pantry match badge e.g. "3/5 match" */
  matchBadge?: string;
  /** Extra class names on the root link */
  className?: string;
}

export function WebRecipeCard({
  recipe,
  heroHeight = 200,
  matchBadge,
  className = "",
}: WebRecipeCardProps) {
  return (
    <Link href={`/recipe/${recipe.id}`} className={`recipe-card-web ${className}`}>
      {/* ── Photo hero ── */}
      <div
        className="recipe-card-web-hero"
        style={{ height: heroHeight, position: "relative", overflow: "hidden" }}
      >
        {/* Real food photo */}
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
          src={`https://images.unsplash.com/${recipe.photo}?w=600&q=80&fit=crop`}
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
