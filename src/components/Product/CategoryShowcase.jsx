import { DeviceMobile, Laptop, Watch, AppleLogo } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { sectionReveal } from "../../lib/motion";

const TILES = [
  { category: "Laptop", label: "Laptops", blurb: "Work and play machines", icon: Laptop },
  { category: "Phone", label: "Phones", blurb: "Flagships and all-rounders", icon: DeviceMobile },
  { category: "Smart watch", label: "Smart watches", blurb: "Track every day", icon: Watch },
  { category: "Macbook", label: "MacBooks", blurb: "The full Apple lineup", icon: AppleLogo },
];

const CategoryShowcase = ({ active, onSelect }) => {
  const reduce = useReducedMotion();

  return (
  <motion.section className="mt-20" aria-labelledby="categories-heading" {...sectionReveal(reduce)}>
    <h2
      id="categories-heading"
      className="mb-5 text-2xl font-semibold tracking-tight text-content"
    >
      Shop by category
    </h2>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {TILES.map(({ category, label, blurb, icon: Icon }) => {
        const selected = active === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            aria-pressed={selected}
            className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-colors ${
              selected
                ? "border-accent bg-accent-soft"
                : "border-subtle bg-surface hover:border-strong"
            }`}
          >
            <span
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors ${
                selected ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"
              }`}
            >
              <Icon size={22} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium text-content">{label}</span>
              <span className="block truncate text-sm text-muted">{blurb}</span>
            </span>
          </button>
        );
      })}
    </div>
  </motion.section>
  );
};

export default CategoryShowcase;
