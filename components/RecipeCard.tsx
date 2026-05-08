import Link from "next/link";
import type { Recipe } from "@/lib/recipes";
import { ClockIcon, StarIcon } from "./Icons";
import { Tag } from "./Tag";

import styles from "./RecipeCard.module.css";

export function RecipeCard({ recipe, regionTag }: { recipe: Recipe; regionTag?: string }) {
  const tag = regionTag
    ? { variant: "global" as const, label: regionTag }
    : recipe.tags[0]
    ? { variant: recipe.tags[0], label: undefined }
    : null;

  return (
    <Link href={`/recipe/${recipe.id}`} className={styles.card}>
      <div className={styles.img} style={{ background: recipe.gradient }}>
        <span className={styles.emoji}>{recipe.emoji}</span>
        <div className={styles.scrim} />
        {tag && (
          <div className={styles.tags}>
            <Tag variant={tag.variant}>{tag.label}</Tag>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{recipe.name}</div>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <ClockIcon width={10} height={10} /> {recipe.minutes} min
          </span>
          {recipe.rating > 0 && (
            <span className={styles.metaItem}>
              <StarIcon width={10} height={10} /> {recipe.rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
