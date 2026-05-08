/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/Icons";
import { recipes, Recipe } from "@/lib/recipes";

const YEAR = 2026;
const MONTH = 4; // 0-indexed → May

type MealSlot = "breakfast" | "lunch" | "dinner";

type Meal = {
  slot: MealSlot;
  recipeId: string;
  name: string;
  photo: string;
};

type DayMeals = Record<string, Meal[]>;

/* ── Helper: pick diverse recipes for a week ─────────────── */
function pickWeekMeals(): DayMeals {
  const result: DayMeals = {};
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay());

  const used = new Set<string>();
  const pool = [...recipes].sort(() => Math.random() - 0.5);

  const slots: MealSlot[] = ["breakfast", "lunch", "dinner"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const key = padKey(d.getFullYear(), d.getMonth(), d.getDate());

    // Pick 2-3 meals per day
    const numMeals = i % 3 === 0 ? 3 : 2;
    const dayMeals: Meal[] = [];
    const daySlots = slots.slice(slots.length - numMeals);

    for (const slot of daySlots) {
      const pick = pool.find((r) => !used.has(r.id)) ?? pool[0];
      used.add(pick.id);
      if (used.size >= pool.length) used.clear(); // cycle
      dayMeals.push({ slot, recipeId: pick.id, name: pick.name, photo: pick.photo });
    }

    if (dayMeals.length > 0) result[key] = dayMeals;
  }

  return result;
}

