"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { recipes } from "@/lib/recipes";
import { WebRecipeCard } from "@/components/web/WebRecipeCard";
import { Suspense } from "react";

/* ── Ingredient categories ─────────────────────────────────────────── */
const CATEGORIES: { label: string; icon: string; color: string; items: string[] }[] = [
  {
    label: "Proteins",
    icon: "🥩",
    color: "#fee2e2",
    items: ["chicken", "beef", "salmon", "eggs", "tofu", "lamb", "shrimp", "tuna", "turkey", "pork", "bacon"],
  },
  {
    label: "Dairy",
    icon: "🥛",
    color: "#f0f9ff",
    items: ["cheese", "butter", "milk", "yogurt", "cream", "parmesan", "feta", "mozzarella"],
  },
  {
    label: "Grains",
    icon: "🌾",
    color: "#fef9c3",
    items: ["pasta", "rice", "bread", "flour", "oats", "quinoa", "couscous", "farro", "noodles", "tortillas"],
  },
  {
    label: "Vegetables",
    icon: "🥦",
    color: "#dcfce7",
    items: ["tomatoes", "spinach", "broccoli", "onion", "garlic", "potatoes", "carrot", "pepper", "mushrooms", "zucchini", "eggplant", "leek", "celery"],
  },
  {
    label: "Herbs & Fruit",
    icon: "🍋",
    color: "#fef3c7",
    items: ["lemon", "lime", "basil", "cilantro", "parsley", "avocado", "ginger", "jalapeño", "rosemary", "thyme"],
  },
  {
    label: "Pantry",
    icon: "🫙",
    color: "#f3e8ff",
    items: ["olive oil", "soy sauce", "tahini", "cumin", "paprika", "chilli flakes", "honey", "vinegar", "stock", "miso", "fish sauce"],
  },
];

const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);

