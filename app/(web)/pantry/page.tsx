"use client";

import {
  useState,
  useRef,
  useMemo,
  useEffect,
  Suspense,
  type KeyboardEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  recipes,
  normalizeIngredient,
  suggestIngredients,
  type Recipe,
} from "@/lib/recipes";
import { WebRecipeCard } from "@/components/web/WebRecipeCard";

/* ── Smart ranking ───────────────────────────────────────────────────────
   For each recipe, compute:
     • matched   = how many of the recipe's ingredients the user has
     • coverage  = matched / recipe.ingredients.length   (0..1)
     • missing   = recipe.ingredients.length - matched
   A user with 5 ingredients picks a recipe that uses most of them and
   doesn't need 10 more. Sort by coverage DESC, then by `missing` ASC. */
interface Scored {
  recipe: Recipe;
  matched: number;
  coverage: number;
  missing: number;
}

function rankRecipes(have: string[]): Scored[] {
  if (have.length === 0) return [];
  const haveLower = have.map((h) => h.toLowerCase());
  const out: Scored[] = [];
  for (const r of recipes) {
    let matched = 0;
    for (const ing of r.ingredients) {
      const n = normalizeIngredient(ing.name);
      if (haveLower.some((h) => n.includes(h) || h.includes(n))) matched++;
    }
    if (matched === 0) continue;
    const total = r.ingredients.length || 1;
    out.push({
      recipe: r,
      matched,
      coverage: matched / total,
      missing: total - matched,
    });
  }
  return out.sort((a, b) =>
    b.coverage - a.coverage || a.missing - b.missing || b.matched - a.matched
  );
}

const COVERAGE_THRESHOLD = 2 / 3; // "first picks need at least 2/3 of ingredients"

