import Link from "next/link";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import {
  ClockIcon,
  StarIcon,
  UsersIcon,
  SearchIcon,
  PantryIcon,
} from "@/components/Icons";
import { recipes, featured } from "@/lib/recipes";
import styles from "./home.module.css";

export default function HomePage() {
  const quickPicks = recipes.filter((r) => r.id !== featured.id).slice(0, 3);
  const globalPicks = recipes.filter((r) => r.tags.includes("global")).slice(0, 3);

  return (
    <PhoneFrame bottomNav={<BottomNav active="home" />}>
      <header className={styles.header}>
        <div>
          <div className={styles.greetingPre}>Good evening</div>
          <div className={styles.greeting}>
            What shall we<br />
            <span>cook tonight?</span>
          </div>
        </div>
        <div className={styles.avatar}>A</div>
      </header>

      <div className={styles.searchBar}>
        <SearchIcon width={16} height={16} className={styles.searchIcon} />
        <span>What&apos;s in your fridge?</span>
      </div>

      <Link href="/app/pantry" className={styles.pantryBanner}>
        <span className={styles.pantryIcon}>
          <PantryIcon width={22} height={22} stroke="white" />
        </span>
        <span className={styles.pantryText}>
          <span className={styles.pantryTitle}>Your pantry</span>
          <span className={styles.pantrySub}>Tap to manage your ingredients</span>
        </span>
        <span className={styles.pantryCount}>4</span>
      </Link>

      <Link href={`/recipe/${featured.id}`} className={styles.featured}>
        <div className={styles.featuredBg} style={{ background: featured.gradient }}>
          <span className={styles.featuredEmoji}>{featured.emoji}</span>
        </div>
        <div className={styles.featuredScrim} />
        <div className={styles.featuredBody}>
          <div className={styles.featuredLabel}>⚡ Ready in {featured.minutes} min</div>
          <div className={styles.featuredTitle}>{featured.name}</div>
          <div className={styles.featuredMeta}>
            <span className={styles.metaItem}>
              <ClockIcon width={12} height={12} /> {featured.minutes} min
            </span>
            <span className={styles.metaItem}>
              <StarIcon width={12} height={12} /> {featured.rating}
            </span>
            <span className={styles.metaItem}>
              <UsersIcon width={12} height={12} /> Serves {featured.servings}
            </span>
          </div>
        </div>
      </Link>

      <Section title="Quick picks">
        {quickPicks.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </Section>

      <Section title="Global explore" linkHref="/app/explore">
        {globalPicks.map((r) => (
          <RecipeCard key={r.id} recipe={r} regionTag={r.region} />
        ))}
      </Section>

      <div style={{ height: 16 }} />
    </PhoneFrame>
  );
}

function Section({
  title,
  linkHref,
  children,
}: {
  title: string;
  linkHref?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {linkHref ? (
          <Link href={linkHref} className={styles.sectionLink}>
            See all
          </Link>
        ) : (
          <span className={styles.sectionLink}>See all</span>
        )}
      </div>
      <div className={styles.scrollRow}>{children}</div>
    </>
  );
}
