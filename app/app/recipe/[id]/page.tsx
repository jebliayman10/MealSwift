import Link from "next/link";
import { notFound } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Tag } from "@/components/Tag";
import {
  ChevronLeftIcon,
  BookmarkIcon,
  PlayIcon,
  CalendarIcon,
  StarIcon,
} from "@/components/Icons";
import { getRecipe, recipes } from "@/lib/recipes";
import styles from "./recipe.module.css";

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }));
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();

  return (
    <PhoneFrame>
      <div className={styles.hero} style={{ background: recipe.gradient }}>
        <span className={styles.heroEmoji}>{recipe.emoji}</span>
        <Link href="/app" className={styles.back} aria-label="Back">
          <ChevronLeftIcon width={18} height={18} />
        </Link>
        <button className={styles.save} aria-label="Save recipe" type="button">
          <BookmarkIcon width={18} height={18} />
        </button>
        <div className={styles.heroScrim} />
      </div>

      <div className={styles.content}>
        <div className={styles.tagsRow}>
          {recipe.tags.map((t) => (
            <Tag key={t} variant={t} />
          ))}
          <span className="tag tag-rating">
            <StarIcon width={10} height={10} />
            {recipe.rating}
          </span>
        </div>

        <h1 className={styles.name}>{recipe.name}</h1>

        <div className={styles.stats}>
          <Stat value={recipe.minutes} label="Minutes" />
          <Stat value={recipe.ingredients.length} label="Ingredients" />
          <Stat value={recipe.servings} label="Servings" />
          <Stat value={recipe.calories} label="Calories" />
        </div>

        <h2 className={styles.sectionTitle}>Ingredients</h2>
        <ul className={styles.ingredients}>
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className={styles.ingredient}>
              <span className={styles.qty}>{ing.qty}</span>
              <span className={styles.ingName}>{ing.name}</span>
            </li>
          ))}
        </ul>

        <h2 className={styles.sectionTitle}>Steps</h2>
        <ol className={styles.steps}>
          {recipe.steps.map((s, i) => (
            <li key={i} className={styles.step}>
              <span className={styles.stepNum}>{i + 1}</span>
              <span className={styles.stepText}>{s}</span>
            </li>
          ))}
        </ol>

        <div style={{ height: 80 }} />
      </div>

      <div className={styles.bar}>
        <div className={styles.barInner}>
          <button className="btn-primary" type="button" style={{ flex: 1 }}>
            <PlayIcon width={18} height={18} />
            Watch &amp; cook
          </button>
          <button className="btn-icon" type="button" aria-label="Add to plan">
            <CalendarIcon width={18} height={18} />
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statVal}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
