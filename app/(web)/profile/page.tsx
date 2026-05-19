import Link from "next/link";
import { auth } from "@/auth";
import { getSavedRecipes } from "@/lib/actions";
import { WebRecipeCard } from "@/components/web/WebRecipeCard";
import { ProfileSidebar } from "./ProfileSidebar";

// Always render fresh — saved recipes change per request/user.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();

  // ── Signed-out state ──────────────────────────────────────────
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
        <span style={{ fontSize: 48 }}>👩‍🍳</span>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          Sign in to see your profile
        </h1>
        <p style={{ color: "var(--stone-500)", maxWidth: 360, margin: 0 }}>
          Save recipes, build meal plans, and pick up where you left off.
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

  // ── Signed-in state ───────────────────────────────────────────
  const saved = await getSavedRecipes();
  const user = session.user;
  const firstName = user.name?.split(" ")[0] ?? "there";
  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <>
      <section className="profile-hero">
        <div className="profile-hero-inner">
          <div className="profile-avatar-ring">
            <div className="profile-avatar-inner">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? "Profile"}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 32, fontWeight: 800 }}>{initial}</span>
              )}
            </div>
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-display-name">{user.name ?? firstName}</h1>
            <p className="profile-bio">{user.email}</p>
            <div className="profile-stats-row">
              <div className="profile-stat-item">
                <div className="profile-stat-value">{saved.length}</div>
                <div className="profile-stat-label">Saved</div>
              </div>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/auth");
              await signOut({ redirectTo: "/home" });
            }}
          >
            <button className="profile-edit-btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </section>

      <div className="profile-layout">
        <ProfileSidebar />

        <div className="profile-content">
          <div className="profile-tabs">
            <button className="profile-tab active">Saved ({saved.length})</button>
          </div>

          {saved.length === 0 ? (
            <div
              style={{
                padding: "60px 24px",
                textAlign: "center",
                color: "var(--stone-500)",
              }}
            >
              <span style={{ fontSize: 40 }}>🔖</span>
              <p style={{ marginTop: 12, fontWeight: 600 }}>No saved recipes yet</p>
              <p style={{ fontSize: 14, marginTop: 4 }}>
                Tap the bookmark on any recipe to save it here.
              </p>
              <Link
                href="/home"
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  padding: "10px 22px",
                  borderRadius: 10,
                  background: "#f97316",
                  color: "#fff",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Browse recipes
              </Link>
            </div>
          ) : (
            <div className="profile-recipes-grid">
              {saved.map((recipe) => (
                <WebRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  initialSaved
                  isAuthed
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