const INITIAL_MEALS: DayMeals = {
  "2026-05-05": [
    { slot: "lunch",   recipeId: "pasta-pomodoro", name: "Pasta Pomodoro", photo: "photo-1621996346565-e3dbc646d9a9" },
  ],
  "2026-05-06": [
    { slot: "breakfast", recipeId: "grain-bowl",   name: "Grain Bowl",    photo: "photo-1512621776951-a57141f2eefd" },
    { slot: "dinner",   recipeId: "shakshuka",     name: "Shakshuka",     photo: "photo-1590412200988-a436970781fa" },
  ],
  "2026-05-10": [
    { slot: "dinner",   recipeId: "fish-tacos",    name: "Fish Tacos",    photo: "photo-1551504734-5ee1c4a1479b" },
  ],
  "2026-05-13": [
    { slot: "lunch",    recipeId: "thai-basil",    name: "Thai Basil",    photo: "photo-1567620905732-2d1ec7ab7445" },
    { slot: "dinner",   recipeId: "burrito-bowl",  name: "Burrito Bowl",  photo: "photo-1533606117812-0783e8e690f1" },
  ],
  "2026-05-19": [
    { slot: "dinner",   recipeId: "tagine",        name: "Moroccan Tagine", photo: "photo-1643019237176-8ae0859f1123" },
  ],
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
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
}: {
  meal: Meal & { dateKey: string };
  onClose: () => void;
  onRemove: () => void;
  onReplace: () => void;
}) {
  const recipe = recipes.find((r) => r.id === meal.recipeId);
  return (
    <div className="meal-popup-overlay" onClick={onClose}>
      <div className="meal-popup" onClick={(e) => e.stopPropagation()}>
        {/* Photo */}
        <div className="meal-popup-photo">
          <img
            src={`https://images.unsplash.com/${meal.photo}?w=600&q=80&fit=crop`}
            alt={meal.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="meal-popup-photo-scrim" />
          <button className="meal-popup-close" onClick={onClose}>✕</button>
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
          {recipe?.description && (
            <p className="meal-popup-desc">{recipe.description}</p>
          )}

          <div className="meal-popup-actions">
            <Link
              href={`/recipe/${meal.recipeId}`}
              className="meal-popup-btn primary"
              onClick={onClose}
            >
              View Recipe →
            </Link>
            <button className="meal-popup-btn secondary" onClick={onReplace}>
              🔄 Change Dish
            </button>
            <button className="meal-popup-btn danger" onClick={onRemove}>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(MONTH);
  const [currentYear, setCurrentYear]   = useState(YEAR);
  const [meals, setMeals]               = useState<DayMeals>(INITIAL_MEALS);
  const [view, setView]                 = useState<"month" | "week">("month");
  const [activeMeal, setActiveMeal]     = useState<(Meal & { dateKey: string }) | null>(null);
  const [planning, setPlanning]         = useState(false);

  const today    = new Date();
  const todayKey = padKey(today.getFullYear(), today.getMonth(), today.getDate());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDow    = getFirstDayOfWeek(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  /* Plan my week */
  const handlePlanWeek = () => {
    setPlanning(true);
    setTimeout(() => {
      setMeals((prev) => ({ ...prev, ...pickWeekMeals() }));
      setPlanning(false);
    }, 600);
  };

  /* Replace one meal with a different recipe */
  const handleReplace = () => {
    if (!activeMeal) return;
    const current = meals[activeMeal.dateKey] ?? [];
    const used = Object.values(meals).flat().map((m) => m.recipeId);
    const available = recipes.filter((r) => r.id !== activeMeal.recipeId && !used.includes(r.id));
    const pick = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : recipes[Math.floor(Math.random() * recipes.length)];

    const updated = current.map((m) =>
      m.slot === activeMeal.slot && m.recipeId === activeMeal.recipeId
        ? { ...m, recipeId: pick.id, name: pick.name, photo: pick.photo }
        : m
    );
    setMeals((prev) => ({ ...prev, [activeMeal.dateKey]: updated }));
    setActiveMeal(null);
  };

  const handleRemove = () => {
    if (!activeMeal) return;
    const updated = (meals[activeMeal.dateKey] ?? []).filter(
      (m) => !(m.slot === activeMeal.slot && m.recipeId === activeMeal.recipeId)
    );
    setMeals((prev) => ({ ...prev, [activeMeal.dateKey]: updated }));
    setActiveMeal(null);
  };

  /* Build grid */
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
      {/* Meal popup */}
      {activeMeal && (
        <MealPopup
          meal={activeMeal}
          onClose={() => setActiveMeal(null)}
          onRemove={handleRemove}
          onReplace={handleReplace}
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

          <div className="calendar-view-toggles">
            <button className={`calendar-view-btn${view === "month" ? " active" : ""}`} onClick={() => setView("month")}>Month</button>
            <button className={`calendar-view-btn${view === "week" ? " active" : ""}`} onClick={() => setView("week")}>Week</button>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              style={{ fontSize: 13, fontWeight: 600, color: "var(--stone-500)", background: "white", border: "1.5px solid var(--linen-dk)", borderRadius: "var(--radius-full)", padding: "9px 18px", cursor: "pointer" }}
              onClick={() => { setCurrentMonth(MONTH); setCurrentYear(YEAR); }}
            >
              Today
            </button>
            <button
              className="calendar-plan-btn"
              onClick={handlePlanWeek}
              disabled={planning}
            >
              {planning ? "Planning…" : "✨ Plan my week"}
            </button>
            <Link href="/pantry" className="calendar-add-btn" style={{ textDecoration: "none" }}>
              + Add Meal
            </Link>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          {[{ label: "Breakfast", color: "breakfast" }, { label: "Lunch", color: "lunch" }, { label: "Dinner", color: "dinner" }].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className={`calendar-meal-slot ${color}`} style={{ padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{label}</div>
            </div>
          ))}
          <span style={{ fontSize: 12, color: "var(--stone-400)", marginLeft: 8, fontStyle: "italic" }}>Click any meal to view or change it</span>
        </div>

        {/* Day headers */}
        <div className="calendar-grid-header">
          {DAYS_OF_WEEK.map((d) => <div key={d} className="calendar-day-label">{d}</div>)}
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {cells.map((cell) => {
            const cellMeals = meals[cell.key] ?? [];
            const isToday = cell.key === todayKey && cell.month === "curr";
            const isOther = cell.month !== "curr";

            return (
              <div
                key={cell.key}
                className={`calendar-day-cell${isToday ? " today" : ""}${isOther ? " other-month" : ""}`}
              >
                <div className="calendar-day-num">{cell.day}</div>
                {cellMeals.map((meal, i) => (
                  <button
                    key={i}
                    className={`calendar-meal-slot ${meal.slot} clickable`}
                    onClick={() => setActiveMeal({ ...meal, dateKey: cell.key })}
                    title={`${meal.name} — click to view`}
                  >
                    <span className="calendar-meal-name">{meal.name}</span>
                  </button>
                ))}
                {!isOther && cellMeals.length < 3 && (
                  <Link href="/pantry" className="calendar-add-meal" style={{ textDecoration: "none", fontSize: 11 }}>
                    + meal
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Weekly summary */}
        <div className="calendar-week-summary">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 className="calendar-week-summary-title">This week&apos;s meal plan</h2>
            <button className="calendar-plan-btn" onClick={handlePlanWeek} disabled={planning} style={{ fontSize: 13 }}>
              {planning ? "Planning…" : "✨ Suggest meals for me"}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
            {DAYS_OF_WEEK.map((day, i) => {
              const sunday = new Date(today);
              sunday.setDate(today.getDate() - today.getDay());
              const thisDay = new Date(sunday);
              thisDay.setDate(sunday.getDate() + i);
              const key    = padKey(thisDay.getFullYear(), thisDay.getMonth(), thisDay.getDate());
              const dayMeals = meals[key] ?? [];
              const isToday  = key === todayKey;

              return (
                <div key={day} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: isToday ? "var(--terra)" : "var(--stone-400)", marginBottom: 4 }}>{day}</div>
                  <div style={{ fontSize: 12, color: "var(--stone-500)", marginBottom: 8, fontWeight: isToday ? 700 : 400 }}>{thisDay.getDate()}</div>
                  {dayMeals.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {dayMeals.map((meal, j) => (
                        <button
                          key={j}
                          onClick={() => setActiveMeal({ ...meal, dateKey: key })}
                          style={{ border: "none", cursor: "pointer", borderRadius: 8, overflow: "hidden", padding: 0, width: "100%", height: 44, position: "relative" }}
                          title={meal.name}
                        >
                          <img
                            src={`https://images.unsplash.com/${meal.photo}?w=120&q=70&fit=crop`}
                            alt={meal.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "flex-end", padding: "2px 4px" }}>
                            <span style={{ fontSize: 9, color: "white", fontWeight: 700, lineHeight: 1.2, textAlign: "left" }}>{meal.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: "var(--stone-300)", fontStyle: "italic" }}>empty</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
