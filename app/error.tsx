"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, forward this to your error tracker (Sentry, etc.).
    console.error(error);
  }, [error]);

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
      <span style={{ fontSize: 56 }}>🧯</span>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
        Something went wrong
      </h1>
      <p style={{ color: "#6b7280", margin: 0, maxWidth: 380 }}>
        An unexpected error occurred. You can try again — if it keeps happening,
        we&apos;re on it.
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
        Try again
      </button>
    </div>
  );
}
