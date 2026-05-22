/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/Icons";
import { recipes, recipeImage, type Recipe } from "@/lib/recipes";

/** Image URL for a planned meal's lightweight recipe payload. */
function plannedImage(
  r: PlannedMeal["recipe"],
  width: number,
): string {
  if (r.imageUrl) return r.imageUrl;
  if (r.photo) return `https://images.unsplash.com/${r.photo}?w=${width}&q=70&fit=crop`;
  return "";
}
import {
  generateWeekPlan,
  removeMealPlanEntry,
  setMealPlanEntry,
  type PlannedMeal,
  type MealSlotName,
} from "@/lib/actions";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function padKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/* ── Meal popup ───────────────────────────────────────────── */
function MealPopup({
  meal,
  onClose,
  onRemove,
  onReplace,
  busy,
}: {
  meal: ActiveMeal;
  onClose: () => void;
  onRemove: () => void;
  onReplace: () => void;
  busy: boolean;
}) {
  const recipe = recipes.find((r) => r.id === meal.recipeId);
  return (
    <div className="meal-popup-overlay" onClick={onClose}>
      <div className="meal-popup" onClick={(e) => e.stopPropagation()}>
        <div className="meal-popup-photo">
          <img
            src={recipe ? recipeImage(recipe, 600) : ""}
            alt={meal.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="meal-popup-photo-scrim" />
          <button className="meal-popup-close" onClick={onClose}>
            ✕
          </button>
          <div className="meal-popup-slot-badge">{meal.slot}</div>
        </div>

        <div className="meal-popup-body">
          <h3 className="meal-popup-name">{meal.name}</h3>
          {recipe && (
            <div className="meal-popup-stats">
              <span>⏱ {recipe.minutes} min</span>
              <span>🔥 {recipe.calories} kcal</span>
              <span>⭐ {recipe.rating}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={onReplace}
              disabled={busy}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                background: "#fff",
                fontWeight: 600,
                cursor: busy ? "wait" : "pointer",
              }}
            >
              Swap recipe
            </button>
            <button
              onClick={onRemove}
              disabled={busy}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: "#fee2e2",
                color: "#991b1b",
                fontWeight: 600,
                cursor: busy ? "wait" : "pointer",
              }}
            >
              Remove
            </button>
          </div>
          {recipe && (
            <Link
              href={`/recipe/${recipe.id}`}
              style={{
                display: "block",
                marginTop: 10,
                textAlign: "center",
                padding: "10px",
                borderRadius: 10,
                background: "#f97316",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Open recipe →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

interface ActiveMeal {
  id: string;
  dateKey: string;
  slot: MealSlotName;
  recipeId: string;
  name: string;
}

interface CalendarViewProps {
  initialPlanned: PlannedMeal[];
}

export function CalendarView({ initialPlanned }: CalendarViewProps) {
  const router = useRouter();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [planned, setPlanned] = useState<PlannedMeal[]>(initialPlanned);
  const [activeMeal, setActiveMeal] = useState<ActiveMeal | null>(null);
  const [isPending, startTransition] = useTransition();

  const todayKey = padKey(today.getFullYear(), today.getMonth(), today.getDate());

  // Group by date for fast lookup
  const byDate = useMemo(() => {
    const m = new Map<string, PlannedMeal[]>();
    for (const p of planned) {
      const list = m.get(p.dateKey) ?? [];
      list.push(p);
      m.set(p.dateKey, list);
    }
    // Stable order: breakfast, lunch, dinner
    const ord: Record<MealSlotName, number> = { breakfast: 0, lunch: 1, dinner: 2 };
    for (const list of m.values()) list.sort((a, b) => ord[a.slot] - ord[b.slot]);
    return m;
  }, [planned]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDow = getFirstDayOfWeek(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  /* ── Server-action handlers ── */

  const handlePlanWeek = () => {
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    const startKey = padKey(sunday.getFullYear(), sunday.getMonth(), sunday.getDate());

    startTransition(async () => {
      const res = await generateWeekPlan(startKey);
      if ("error" in res) {
        if (res.error === "AUTH_REQUIRED") router.push("/sign-in");
        return;
      }
      router.refresh(); // server fetches the fresh plan and re-renders
    });
  };

  const handleRemove = () => {
    if (!activeMeal) return;
    const idToRemove = activeMeal.id;
    setPlanned((prev) => prev.filter((p) => p.id !== idToRemove)); // optimistic
    setActiveMeal(null);
    startTransition(async () => {
      const res = await removeMealPlanEntry(idToRemove);
      if ("error" in res) router.refresh(); // reconcile on failure
    });
  };

  const handleReplace = () => {
    if (!activeMeal) return;
    const usedIds = new Set(planned.map((p) => p.recipe.id));
    const candidates = recipes.filter((r) => !usedIds.has(r.id) && r.id !== activeMeal.recipeId);
    const pool = candidates.length > 0 ? candidates : recipes;
    const pick = pool[Math.floor(Math.random() * pool.length)];

    const { dateKey, slot, id: oldId } = activeMeal;
    // Optimistic swap
    setPlanned((prev) =>
      prev.map((p) =>
        p.id === oldId
          ? {
              ...p,
              recipe: {
                id: pick.id, name: pick.name, photo: pick.photo,
                imageUrl: pick.imageUrl, minutes: pick.minutes, calories: pick.calories,
              },
            }
          : p,
      ),
    );
    setActiveMeal(null);
    startTransition(async () => {
      const res = await setMealPlanEntry(dateKey, slot, pick.id);
      if ("error" in res) router.refresh();
      else router.refresh(); // pull canonical state with new id
    });
  };

  /** Quick-add a random meal — no recipe-picker UI yet. The user can swap
   *  it via the modal if they don't like the pick. */
  const handleQuickAdd = (dateKey: string, slot?: MealSlotName) => {
    const existing = (byDate.get(dateKey) ?? []).map((p) => p.slot);
    const slots: MealSlotName[] = ["breakfast", "lunch", "dinner"];
    const chosenSlot = slot ?? slots.find((s) => !existing.includes(s)) ?? "dinner";

    const usedIds = new Set(planned.map((p) => p.recipe.id));
    const candidates = recipes.filter((r) => !usedIds.has(r.id));
    const pool = candidates.length > 0 ? candidates : recipes;
    // eslint-disable-next-line react-hooks/purity
    const pick: Recipe = pool[Math.floor(Math.random() * pool.length)];

    startTransition(async () => {
      const res = await setMealPlanEntry(dateKey, chosenSlot, pick.id);
      if ("error" in res) {
        if (res.error === "AUTH_REQUIRED") router.push("/sign-in");
        return;
      }
      router.refresh();
    });
  };

  /* ── Build month grid ── */
  const prevDays = getDaysInMonth(currentYear, currentMonth - 1 < 0 ? 11 : currentMonth - 1);
  const cells: { day: number; month: "prev" | "curr" | "next"; key: string }[] = [];
  for (let i = 0; i < firstDow; i++) {
    const d = prevDays - firstDow + 1 + i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    cells.push({ day: d, month: "prev", key: padKey(y, m, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: "curr", key: padKey(currentYear, currentMonth, d) });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    cells.push({ day: nextDay++, month: "next", key: padKey(y, m, nextDay - 2) });
  }

  return (
    <>
      {activeMeal && (
        <MealPopup
          meal={activeMeal}
          onClose={() => setActiveMeal(null)}
          onRemove={handleRemove}
          onReplace={handleReplace}
          busy={isPending}
        />
      )}

      <div className="calendar-page">
        {/* Header */}
        <div className="calendar-header">
          <div className="calendar-month-nav">
            <button className="calendar-nav-btn" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeftIcon width={18} height={18} />
            </button>
            <h1 className="calendar-month-title">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h1>
            <button
              className="calendar-nav-btn"
              onClick={nextMonth}
              aria-label="Next month"
              style={{ transform: "rotate(180deg)" }}
            >
              <ChevronLeftIcon width={18} height={18} />
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              style={{
                fontSize: 13, fontWeight: 600, color: "var(--stone-500)",
                background: "white", border: "1.5px solid var(--linen-dk)",
                borderRadius: "var(--radius-full)", padding: "9px 18px", cursor: "pointer",
              }}
              onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); }}
            >
              Today
            </button>
            <button
              className="calendar-plan-btn"
              onClick={handlePlanWeek}
              disabled={isPending}
            >
              {isPending ? "Working…" : "✨ Plan my week"}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Breakfast", color: "breakfast" },
            { label: "Lunch", color: "lunch" },
            { label: "Dinner", color: "dinner" },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                className={`calendar-meal-slot ${color}`}
                style={{ padding: "2px 8px", fontSize: 11, fontWeight: 700 }}
              >
                {label}
              </div>
            </div>
          ))}
          <span style={{ fontSize: 12, color: "var(--stone-400)", marginLeft: 8, fontStyle: "italic" }}>
            Click any meal to view, swap, or remove it
          </span>
        </div>

        {/* ── Mobile list (next 14 days) ── */}
        <div className="calendar-mobile-list">
          {Array.from({ length: 14 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const key = padKey(d.getFullYear(), d.getMonth(), d.getDate());
            const dayMeals = byDate.get(key) ?? [];
            const isToday = i === 0;

            return (
              <div key={key} className={`calendar-mobile-day${isToday ? " today" : ""}`}>
                <div className="calendar-mobile-day-header">
                  <div>
                    <div className="calendar-mobile-day-name">
                      {isToday ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString(undefined, { weekday: "long" })}
                    </div>
                    <div className="calendar-mobile-day-date">
                      {d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  {dayMeals.length < 3 && (
                    <button
                      className="calendar-mobile-add"
                      onClick={() => handleQuickAdd(key)}
                      disabled={isPending}
                    >
                      + Add
                    </button>
                  )}
                </div>

                {dayMeals.length === 0 ? (
                  <div className="calendar-mobile-empty">
                    No meals planned — tap “Add” to plan one.
                  </div>
                ) : (
                  <div className="calendar-mobile-meals">
                    {dayMeals.map((p) => (
                      <button
                        key={p.id}
                        className={`calendar-mobile-meal-row ${p.slot}`}
                        onClick={() =>
                          setActiveMeal({
                            id: p.id, dateKey: p.dateKey, slot: p.slot,
                            recipeId: p.recipe.id, name: p.recipe.name,
                          })
                        }
                      >
                        <img
                          src={plannedImage(p.recipe, 160)}
                          alt=""
                          className="calendar-mobile-meal-img"
                        />
                        <div className="calendar-mobile-meal-info">
                          <div
                            className={`calendar-meal-slot ${p.slot}`}
                            style={{ fontSize: 10, padding: "2px 8px", display: "inline-block", marginBottom: 4 }}
                          >
                            {p.slot.toUpperCase()}
                          </div>
                          <div className="calendar-mobile-meal-name">{p.recipe.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Desktop: day headers ── */}
        <div className="calendar-grid-header">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="calendar-day-label">{d}</div>
          ))}
        </div>

        {/* ── Desktop: month grid ── */}
        <div className="calendar-grid">
          {cells.map((cell) => {
            const cellMeals = byDate.get(cell.key) ?? [];
            const isToday = cell.key === todayKey && cell.month === "curr";
            const isOther = cell.month !== "curr";

            return (
              <div
                key={cell.key}
                className={`calendar-day-cell${isToday ? " today" : ""}${isOther ? " other-month" : ""}`}
              >
                <div className="calendar-day-num">{cell.day}</div>
                {cellMeals.map((p) => (
                  <button
                    key={p.id}
                    className={`calendar-meal-slot ${p.slot} clickable`}
                    onClick={() =>
                      setActiveMeal({
                        id: p.id, dateKey: p.dateKey, slot: p.slot,
                        recipeId: p.recipe.id, name: p.recipe.name,
                      })
                    }
                    title={`${p.recipe.name} — click to view`}
                  >
                    <span className="calendar-meal-name">{p.recipe.name}</span>
                  </button>
                ))}
                {!isOther && cellMeals.length < 3 && (
                  <button
                    className="calendar-add-meal"
                    style={{ fontSize: 11, background: "none", border: "none", cursor: "pointer", color: "var(--stone-400)" }}
                    onClick={() => handleQuickAdd(cell.key)}
                    disabled={isPending}
                  >
                    + meal
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
