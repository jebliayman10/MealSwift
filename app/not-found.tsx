import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 14,
        padding: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: 56 }}>🍳</span>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Page not found</h1>
      <p style={{ color: "#6b7280", margin: 0, maxWidth: 360 }}>
        We couldn&apos;t find that page. It may have moved or never existed.
      </p>
      <Link
        href="/home"
        style={{
          marginTop: 8,
          padding: "12px 28px",
          borderRadius: 12,
          background: "#f97316",
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Back to MealSwift
      </Link>
    </div>
  );
}
