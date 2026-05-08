/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { WorldMap, MapRegion } from "@/components/website/WorldMap";
import { recipes } from "@/lib/recipes";
import { WebRecipeCard } from "@/components/web/WebRecipeCard";

const REGIONS: {
  id: string;
  name: string;
  flag: string;
  photo: string;   // Unsplash photo ID
  gradient: string;
  tagline: string;
  recipeCount: number;
  highlight: string;
  theme: {
    bg: string;
    accent: string;
    items: { icon: string; label: string }[];
    quote: string;
    color: string;
  };
}[] = [
  {
    id: "europe",
    name: "Europe",
    flag: "🇪🇺",
    photo: "photo-1621996346565-e3dbc646d9a9",   // pasta pomodoro
    gradient: "linear-gradient(135deg, #c9956c33, #e8d5b7)",
    tagline: "Rustic, hearty, timeless",
    recipeCount: 9,
    highlight: "pasta-pomodoro",
    theme: {
      bg: "linear-gradient(135deg, #c9956c, #e8d5b7, #f4e4d4)",
      accent: "#c9956c",
      color: "#7c4a1f",
      quote: "From Roman trattorias to Parisian bistros — European cooking is the art of simplicity perfected.",
      items: [
        { icon: "🍝", label: "Italian pasta" },
        { icon: "🥐", label: "French pastries" },
        { icon: "🥘", label: "Spanish stews" },
        { icon: "🫒", label: "Mediterranean olive oil" },
        { icon: "🍷", label: "Wine country flavours" },
        { icon: "🧀", label: "Artisan cheeses" },
      ],
    },
  },
  {
    id: "asia",
    name: "Asia",
    flag: "🌏",
    photo: "photo-1565628308934-c731959645f2",   // beef ramen
    gradient: "linear-gradient(135deg, #6b9fd433, #dce8f5)",
    tagline: "Bold, fragrant, complex",
    recipeCount: 8,
    highlight: "thai-basil",
    theme: {
      bg: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
      accent: "#48cae4",
      color: "#e0f7fa",
      quote: "From Tokyo street food to Bangkok night markets — Asia's kitchens are a symphony of spice, fire and finesse.",
      items: [
        { icon: "🍜", label: "Ramen & noodles" },
        { icon: "🍣", label: "Japanese sushi" },
        { icon: "🌶️", label: "Sichuan heat" },
        { icon: "🍛", label: "Fragrant curries" },
        { icon: "🥢", label: "Wok-tossed stir-fries" },
        { icon: "🍱", label: "Bento culture" },
      ],
    },
  },
  {
    id: "africa",
    name: "Africa",
    flag: "🌍",
    photo: "photo-1643019237176-8ae0859f1123",   // moroccan tagine
    gradient: "linear-gradient(135deg, #7ab64833, #d4e8c2)",
    tagline: "Spiced, slow-cooked, soulful",
    recipeCount: 1,
    highlight: "tagine",
    theme: {
      bg: "linear-gradient(135deg, #1c1005, #3d2009, #6b3f15)",
      accent: "#ffd166",
      color: "#fff3cd",
      quote: "The slow fire of a tagine, the warmth of berbere spice — African cuisine is ancient wisdom on a plate.",
      items: [
        { icon: "🥘", label: "Moroccan tagines" },
        { icon: "🌶️", label: "Ethiopian berbere" },
        { icon: "🍲", label: "West African stews" },
        { icon: "🫙", label: "Preserved lemons" },
        { icon: "🌿", label: "Aromatic herbs" },
        { icon: "🥜", label: "Peanut sauces" },
      ],
    },
  },
  {
    id: "americas",
    name: "Americas",
    flag: "🌎",
    photo: "photo-1551504734-5ee1c4a1479b",   // fish tacos
    gradient: "linear-gradient(135deg, #e07b5433, #f5e0d8)",
    tagline: "Vibrant, bold, layered",
    recipeCount: 4,
    highlight: "fish-tacos",
    theme: {
      bg: "linear-gradient(135deg, #1a0a00, #3d1500, #6b2a00)",
      accent: "#ff7f50",
      color: "#ffe8d6",
      quote: "From Baja tacos to Brazilian churrasco — the Americas cook with colour, heat and unbridled joy.",
      items: [
        { icon: "🌮", label: "Baja fish tacos" },
        { icon: "🫔", label: "Burrito bowls" },
        { icon: "🥑", label: "Fresh guacamole" },
        { icon: "🍖", label: "BBQ & grills" },
        { icon: "🌽", label: "Corn traditions" },
        { icon: "🍹", label: "Tropical flavours" },
      ],
    },
  },
  {
    id: "middleeast",
    name: "Middle East",
    flag: "🕌",
    photo: "photo-1590412200988-a436970781fa",   // shakshuka
    gradient: "linear-gradient(135deg, #d4a84333, #f5eed8)",
    tagline: "Aromatic, ancient, generous",
    recipeCount: 4,
    highlight: "shakshuka",
    theme: {
      bg: "linear-gradient(135deg, #0d0800, #2a1a00, #4d3100)",
      accent: "#ffd166",
      color: "#fff8e1",
      quote: "Cumin, saffron, pomegranate — the Middle East invented hospitality and built a cuisine around it.",
      items: [
        { icon: "🧆", label: "Falafel & hummus" },
        { icon: "🥚", label: "Shakshuka" },
        { icon: "🫙", label: "Tahini & za'atar" },
        { icon: "🍖", label: "Slow-roasted meats" },
        { icon: "🌿", label: "Fresh herb salads" },
        { icon: "🍯", label: "Pomegranate & honey" },
      ],
    },
  },
  {
    id: "oceania",
    name: "Oceania",
    flag: "🌊",
    photo: "photo-1512621776951-a57141f2eefd",   // grain bowl / fresh
    gradient: "linear-gradient(135deg, #5bb8c433, #d8f0f5)",
    tagline: "Fresh, clean, coastal",
    recipeCount: 1,
    highlight: "grain-bowl",
    theme: {
      bg: "linear-gradient(135deg, #001a2c, #003d5c, #006699)",
      accent: "#06d6a0",
      color: "#e0fff8",
      quote: "Pacific-rim cooking at its finest — clean seafood, tropical fruit, and the eternal summer on a plate.",
      items: [
        { icon: "🐟", label: "Pacific seafood" },
        { icon: "🥗", label: "Grain bowls" },
        { icon: "🥥", label: "Tropical flavours" },
        { icon: "🦞", label: "Grilled barramundi" },
        { icon: "🍍", label: "Fresh tropical fruit" },
        { icon: "🌿", label: "Native bush herbs" },
      ],
    },
  },
];

