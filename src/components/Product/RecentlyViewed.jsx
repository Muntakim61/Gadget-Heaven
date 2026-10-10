import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { sectionReveal } from "../../lib/motion";

const RecentlyViewed = ({ items, excludeId }) => {
  const reduce = useReducedMotion();
  const visible = items.filter((p) => String(p.product_id) !== String(excludeId));
  if (visible.length === 0) return null;

  return (
    <motion.section className="mt-16" aria-labelledby="recently-viewed-heading" {...sectionReveal(reduce)}>
      <h2
        id="recently-viewed-heading"
        className="mb-5 text-lg font-semibold tracking-tight text-content"
      >
        Recently viewed
      </h2>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
        {visible.map((product) => (
          <Link
            key={product.product_id}
            to={`/Card/${product.product_id}`}
            className="group w-36 shrink-0"
          >
            <div className="flex h-32 items-center justify-center rounded-xl bg-photo p-3 ring-1 ring-inset ring-black/10">
              <img
                src={product.product_image}
                alt=""
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 truncate text-sm text-content">{product.product_title}</p>
            <p className="font-mono text-xs text-muted">${product.price}</p>
          </Link>
        ))}
      </div>
    </motion.section>
  );
};

export default RecentlyViewed;
