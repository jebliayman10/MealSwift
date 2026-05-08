"use client";

import { useState } from "react";
import { recipes } from "@/lib/recipes";
import { WebRecipeCard } from "@/components/web/WebRecipeCard";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "French" },
  { code: "es", flag: "🇲🇽", label: "Spanish" },
  { code: "de", flag: "🇩🇪", label: "German" },
  { code: "ja", flag: "🇯🇵", label: "Japanese" },
  { code: "hi", flag: "🇮🇳", label: "Hindi" },
  { code: "ar", flag: "🇸🇦", label: "Arabic" },
  { code: "zh", flag: "🇨🇳", label: "Chinese" },
  { code: "pt", flag: "🇧🇷", label: "Portuguese" },
  { code: "it", flag: "🇮🇹", label: "Italian" },
];

const TABS = ["Saved", "Created", "History"];

const SAVED_RECIPES = recipes.slice(0, 6);
const CREATED_RECIPES = recipes.slice(2, 4);
const HISTORY_RECIPES = recipes.slice(0, 5);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Saved");
  const [activeLang, setActiveLang] = useState("en");

  const displayedRecipes =
    activeTab === "Saved"
      ? SAVED_RECIPES
      : activeTab === "Created"
      ? CREATED_RECIPES
      : HISTORY_RECIPES;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="profile-hero">
        <div className="profile-hero-inner">
          <div className="profile-avatar-ring">
            <div className="profile-avatar-inner">👩‍🍳</div>
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-display-name">Alex Chen</h1>
            <p className="profile-bio">Home cook · food explorer · perpetual recipe tweaker</p>
            <div className="profile-stats-row">
              <div className="profile-stat-item">
                <div className="profile-stat-value">42</div>
                <div className="profile-stat-label">Saved</div>
              </div>
              <div className="profile-stat-item">
                <div className="profile-stat-value">7</div>
                <div className="profile-stat-label">Created</div>
              </div>
              <div className="profile-stat-item">
                <div className="profile-stat-value">128</div>
                <div className="profile-stat-label">Cooked</div>
              </div>
              <div className="profile-stat-item">
                <div className="profile-stat-value">🔥 14</div>
                <div className="profile-stat-label">Day streak</div>
              </div>
            </div>
          </div>
          <button className="profile-edit-btn">Edit profile</button>
        </div>
      </section>

      {/* ── Layout ───────────────────────────────────── */}
      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          {/* Language preferences */}
          <div className="profile-sidebar-section">
            <div className="profile-sidebar-section-title">Recipe language</div>
            <div className="profile-lang-grid">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`profile-lang-btn${activeLang === lang.code ? " active" : ""}`}
                  onClick={() => setActiveLang(lang.code)}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary preferences */}
          <div className="profile-sidebar-section">
            <div className="profile-sidebar-section-title">Dietary preferences</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Vegetarian", active: false },
                { label: "Gluten-free", active: false },
                { label: "Dairy-free", active: false },
                { label: "Low-calorie", active: true },
              ].map(({ label, active }) => (
                <label
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "var(--stone-700)",
                    fontWeight: 500,
                  }}
                >
                  {label}
                  <div style={{
                    width: 36, height: 20,
                    background: active ? "var(--terra)" : "var(--stone-200)",
                    borderRadius: "9999px",
                    position: "relative",
                    transition: "background 200ms",
                    flexShrink: 0,
                  }}>
                    <div style={{
                      position: "absolute",
                      top: 2,
                      left: active ? 18 : 2,
                      width: 16, height: 16,
                      borderRadius: "50%",
                      background: "white",
                      boxShadow: "0 1px 3px oklch(22% 0.02 60 / 0.20)",
                      transition: "left 200ms var(--ease-spring)",
                    }} />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* App settings */}
          <div className="profile-sidebar-section">
            <div className="profile-sidebar-section-title">Notifications</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Daily recipe pick", active: true },
                { label: "Community likes", active: true },
                { label: "Weekly digest", active: false },
              ].map(({ label, active }) => (
                <label
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "var(--stone-700)",
                    fontWeight: 500,
                  }}
                >
                  {label}
                  <div style={{
                    width: 36, height: 20,
                    background: active ? "var(--terra)" : "var(--stone-200)",
                    borderRadius: "9999px",
                    position: "relative",
                    flexShrink: 0,
                  }}>
                    <div style={{
                      position: "absolute",
                      top: 2,
                      left: active ? 18 : 2,
                      width: 16, height: 16,
                      borderRadius: "50%",
                      background: "white",
                      boxShadow: "0 1px 3px oklch(22% 0.02 60 / 0.20)",
                    }} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="profile-content">
          <div className="profile-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`profile-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "Saved" && `Saved (${SAVED_RECIPES.length})`}
                {tab === "Created" && `Created (${CREATED_RECIPES.length})`}
                {tab === "History" && `History (${HISTORY_RECIPES.length})`}
              </button>
            ))}
          </div>

          <div className="profile-recipes-grid">
            {displayedRecipes.map((recipe) => (
              <WebRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