/* ── Page ────────────────────────────────────────────────────────────── */
function PantryContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("ingredients")?.split(",").filter(Boolean) ?? [];

  const [chips, setChips] = useState<string[]>(initial);
  const [inputVal, setInputVal] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
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
    const t = val.trim().toLowerCase();
    if (t && !chips.includes(t)) setChips((p) => [...p, t]);
    setInputVal("");
    setDropdownOpen(false);
    inputRef.current?.focus();
  };

  const removeChip = (chip: string) => setChips((p) => p.filter((c) => c !== chip));

  /* Autocomplete suggestions from the real ingredient corpus */
  const suggestions = useMemo(
    () => suggestIngredients(inputVal, chips, 8),
    [inputVal, chips]
  );

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault();
      // Prefer the first suggestion if it starts with what the user typed,
      // otherwise add their raw input as a free-form ingredient.
      addChip(suggestions.length > 0 ? suggestions[0] : inputVal);
    }
    if (e.key === "Backspace" && !inputVal && chips.length) {
      setChips((p) => p.slice(0, -1));
    }
    if (e.key === "Escape") setDropdownOpen(false);
  };

  /* Live recipe ranking — recomputed when chips change */
  const ranked = useMemo(() => rankRecipes(chips), [chips]);
  const great = ranked.filter((s) => s.coverage >= COVERAGE_THRESHOLD).slice(0, 5);
  const more = ranked.filter((s) => !great.some((g) => g.recipe.id === s.recipe.id)).slice(0, 24);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
          padding: "56px 24px 40px",
          borderBottom: "1px solid #fed7aa",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
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
            What&apos;s in your kitchen?
          </div>
          <h1
            style={{
              fontFamily: "var(--font-d)",
              fontSize: 36,
              fontWeight: 800,
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Cook from what you already have
          </h1>
          <p
            style={{
              color: "#6b7280",
              margin: "0 0 28px",
              fontSize: 15,
              maxWidth: 520,
              marginInline: "auto",
              lineHeight: 1.5,
            }}
          >
            Type an ingredient — we&apos;ll suggest what you can make. The more
            ingredients you add, the better the matches.
          </p>

          {/* Search box */}
          <div
            ref={wrapRef}
            style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#fff",
                border: "1.5px solid #fdba74",
                borderRadius: 14,
                padding: "12px 16px",
                boxShadow: "0 2px 14px rgba(249, 115, 22, 0.08)",
              }}
              onClick={() => inputRef.current?.focus()}
            >
              <span style={{ fontSize: 18 }}>🔍</span>
              <input
                ref={inputRef}
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setDropdownOpen(e.target.value.trim().length > 0);
                }}
                onKeyDown={handleKey}
                onFocus={() => {
                  if (inputVal.trim()) setDropdownOpen(true);
                }}
                placeholder={
                  chips.length === 0
                    ? "Type an ingredient (e.g. onion, chicken, tomato)…"
                    : "Add another ingredient…"
                }
                autoComplete="off"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 16,
                  background: "transparent",
                  color: "#1a1a1a",
                  minWidth: 0,
                }}
              />
              {inputVal.trim() && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addChip(suggestions[0] ?? inputVal);
                  }}
                  style={{
                    background: "#f97316",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              )}
            </div>

            {/* Autocomplete dropdown */}
            {dropdownOpen && suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
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
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addChip(s);
                      }}
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
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fff7ed")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span style={{ fontSize: 16 }}>🧺</span>
                      <span style={{ flex: 1 }}>
                        {idx > -1 ? (
                          <>
                            {s.slice(0, idx)}
                            <strong style={{ color: "#ea580c" }}>
                              {s.slice(idx, idx + q.length)}
                            </strong>
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
          </div>

          {/* Added chips */}
          {chips.length > 0 && (
            <div
              style={{
                marginTop: 18,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
              }}
            >
              {chips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#fff",
                    border: "1px solid #fdba74",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#7c2d12",
                  }}
                >
                  {chip}
                  <button
                    onClick={() => removeChip(chip)}
                    aria-label={`Remove ${chip}`}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#9a3412",
                      cursor: "pointer",
                      fontSize: 16,
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setChips([])}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9a3412",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: "6px 8px",
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Results ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        {chips.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#6b7280",
            }}
          >
            <span style={{ fontSize: 48 }}>🥕</span>
            <p style={{ marginTop: 12, fontWeight: 600, fontSize: 16 }}>
              Add an ingredient to get started
            </p>
            <p style={{ marginTop: 4, fontSize: 13 }}>
              Try <em>chicken</em>, <em>tomato</em>, or <em>pasta</em>.
            </p>
          </div>
        ) : ranked.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#6b7280",
            }}
          >
            <span style={{ fontSize: 48 }}>🤔</span>
            <p style={{ marginTop: 12, fontWeight: 600 }}>
              Nothing matches yet — try a more common ingredient.
            </p>
          </div>
        ) : (
          <>
            {/* Great matches (≥2/3 coverage) */}
            {great.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <div className="web-section-header">
                  <h2 className="web-section-title">
                    ✨ Best matches{" "}
                    <span style={{ color: "#9ca3af", fontWeight: 500, fontSize: 14 }}>
                      ({great.length})
                    </span>
                  </h2>
                  <span style={{ fontSize: 13, color: "var(--stone-400)", fontWeight: 500 }}>
                    You have at least 2/3 of the ingredients
                  </span>
                </div>
                <div className="recipe-grid">
                  {great.map(({ recipe, matched, missing }) => (
                    <WebRecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      matchBadge={`${matched}/${matched + missing}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Wider matches */}
            {more.length > 0 && (
              <section>
                <div className="web-section-header">
                  <h2 className="web-section-title">
                    {great.length > 0 ? "Need a few more" : "Closest matches"}{" "}
                    <span style={{ color: "#9ca3af", fontWeight: 500, fontSize: 14 }}>
                      ({more.length})
                    </span>
                  </h2>
                  <span style={{ fontSize: 13, color: "var(--stone-400)", fontWeight: 500 }}>
                    You&apos;ll need to buy more ingredients
                  </span>
                </div>
                <div className="recipe-grid">
                  {more.map(({ recipe, matched, missing }) => (
                    <WebRecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      matchBadge={`${matched}/${matched + missing} · need ${missing}`}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
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