function PantryContent() {
  const searchParams = useSearchParams();
  const initialIngredients = searchParams.get("ingredients")?.split(",").filter(Boolean) ?? [];

  const [chips, setChips]       = useState<string[]>(initialIngredients);
  const [inputVal, setInputVal] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addChip = (val: string) => {
    const t = val.trim().toLowerCase();
    if (t && !chips.includes(t)) setChips((prev) => [...prev, t]);
    setInputVal("");
    setDropdownOpen(false);
    inputRef.current?.focus();
  };

  const removeChip = (chip: string) => setChips((p) => p.filter((c) => c !== chip));

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault();
      addChip(typeaheadMatches.length > 0 ? typeaheadMatches[0] : inputVal);
    }
    if (e.key === "Backspace" && !inputVal && chips.length)
      setChips((p) => p.slice(0, -1));
    if (e.key === "Escape") setDropdownOpen(false);
  };

  const typeaheadMatches = inputVal.trim().length > 0
    ? ALL_ITEMS.filter((s) =>
        s.toLowerCase().includes(inputVal.toLowerCase()) && !chips.includes(s)
      )
    : [];

  /* Live recipe matching */
  const allWithCount = recipes.map((r) => {
    const matchCount = r.ingredients.filter((ing) =>
      chips.some((chip) => ing.name.toLowerCase().includes(chip))
    ).length;
    return { recipe: r, matchCount };
  });

  const hasChips  = chips.length > 0;
  const displayed = hasChips
    ? [...allWithCount].sort((a, b) => b.matchCount - a.matchCount)
    : allWithCount;
  const topCount  = allWithCount.filter((m) => m.matchCount > 0).length;

  return (
    <>
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="pantry-page-hero">
        <div className="web-container">
          <h1 className="pantry-page-heading">
            Cook from what<br /><em>you already have</em>
          </h1>
          <p className="pantry-page-sub">
            Add ingredients below — recipes update instantly as you build your pantry.
          </p>

          {/* ── Search bar ──────────────────────────────── */}
          <div className="pantry-search-wrap" ref={wrapRef}>
            <div className="pantry-search-bar">
              <span className="pantry-search-icon-left">🔍</span>
              <input
                ref={inputRef}
                className="pantry-search-field"
                placeholder="Search an ingredient… (Enter to add)"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setDropdownOpen(e.target.value.trim().length > 0);
                }}
                onKeyDown={handleKey}
                onFocus={() => { if (inputVal.trim()) setDropdownOpen(true); }}
                autoComplete="off"
              />
              {inputVal.trim() && (
                <button
                  className="pantry-search-add-btn"
                  onMouseDown={(e) => { e.preventDefault(); addChip(inputVal); }}
                >
                  + Add
                </button>
              )}
            </div>

            {/* Typeahead dropdown */}
            {dropdownOpen && typeaheadMatches.length > 0 && (
              <div className="pantry-typeahead-dropdown">
                {typeaheadMatches.slice(0, 8).map((match, i) => {
                  const idx    = match.toLowerCase().indexOf(inputVal.toLowerCase());
                  const before = match.slice(0, idx);
                  const hl     = match.slice(idx, idx + inputVal.length);
                  const after  = match.slice(idx + inputVal.length);
                  return (
                    <button
                      key={match}
                      className={`pantry-typeahead-item${i === 0 ? " first" : ""}`}
                      onMouseDown={(e) => { e.preventDefault(); addChip(match); }}
                    >
                      <span className="pantry-typeahead-basket">🧺</span>
                      <span className="pantry-typeahead-label">
                        {before}
                        <strong>{hl}</strong>
                        {after}
                      </span>
                      <span className="pantry-typeahead-hint">↵ add</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Added chips ─────────────────────────────── */}
          {chips.length > 0 && (
            <div className="pantry-chips-row">
              <span className="pantry-chips-label">{chips.length} ingredient{chips.length !== 1 ? "s" : ""} added:</span>
              <div className="pantry-chips-list">
                {chips.map((chip) => (
                  <span key={chip} className="pantry-chip-lg">
                    {chip}
                    <button
                      className="pantry-chip-lg-remove"
                      onClick={() => removeChip(chip)}
                      aria-label={`Remove ${chip}`}
                    >×</button>
                  </span>
                ))}
                <button className="pantry-clear-btn" onClick={() => setChips([])}>
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Category sections ─────────────────────────────── */}
      <div className="pantry-categories-wrapper">
        <div className="web-container">
          <div className="pantry-categories-header">
            <h2 className="pantry-categories-title">Browse by category</h2>
            <p className="pantry-categories-sub">Click any ingredient to add it to your pantry</p>
          </div>

          {CATEGORIES.map((cat) => {
            const available = cat.items.filter((item) => !chips.includes(item));
            const addedCount = cat.items.length - available.length;
            return (
              <div key={cat.label} className="pantry-category-section">
                <div className="pantry-category-header">
                  <div className="pantry-category-label">
                    <span className="pantry-category-icon" style={{ background: cat.color }}>
                      {cat.icon}
                    </span>
                    <span className="pantry-category-name">{cat.label}</span>
                    {addedCount > 0 && (
                      <span className="pantry-category-added-badge">{addedCount} added ✓</span>
                    )}
                  </div>
                </div>
                <div className="pantry-category-pills">
                  {available.length === 0 ? (
                    <span className="pantry-category-all-added">All {cat.label.toLowerCase()} added ✓</span>
                  ) : (
                    available.map((item) => (
                      <button
                        key={item}
                        className="pantry-pill-btn"
                        onClick={() => addChip(item)}
                      >
                        + {item}
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Results — live ──────────────────────────────── */}
      <div className="pantry-results-section">
        <div className="web-container">
          <div className="web-section-header">
            <h2 className="web-section-title">
              {hasChips
                ? topCount > 0
                  ? `${topCount} recipe${topCount !== 1 ? "s" : ""} match your pantry`
                  : "Showing all recipes"
                : "All recipes"}
            </h2>
            {hasChips && topCount > 0 && (
              <span style={{ fontSize: 13, color: "var(--stone-400)", fontWeight: 500 }}>
                Sorted by best ingredient match
              </span>
            )}
          </div>

          <div className="pantry-results-grid">
            {displayed.map(({ recipe, matchCount }) => (
              <WebRecipeCard
                key={recipe.id}
                recipe={recipe}
                matchBadge={hasChips && matchCount > 0
                  ? `${matchCount}/${recipe.ingredients.length} match`
                  : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function PantryPage() {
  return (
    <Suspense>
      <PantryContent />
    </Suspense>
  );
}
