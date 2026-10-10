import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { sectionReveal } from "../../lib/motion";

const RelatedProducts = ({ products, category, excludeId }) => {
  const reduce = useReducedMotion();
  const related = products
    .filter(
      (p) =>
        p.category === category && String(p.product_id) !== String(excludeId)
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <motion.section className="mt-16" aria-labelledby="related-heading" {...sectionReveal(reduce)}>
      <h2
        id="related-heading"
        className="mb-5 text-lg font-semibold tracking-tight text-content"
      >
        More in {category}
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {related.map((product) => (
          <Link
            key={product.product_id}
            to={`/Card/${product.product_id}`}
            className="group rounded-2xl border border-subtle bg-surface p-3 transition-colors hover:border-strong"
          >
            <div className="flex h-28 items-center justify-center rounded-xl bg-photo p-3 ring-1 ring-inset ring-black/10">
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

export default RelatedProducts;
