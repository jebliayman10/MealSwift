import Link from "next/link";
import { getCuisines } from "@/lib/recipes";

// Flag + accent colour per cuisine. Anything not listed falls back to a globe.
const META: Record<string, { flag: string; tint: string }> = {
  American:   { flag: "🇺🇸", tint: "#fff7ed" },
  British:    { flag: "🇬🇧", tint: "#f0f9ff" },
  Canadian:   { flag: "🇨🇦", tint: "#fef2f2" },
  Chinese:    { flag: "🇨🇳", tint: "#fef2f2" },
  Croatian:   { flag: "🇭🇷", tint: "#eff6ff" },
  Dutch:      { flag: "🇳🇱", tint: "#fff7ed" },
  Egyptian:   { flag: "🇪🇬", tint: "#fefce8" },
  Filipino:   { flag: "🇵🇭", tint: "#fef9c3" },
  French:     { flag: "🇫🇷", tint: "#eef2ff" },
  Greek:      { flag: "🇬🇷", tint: "#eff6ff" },
  Indian:     { flag: "🇮🇳", tint: "#fff7ed" },
  Irish:      { flag: "🇮🇪", tint: "#f0fdf4" },
  Italian:    { flag: "🇮🇹", tint: "#fff7ed" },
  Jamaican:   { flag: "🇯🇲", tint: "#fefce8" },
  Japanese:   { flag: "🇯🇵", tint: "#fdf2f8" },
  Kenyan:     { flag: "🇰🇪", tint: "#fef3c7" },
  Korean:     { flag: "🇰🇷", tint: "#fef2f2" },
  Latam:      { flag: "🌎", tint: "#fff7ed" },
  Lebanon:    { flag: "🇱🇧", tint: "#fefce8" },
  Malaysian:  { flag: "🇲🇾", tint: "#fff7ed" },
  Mexican:    { flag: "🇲🇽", tint: "#fff7ed" },
  Moroccan:   { flag: "🇲🇦", tint: "#fff7ed" },
  Polish:     { flag: "🇵🇱", tint: "#fef2f2" },
  Portuguese: { flag: "🇵🇹", tint: "#fff7ed" },
  Russian:    { flag: "🇷🇺", tint: "#eff6ff" },
  Spanish:    { flag: "🇪🇸", tint: "#fff7ed" },
  Thai:       { flag: "🇹🇭", tint: "#fefce8" },
  Tunisian:   { flag: "🇹🇳", tint: "#fff7ed" },
  Turkish:    { flag: "🇹🇷", tint: "#fff7ed" },
  Ukrainian:  { flag: "🇺🇦", tint: "#fef9c3" },
  Vietnamese: { flag: "🇻🇳", tint: "#f0fdf4" },
  Unknown:    { flag: "🌍", tint: "#f9fafb" },
};

interface CuisineGridProps {
  /** Cap the number of tiles shown. Useful for the home page preview. */
  limit?: number;
}

export function CuisineGrid({ limit }: CuisineGridProps) {
  const all = getCuisines();
  const cuisines = limit ? all.slice(0, limit) : all;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 12,
      }}
    >
      {cuisines.map(({ name, count }) => {
        const meta = META[name] ?? META.Unknown;
        return (
          <Link
            key={name}
            href={`/explore?cuisine=${encodeURIComponent(name)}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 6,
              padding: "16px 14px",
              borderRadius: 14,
              background: meta.tint,
              border: "1px solid rgba(0,0,0,0.06)",
              textDecoration: "none",
              color: "#1a1a1a",
              transition: "transform 0.12s, box-shadow 0.12s",
            }}
          >
            <span style={{ fontSize: 28, lineHeight: 1 }}>{meta.flag}</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
              {count} {count === 1 ? "recipe" : "recipes"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
