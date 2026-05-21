/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { BrandMark } from "@/components/website/BrandMark";
import { SearchIcon } from "@/components/Icons";

const NAV_LINKS = [
  { href: "/home",      label: "Home" },
  { href: "/explore",   label: "Explore" },
  { href: "/community", label: "Community" },
  { href: "/pantry",    label: "Pantry" },
  { href: "/calendar",  label: "Calendar" },
];

export function WebNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="web-nav">
      <div className="web-nav-inner">
        <Link href="/home" className="web-nav-logo">
          <div className="web-nav-logo-mark">
            <BrandMark size={20} />
          </div>
          <span className="web-nav-wordmark">MealSwift</span>
        </Link>

        <div className="web-nav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`web-nav-link${pathname === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="web-nav-actions">
          <button className="web-nav-search-btn" aria-label="Search">
            <SearchIcon width={18} height={18} />
          </button>

          {status === "loading" ? null : session?.user ? (
            // ── Signed in: profile chip + sign out ──
            <>
              <Link
                href="/profile"
                className={`web-nav-link${pathname === "/profile" ? " active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 999,
                }}
                aria-label="Open profile"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "#f97316",
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {(session.user.name ?? session.user.email ?? "?")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {session.user.name?.split(" ")[0] ?? "Profile"}
                </span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/home" })}
                style={{
                  background: "transparent",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#374151",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            // ── Signed out: Sign in (text) + Sign up (CTA) ──
            <>
              <Link
                href="/sign-in"
                className="web-nav-link"
                style={{ fontWeight: 600 }}
              >
                Sign in
              </Link>
              <Link href="/sign-in" className="web-nav-cta">
                Sign up free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