// Map each continent to the recipe region values it contains
const CONTINENT_REGIONS: Record<string, string[]> = {
  europe:     ["Italy", "France", "Greece", "Spain", "Europe"],
  asia:       ["Japan", "Thailand", "Korea", "India", "China", "Asia"],
  africa:     ["Africa", "Morocco"],
  americas:   ["Latam", "Mexico", "Brazil", "Americas"],
  middleeast: ["Middle East", "Lebanon", "Turkey"],
  oceania:    ["Oceania", "Australia", "New Zealand"],
};

const GLOBAL_RECIPES = recipes.filter((r) => r.tags.includes("global"));
const ALL_RECIPES = recipes;

export default function ExplorePage() {
  const [activeContinent, setActiveContinent] = useState<MapRegion | null>(null);

  const handleContinentClick = useCallback((region: MapRegion) => {
    setActiveContinent(region);
  }, []);

  const activeRegion = activeContinent
    ? REGIONS.find((r) => r.id === activeContinent.id) ?? null
    : null;

  return (
    <>
      {/* ── Hero with globe ──────────────────────────── */}
      <section className="explore-hero">
        <div className="explore-hero-inner">
          <div className="explore-hero-text">
            <div className="explore-hero-eyebrow">🌍 Global flavours</div>
            <h1 className="explore-hero-title">
              Discover recipes from<br /><em>every corner</em> of the world
            </h1>
            <p className="explore-hero-sub">
              From the fragrant tagines of Morocco to the umami-packed stir-fries of Bangkok — MealSwift brings the world&apos;s kitchens to yours.
            </p>
            <p style={{ fontSize: 14, color: "var(--stone-400)", marginTop: 8, fontWeight: 600 }}>
              👆 Click a continent on the globe to explore its cuisine
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <WorldMap onContinentClick={handleContinentClick} />
            <p className="explore-globe-hint">Click a region to explore its cuisine</p>
          </div>
        </div>
      </section>

      {/* ── Continent overlay panel ─────────────────── */}
      {activeRegion && (() => {
        const continentRecipes = ALL_RECIPES.filter(
          (r) => r.region && CONTINENT_REGIONS[activeRegion.id]?.includes(r.region)
        );
        return (
          <div className="continent-overlay" style={{ background: activeRegion.theme.bg }}>
            <button
              className="continent-overlay-close"
              onClick={() => setActiveContinent(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="continent-overlay-inner">
              <div className="continent-overlay-left">
                <div className="continent-overlay-flag">{activeRegion.flag}</div>
                <div className="continent-overlay-photo" style={{ borderRadius: 16, overflow: "hidden", width: 100, height: 70, marginBottom: 4 }}>
                  <img src={`https://images.unsplash.com/${activeRegion.photo}?w=200&q=80&fit=crop`} alt={activeRegion.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h2 className="continent-overlay-name" style={{ color: activeRegion.theme.accent }}>
                  {activeRegion.name}
                </h2>
                <p className="continent-overlay-tagline" style={{ color: activeRegion.theme.color }}>
                  {activeRegion.tagline}
                </p>
                <p className="continent-overlay-quote" style={{ color: activeRegion.theme.color + "cc" }}>
                  &ldquo;{activeRegion.theme.quote}&rdquo;
                </p>
                <div className="continent-overlay-count" style={{ color: activeRegion.theme.accent }}>
                  {continentRecipes.length} recipes
                </div>
              </div>

              <div className="continent-overlay-right">
                <div className="continent-overlay-section-label" style={{ color: activeRegion.theme.color + "88" }}>
                  Signature dishes & traditions
                </div>
                <div className="continent-overlay-items">
                  {activeRegion.theme.items.map((item) => (
                    <div
                      key={item.label}
                      className="continent-item"
                      style={{ borderColor: activeRegion.theme.accent + "33", color: activeRegion.theme.color }}
                    >
                      <span className="continent-item-icon">{item.icon}</span>
                      <span className="continent-item-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── All recipes for this continent ── */}
            {continentRecipes.length > 0 && (
              <div style={{ padding: "0 24px 28px" }}>
                <div className="continent-overlay-section-label" style={{ color: activeRegion.theme.color + "88", marginBottom: 16 }}>
                  All {activeRegion.name} recipes
                </div>
                <div className="recipe-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                  {continentRecipes.map((recipe) => (
                    <WebRecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      heroHeight={160}
                      className="continent-recipe-card"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Regions grid ─────────────────────────────── */}
      <div className="explore-regions-section">
        <h2 className="explore-regions-title">Browse by region</h2>
        <div className="explore-regions-grid">
          {REGIONS.map((region) => {
            const highlight = ALL_RECIPES.find((r) => r.id === region.highlight);
            return (
              <div key={region.name} className="explore-region-card">
                <div className="explore-region-banner" style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={`https://images.unsplash.com/${region.photo}?w=480&q=80&fit=crop`}
                    alt={region.name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
                  <span style={{ position: "absolute", bottom: 10, left: 12, fontSize: 28 }}>{region.flag}</span>
                </div>
                <div className="explore-region-body">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 20 }}>{region.flag}</span>
                    <div className="explore-region-name">{region.name}</div>
                  </div>
                  <div className="explore-region-count">{region.recipeCount} recipes · {region.tagline}</div>
                  {highlight && (
                    <Link href={`/recipe/${highlight.id}`} className="explore-region-recipe-preview">
                      {highlight.emoji} Try: {highlight.name} →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── All global recipes ────────────────────── */}
        <div className="web-section-header" style={{ marginBottom: 24 }}>
          <h2 className="web-section-title">Global recipes</h2>
          <Link href="/pantry" className="web-section-link">See all →</Link>
        </div>
        <div className="recipe-grid">
          {GLOBAL_RECIPES.map((recipe) => (
            <WebRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </>
  );
}
