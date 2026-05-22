/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getCuisines } from "@/lib/recipes";

// ISO-3166-1-alpha-2 country code per cuisine — drives the SVG flag URL.
// `null` = no canonical country (use emoji fallback). flagcdn.com serves a
// stable SVG per code; this avoids the Windows emoji-flag rendering gap.
const META: Record<
  string,
  { code: string | null; emoji: string; tint: string }
> = {
  American:   { code: "us", emoji: "🇺🇸", tint: "#fff7ed" },
  British:    { code: "gb", emoji: "🇬🇧", tint: "#f0f9ff" },
  Canadian:   { code: "ca", emoji: "🇨🇦", tint: "#fef2f2" },
  Chinese:    { code: "cn", emoji: "🇨🇳", tint: "#fef2f2" },
  Croatian:   { code: "hr", emoji: "🇭🇷", tint: "#eff6ff" },
  Dutch:      { code: "nl", emoji: "🇳🇱", tint: "#fff7ed" },
  Egyptian:   { code: "eg", emoji: "🇪🇬", tint: "#fefce8" },
  Filipino:   { code: "ph", emoji: "🇵🇭", tint: "#fef9c3" },
  French:     { code: "fr", emoji: "🇫🇷", tint: "#eef2ff" },
  Greek:      { code: "gr", emoji: "🇬🇷", tint: "#eff6ff" },
  Indian:     { code: "in", emoji: "🇮🇳", tint: "#fff7ed" },
  Irish:      { code: "ie", emoji: "🇮🇪", tint: "#f0fdf4" },
  Italian:    { code: "it", emoji: "🇮🇹", tint: "#fff7ed" },
  Jamaican:   { code: "jm", emoji: "🇯🇲", tint: "#fefce8" },
  Japanese:   { code: "jp", emoji: "🇯🇵", tint: "#fdf2f8" },
  Kenyan:     { code: "ke", emoji: "🇰🇪", tint: "#fef3c7" },
  Korean:     { code: "kr", emoji: "🇰🇷", tint: "#fef2f2" },
  Latam:      { code: null, emoji: "🌎", tint: "#fff7ed" },
  Lebanon:    { code: "lb", emoji: "🇱🇧", tint: "#fefce8" },
  Malaysian:  { code: "my", emoji: "🇲🇾", tint: "#fff7ed" },
  Mexican:    { code: "mx", emoji: "🇲🇽", tint: "#fff7ed" },
  Moroccan:   { code: "ma", emoji: "🇲🇦", tint: "#fff7ed" },
  Polish:     { code: "pl", emoji: "🇵🇱", tint: "#fef2f2" },
  Portuguese: { code: "pt", emoji: "🇵🇹", tint: "#fff7ed" },
  Russian:    { code: "ru", emoji: "🇷🇺", tint: "#eff6ff" },
  Spanish:    { code: "es", emoji: "🇪🇸", tint: "#fff7ed" },
  Thai:       { code: "th", emoji: "🇹🇭", tint: "#fefce8" },
  Tunisian:   { code: "tn", emoji: "🇹🇳", tint: "#fff7ed" },
  Turkish:    { code: "tr", emoji: "🇹🇷", tint: "#fff7ed" },
  Ukrainian:  { code: "ua", emoji: "🇺🇦", tint: "#fef9c3" },
  Vietnamese: { code: "vn", emoji: "🇻🇳", tint: "#f0fdf4" },
  Unknown:    { code: null, emoji: "🌍", tint: "#f9fafb" },
};

interface FlagProps {
  code: string | null;
  emojiFallback: string;
  alt: string;
  size?: number;
}

/** Renders a flag as a real SVG image (consistent across OSes). Falls back
 *  to the unicode emoji for regional clusters like "Latam" / "Unknown". */
function Flag({ code, emojiFallback, alt, size = 28 }: FlagProps) {
  if (!code) {
    return <span style={{ fontSize: size, lineHeight: 1 }}>{emojiFallback}</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={alt}
      width={size}
      height={Math.round((size * 3) / 4)}
      loading="lazy"
      style={{
        width: size,
        height: "auto",
        borderRadius: 3,
        boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
        display: "block",
      }}
    />
  );
}

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
              gap: 8,
              padding: "16px 14px",
              borderRadius: 14,
              background: meta.tint,
              border: "1px solid rgba(0,0,0,0.06)",
              textDecoration: "none",
              color: "#1a1a1a",
              transition: "transform 0.12s, box-shadow 0.12s",
            }}
          >
            <Flag code={meta.code} emojiFallback={meta.emoji} alt={`${name} flag`} />
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
