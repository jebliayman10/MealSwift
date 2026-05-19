"use client";

import { useState } from "react";

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

/**
 * Preference UI. These are local-only for now (not yet persisted) — labelled
 * honestly so the product doesn't imply a feature it doesn't have.
 */
export function ProfileSidebar() {
  const [activeLang, setActiveLang] = useState("en");

  return (
    <aside className="profile-sidebar">
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

      <div className="profile-sidebar-section">
        <div className="profile-sidebar-section-title">
          Dietary preferences{" "}
          <span style={{ fontSize: 11, color: "var(--stone-400)", fontWeight: 500 }}>
            · coming soon
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: 0.55 }}>
          {["Vegetarian", "Gluten-free", "Dairy-free", "Low-calorie"].map((label) => (
            <label
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 14,
                color: "var(--stone-700)",
                fontWeight: 500,
              }}
            >
              {label}
              <div
                style={{
                  width: 36,
                  height: 20,
                  background: "var(--stone-200)",
                  borderRadius: "9999px",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 1px 3px oklch(22% 0.02 60 / 0.20)",
                  }}
                />
              </div>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
