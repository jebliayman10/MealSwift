import type { ReactNode } from "react";
import { StarIcon } from "./Icons";

const labels: Record<string, string> = {
  quick: "Quick",
  veg: "Veg",
  global: "Global",
  new: "New",
  dessert: "Dessert",
  snack: "Snack",
  salad: "Salad",
  soup: "Soup",
  breakfast: "Breakfast",
};

export function Tag({
  variant,
  children,
}: {
  variant: "quick" | "veg" | "global" | "new" | "rating" | "dessert" | "snack" | "salad" | "soup" | "breakfast";
  children?: ReactNode;
}) {
  return (
    <span className={`tag tag-${variant}`}>
      {variant === "rating" && (
        <StarIcon width={10} height={10} />
      )}
      {children ?? labels[variant]}
    </span>
  );
}
