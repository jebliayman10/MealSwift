"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/website/BrandMark";
import { SearchIcon } from "@/components/Icons";

const NAV_LINKS = [
  { href: "/home",      label: "Home" },
  { href: "/explore",   label: "Explore" },
  { href: "/community", label: "Community" },
  { href: "/pantry",    label: "Pantry" },
  { href: "/calendar",  label: "Calendar" },
  { href: "/profile",   label: "Profile" },
];

export function WebNav() {
  const pathname = usePathname();

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
          <Link href="/" className="web-nav-cta">
            Get the App
          </Link>
        </div>
      </div>
    </nav>
  );
}
