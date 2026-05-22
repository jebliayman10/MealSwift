import Link from "next/link";
import { auth } from "@/auth";
import { getMealPlan } from "@/lib/actions";
import { CalendarView } from "./CalendarView";

// Meal plan is per-user — never cache.
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const session = await auth();

  // ── Signed-out CTA ───────────────────────────────────────────
  if (!session?.user) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 16,
          padding: 24,
        }}
      >
        <span style={{ fontSize: 48 }}>🗓️</span>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          Sign in to plan your meals
        </h1>
        <p style={{ color: "var(--stone-500)", maxWidth: 380, margin: 0 }}>
          Build a weekly meal plan, save your favourite combos, and pick up
          right where you left off.
        </p>
        <Link
          href="/sign-in"
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
          Sign in
        </Link>
      </div>
    );
  }

  // Fetch a wide window so navigating across months feels instant.
  // (~3 months back, 3 months forward.)
  const now = new Date();
  const startWindow = new Date(now);
  startWindow.setMonth(now.getMonth() - 3);
  const endWindow = new Date(now);
  endWindow.setMonth(now.getMonth() + 3);

  const toKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const planned = await getMealPlan(toKey(startWindow), toKey(endWindow));

  return <CalendarView initialPlanned={planned} />;
}
