/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useMemo, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { recipes, pickFeatured, recipeImage, suggestIngredients } from "@/lib/recipes";
import { ClockIcon, StarIcon, SearchIcon } from "@/components/Icons";
import { Tag } from "@/components/Tag";
import { WebRecipeCard } from "@/components/web/WebRecipeCard";
import { CuisineGrid } from "@/components/web/CuisineGrid";

const QUICK_ADDS = ["tomatoes", "eggs", "pasta", "chicken", "garlic", "spinach"];

const QUICK_RECIPES = recipes.filter((r) => r.tags.includes("quick")).slice(0, 3);

const COMMUNITY_POSTS = [
  { emoji: "🥘", name: "My Shakshuka Twist", creator: "Layla M.", avatar: "👩‍🍳", likes: 84, img: "photo-1482049016688-2d3e1b311543" },
  { emoji: "🍝", name: "Pasta Night Perfection", creator: "Marco R.", avatar: "👨‍🍳", likes: 121, img: "photo-1555949258-eb67b1ef0ceb" },
  { emoji: "🥗", name: "Summer Grain Bowl", creator: "Priya S.", avatar: "🧑‍🍳", likes: 67, img: "photo-1512621776951-a57141f2eefd" },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const [chips, setChips] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Featured pick rotates on each fresh mount (page load). Stable through
  // re-renders within the same mount so it doesn't flash.
  const [featured] = useState(() => pickFeatured());

  // Autocomplete suggestions from the shared ingredient corpus
  const suggestions = useMemo(
    () => suggestIngredients(inputVal, chips, 6),
    [inputVal, chips],
  );

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const addChip = (val: string) => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed && !chips.includes(trimmed)) setChips((prev) => [...prev, trimmed]);
    setInputVal("");
    setDropdownOpen(false);
    inputRef.current?.focus();
  };
  const removeChip = (chip: string) => setChips((prev) => prev.filter((c) => c !== chip));
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault();
      addChip(suggestions.length > 0 ? suggestions[0] : inputVal);
    }
    if (e.key === "Backspace" && !inputVal && chips.length) setChips((prev) => prev.slice(0, -1));
    if (e.key === "Escape") setDropdownOpen(false);
  };

  const findHref = chips.length > 0
    ? `/pantry?ingredients=${encodeURIComponent(chips.join(","))}`
    : "/pantry";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-eyebrow">
            <span className="home-hero-eyebrow-dot" />
            From pantry to plate, instantly
          </div>
          <h1 className="home-hero-headline">
            Cook <em>anything</em> from what you already have
          </h1>
          <p className="home-hero-sub">
            Tell us what&apos;s in your kitchen. We&apos;ll find the perfect recipe — no grocery run needed.
          </p>

          {/* Pantry Search Box (autocomplete from the real ingredient corpus) */}
          <div
            className="pantry-search-box"
            ref={wrapRef}
            style={{ position: "relative" }}
          >
            <div
              className="pantry-search-top"
              onClick={() => inputRef.current?.focus()}
              style={{ cursor: "text" }}
            >
              <SearchIcon width={20} height={20} style={{ color: "var(--terra)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                className="pantry-search-input"
                placeholder={chips.length === 0 ? "Type an ingredient (e.g. onion, chicken)…" : "Add another…"}
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setDropdownOpen(e.target.value.trim().length > 0);
                }}
                onKeyDown={handleKey}
                onFocus={() => { if (inputVal.trim()) setDropdownOpen(true); }}
                autoComplete="off"
              />
            </div>

            {/* Autocomplete dropdown */}
            {dropdownOpen && suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 6,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
                  overflow: "hidden",
                  zIndex: 50,
                }}
              >
                {suggestions.map((s) => {
                  const q = inputVal.toLowerCase();
                  const idx = s.indexOf(q);
                  return (
                    <button
                      key={s}
                      onMouseDown={(e) => { e.preventDefault(); addChip(s); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "10px 16px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: 14,
                        color: "#1a1a1a",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fff7ed")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ fontSize: 16 }}>🧺</span>
                      <span style={{ flex: 1 }}>
                        {idx > -1 ? (
                          <>
                            {s.slice(0, idx)}
                            <strong style={{ color: "#ea580c" }}>{s.slice(idx, idx + q.length)}</strong>
                            {s.slice(idx + q.length)}
                          </>
                        ) : (
                          s
                        )}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#9ca3af",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        ↵ add
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {chips.length > 0 && (
              <div className="pantry-chips-area">
                {chips.map((chip) => (
                  <span key={chip} className="pantry-chip">
                    {chip}
                    <button className="pantry-chip-remove" onClick={() => removeChip(chip)}>×</button>
                  </span>
                ))}
              </div>
            )}

            <div className="pantry-search-footer">
              <div className="pantry-quick-adds">
                <span style={{ fontSize: 12, color: "var(--stone-400)", fontWeight: 600, whiteSpace: "nowrap" }}>Try:</span>
                {QUICK_ADDS.filter((q) => !chips.includes(q)).slice(0, 4).map((q) => (
                  <button key={q} className="pantry-quick-add-btn" onClick={() => addChip(q)}>+ {q}</button>
                ))}
              </div>
              <Link href={findHref} className="pantry-find-btn" style={{ textDecoration: "none" }}>
                Find Recipes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="web-container">

        {/* ── Featured Recipe ─────────────────────────────── */}
        <section className="web-section" style={{ paddingBottom: 0 }}>
          <div className="web-section-header">
            <h2 className="web-section-title">We think you&apos;ll like this</h2>
            <Link href={`/recipe/${featured.id}`} className="web-section-link">View recipe →</Link>
          </div>

          <Link href={`/recipe/${featured.id}`} className="featured-card">
            <div className="featured-card-hero" style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={recipeImage(featured, 900)}
                alt={featured.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "sepia(5%) saturate(115%)" }}
                loading="lazy"
              />
              <div style={{ position: "absolute", inset: 0, background: featured.gradient, opacity: 0.25 }} />
              <div className="featured-card-scrim" />
            </div>
            <div className="featured-card-body">
              <div className="featured-label">✦ A suggestion for you</div>
              <h3 className="featured-title">{featured.name}</h3>
              <p className="featured-desc">
                {featured.description ??
                  `${featured.region ? `A ${featured.region} favourite. ` : ""}Ready in about ${featured.minutes} minutes with ${featured.ingredients.length} ingredients.`}
              </p>
              <div className="featured-stats">
                <div className="featured-stat"><ClockIcon width={16} height={16} style={{ color: "var(--stone-400)" }} />{featured.minutes} min</div>
                <div className="featured-stat"><StarIcon width={16} height={16} style={{ color: "var(--amber)" }} />{featured.rating}</div>
                <div className="featured-stat">{featured.ingredients.length} ingredients</div>
              </div>
              <div className="featured-btn">Cook this recipe <span>→</span></div>
            </div>
          </Link>
        </section>

        {/* ── Quick Picks ─────────────────────────────────── */}
        <section className="web-section">
          <div className="web-section-header">
            <h2 className="web-section-title">Quick picks</h2>
            <Link href="/pantry" className="web-section-link">Browse all →</Link>
          </div>
          <div className="recipe-grid">
            {QUICK_RECIPES.map((recipe) => (
              <WebRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* ── Sign-in Banner (guests only) ────────────────── */}
        {status !== "loading" && !session && (
          <section style={{
            margin: "0 0 40px",
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
            border: "1.5px solid #fdba74",
            padding: "40px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            flexWrap: "wrap",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>🍴</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Free account
                </span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px", lineHeight: 1.2 }}>
                Save recipes & plan your meals
              </h2>
              <p style={{ fontSize: 15, color: "#6b7280", margin: 0, maxWidth: 440, lineHeight: 1.6 }}>
                Create a free account to save your favourite recipes, build weekly meal plans, and get personalised suggestions based on what&apos;s in your pantry.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 220 }}>
              {/* Google */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/home" })}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "13px 20px", border: "1.5px solid #e5e7eb", borderRadius: 12,
                  background: "#fff", fontSize: 15, fontWeight: 600, color: "#1a1a1a",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                  <path d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
                  <path d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.7 0-14.4 4.4-17.7 11.7z" fill="#FF3D00"/>
                  <path d="M24 45c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6C29.6 35.9 26.9 37 24 37c-5.8 0-10.7-3.9-12.4-9.3l-7 5.4C8 40.5 15.4 45 24 45z" fill="#4CAF50"/>
                  <path d="M44.5 20H24v8.5h11.8c-.9 2.7-2.6 4.9-4.9 6.4l6.6 5.6C41.6 37.2 45 31 45 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
                </svg>
                Continue with Google
              </button>

              {/* Email / magic link */}
              <Link href="/sign-in" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px 20px", borderRadius: 12,
                background: "#f97316", color: "#fff",
                fontSize: 15, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
              }}>
                ✉ Sign in with email
              </Link>

              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: 0 }}>
                Already have an account?{" "}
                <Link href="/sign-in" style={{ color: "#f97316", textDecoration: "none", fontWeight: 600 }}>
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        )}

        {/* Show a welcome bar for signed-in users */}
        {status !== "loading" && session && (
          <section style={{
            margin: "0 0 40px",
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            border: "1.5px solid #86efac",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            <span style={{ fontSize: 28 }}>👋</span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#166534" }}>
                Welcome back{session.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}!
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#16a34a" }}>
                Your saved recipes and meal plans are ready.
              </p>
            </div>
            <Link href="/pantry" style={{
              marginLeft: "auto", padding: "10px 20px", borderRadius: 10,
              background: "#16a34a", color: "#fff", fontSize: 14, fontWeight: 700,
              textDecoration: "none",
            }}>
              Find recipes →
            </Link>
          </section>
        )}

        {/* ── Explore by cuisine ──────────────────────────── */}
        <section className="web-section" style={{ paddingTop: 0 }}>
          <div className="web-section-header">
            <h2 className="web-section-title">Explore by cuisine</h2>
            <Link href="/explore" className="web-section-link">See all →</Link>
          </div>
          <CuisineGrid limit={12} />
        </section>

        {/* ── Community ───────────────────────────────────── */}
        <section className="web-section" style={{ paddingTop: 0, paddingBottom: 80 }}>
          <div className="web-section-header">
            <h2 className="web-section-title">From the community</h2>
            <Link href="/community" className="web-section-link">See all posts →</Link>
          </div>
          <div className="recipe-grid">
            {COMMUNITY_POSTS.map((post) => (
              <div key={post.name} className="recipe-card-web" style={{ cursor: "pointer" }}>
                <div className="recipe-card-web-hero" style={{ height: 200, position: "relative", overflow: "hidden" }}>
                  <img
                    src={`https://images.unsplash.com/${post.img}?w=600&q=80&fit=crop`}
                    alt={post.name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "sepia(6%) saturate(110%)" }}
                    loading="lazy"
                  />
                  <div className="recipe-card-web-scrim" />
                  <div className="recipe-card-web-badges" style={{ zIndex: 1 }}>
                    <Tag variant="new" />
                  </div>
                </div>
                <div className="recipe-card-web-body">
                  <div className="recipe-card-web-name">{post.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{post.avatar}</span>
                    <span style={{ fontSize: 13, color: "var(--stone-500)", fontWeight: 600 }}>{post.creator}</span>
                    <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--stone-400)", fontWeight: 600 }}>♥ {post.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
