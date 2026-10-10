import { MagnifyingGlass } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Card from "../Card/Card";
import { useProducts } from "../../hooks/useProducts";
import { applyFilters } from "../../hooks/useProductFilters";
import { CardGridSkeleton } from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import ErrorRetry from "../ui/ErrorRetry";
import { staggerChild, staggerParent } from "../../lib/motion";

const Cards = ({ filters, onReset }) => {
  const { data, status, error, retry } = useProducts();
  const reduce = useReducedMotion();

  if (status === "loading") return <CardGridSkeleton />;

  if (status === "error") {
    return (
      <ErrorRetry
        title="Couldn't load products"
        message={error?.message || "Check your connection and try again."}
        onRetry={retry}
      />
    );
  }

  const visible = applyFilters(data, filters);

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={MagnifyingGlass}
        title="No matching products"
        description="Nothing matches these filters. Try widening your search."
        action={
          onReset && (
            <button
              onClick={onReset}
              className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
            >
              Clear filters
            </button>
          )
        }
      />
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      {...staggerParent(reduce)}
    >
      {visible.map((card) => (
        <motion.div key={card.product_id} {...staggerChild(reduce)}>
          <Card card={card} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Cards;
