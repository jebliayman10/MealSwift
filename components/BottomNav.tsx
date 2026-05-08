import Link from "next/link";
import {
  HomeIcon,
  GlobeIcon,
  CommunityIcon,
  PantryIcon,
  ProfileIcon,
} from "./Icons";

const items = [
  { id: "home",      label: "Home",      href: "/app",           Icon: HomeIcon },
  { id: "explore",   label: "Explore",   href: "/app/explore",   Icon: GlobeIcon },
  { id: "community", label: "Community", href: "/app/community", Icon: CommunityIcon },
  { id: "pantry",    label: "Pantry",    href: "/app/pantry",    Icon: PantryIcon },
  { id: "profile",   label: "Profile",   href: "/app/profile",   Icon: ProfileIcon },
];

export function BottomNav({ active }: { active: string }) {
  return (
    <nav className="bottom-nav">
      {items.map(({ id, label, href, Icon }) => {
        const isActive = id === active;
        return (
          <Link
            key={id}
            href={href}
            className={`nav-item ${isActive ? "active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="nav-icon">
              <Icon width={22} height={22} />
            </span>
            <span className="nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
