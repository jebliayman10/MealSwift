"use client";

// Catches errors in the root layout itself. Must render its own <html>/<body>.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 14,
          fontFamily: "system-ui, sans-serif",
          background: "#fff7ed",
        }}
      >
        <span style={{ fontSize: 56 }}>🍴</span>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          MealSwift hit a snag
        </h1>
        <p style={{ color: "#6b7280", margin: 0 }}>
          Please reload the page.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 8,
            padding: "12px 28px",
            borderRadius: 12,
            background: "#f97316",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
