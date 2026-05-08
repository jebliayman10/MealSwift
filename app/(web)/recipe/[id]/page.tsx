/* eslint-disable @next/next/no-img-element */
import { recipes, getRecipe } from "@/lib/recipes";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ClockIcon, StarIcon, UsersIcon, BookmarkIcon,
  PlayIcon, CalendarIcon, ChevronLeftIcon,
} from "@/components/Icons";
import { Tag } from "@/components/Tag";

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }));
}

export default async function WebRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="recipe-detail-hero" style={{ background: recipe.gradient }}>
        {/* Real food photo */}
        <img
          src={`https://images.unsplash.com/${recipe.photo}?w=1400&q=85&fit=crop`}
          alt={recipe.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "sepia(8%) saturate(110%) brightness(0.88)",
          }}
          loading="eager"
        />
        <div className="recipe-detail-hero-scrim" />

        {/* Breadcrumb + title overlay at bottom */}
        <div className="recipe-detail-hero-bottom">
          <div
            style={{
              maxWidth: 1280,
              width: "100%",
              margin: "0 auto",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <nav className="recipe-detail-breadcrumb" aria-label="Breadcrumb">
              <Link href="/home">Home</Link>
              <span className="recipe-detail-breadcrumb-sep">/</span>
              <Link href="/pantry">Recipes</Link>
              <span className="recipe-detail-breadcrumb-sep">/</span>
              <span style={{ color: "white" }}>{recipe.name}</span>
            </nav>
            <div className="recipe-detail-title-block">
              <h1 className="recipe-detail-recipe-name">{recipe.name}</h1>
              <div className="recipe-detail-tags-row">
                {recipe.tags.map((t) => (
                  <Tag key={t} variant={t} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button className="recipe-detail-save-btn" aria-label="Save recipe">
          <BookmarkIcon width={20} height={20} />
        </button>
      </section>

      {/* ── Main content ─────────────────────────────── */}
      <div className="recipe-detail-layout">
        {/* LEFT: ingredients + steps */}
        <div className="recipe-detail-main">
          {/* Stats strip */}
          <div className="recipe-detail-stats-strip">
            <div className="recipe-stat-tile">
              <div className="recipe-stat-tile-value">{recipe.minutes}</div>
              <div className="recipe-stat-tile-label">Minutes</div>
            </div>
            <div className="recipe-stat-tile">
              <div className="recipe-stat-tile-value">{recipe.ingredients.length}</div>
              <div className="recipe-stat-tile-label">Ingredients</div>
            </div>
            <div className="recipe-stat-tile">
              <div className="recipe-stat-tile-value">{recipe.servings}</div>
              <div className="recipe-stat-tile-label">Servings</div>
            </div>
            <div className="recipe-stat-tile">
              <div className="recipe-stat-tile-value">{recipe.calories}</div>
              <div className="recipe-stat-tile-label">Calories</div>
            </div>
          </div>

          {/* Ingredients */}
          <h2 className="recipe-section-title">Ingredients</h2>
          <ul className="recipe-ingredients-list">
            {recipe.ingredients.map((ing) => (
              <li key={ing.name} className="recipe-ingredient-row">
                <span className="recipe-ingredient-qty">{ing.qty}</span>
                <span className="recipe-ingredient-name">{ing.name}</span>
              </li>
            ))}
          </ul>

          {/* Steps */}
          <h2 className="recipe-section-title">Method</h2>
          <ol className="recipe-steps-list">
            {recipe.steps.map((step, i) => (
              <li key={i} className="recipe-step">
                <div className="recipe-step-num">{i + 1}</div>
                <p className="recipe-step-text">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* RIGHT: sidebar */}
        <aside className="recipe-detail-sidebar">
          {/* YouTube embed */}
          <div className="recipe-sidebar-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff0000">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.6 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z"/>
                <polygon fill="white" points="9.7,15.5 15.8,12 9.7,8.5"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--stone-400)" }}>
                Video guide
              </span>
            </div>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${recipe.youtubeId}?rel=0&modestbranding=1`}
                title={recipe.youtubeTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: "100%", height: "100%",
                  border: "none",
                }}
              />
            </div>
            <div style={{ padding: "10px 16px 14px" }}>
              <a
                href={`https://www.youtube.com/watch?v=${recipe.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, color: "var(--stone-400)", fontWeight: 600,
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {recipe.youtubeTitle} ↗
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="recipe-sidebar-card">
            <div className="recipe-sidebar-card-title">Cook this recipe</div>
            <div className="recipe-action-btns">
              <button className="recipe-cook-btn">
                🍳 Start Cooking
              </button>
              <Link
                href="/calendar"
                style={{ textDecoration: "none", justifyContent: "center", display: "flex", alignItems: "center", gap: 10, background: "var(--parchment)", color: "var(--stone-700)", fontFamily: "var(--font-b)", fontSize: 15, fontWeight: 600, padding: "14px", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--linen-dk)", cursor: "pointer" }}
              >
                <CalendarIcon width={16} height={16} />
                Add to Calendar
              </Link>
            </div>
          </div>

          {/* Rating */}
          <div className="recipe-sidebar-card">
            <div className="recipe-sidebar-card-title">Community rating</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                fontFamily: "var(--font-d)",
                fontSize: 42,
                fontWeight: 700,
                color: "var(--stone-900)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}>
                {recipe.rating}
              </div>
              <div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      width={16}
                      height={16}
                      style={{ color: s <= Math.round(recipe.rating) ? "var(--amber)" : "var(--stone-200)" }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "var(--stone-400)", marginTop: 4 }}>
                  Based on community cooks
                </div>
              </div>
            </div>
          </div>

          {/* Quick info */}
          <div className="recipe-sidebar-card">
            <div className="recipe-sidebar-card-title">At a glance</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: <ClockIcon width={16} height={16} />, label: "Cook time", value: `${recipe.minutes} min` },
                { icon: <UsersIcon width={16} height={16} />, label: "Serves", value: `${recipe.servings} people` },
                { icon: <StarIcon width={16} height={16} style={{ color: "var(--amber)" }} />, label: "Calories", value: `${recipe.calories} kcal` },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--stone-500)", fontSize: 14 }}>
                    <span style={{ color: "var(--stone-400)" }}>{icon}</span>
                    {label}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--stone-900)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--stone-400)",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              padding: "0 4px",
              transition: "color 150ms",
            }}
          >
            <ChevronLeftIcon width={16} height={16} />
            Back to Home
          </Link>
        </aside>
      </div>
    </>
  );
}
