import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { sectionReveal } from "../../lib/motion";
import { ArrowRight } from "@phosphor-icons/react";
import { useProducts } from "../../hooks/useProducts";
import { Skeleton } from "../ui/Skeleton";

// Hand-picked rather than "top rated": every product sits between 4.0 and 4.9,
// so a rating sort would pick an essentially arbitrary four.
const FEATURED_IDS = ["21", "7", "14", "6"];

const FeaturedRail = () => {
  const { data, status } = useProducts();
  const reduce = useReducedMotion();

  if (status === "error") return null;

  const featured =
    status === "success"
      ? FEATURED_IDS.map((id) => data.find((p) => String(p.product_id) === id)).filter(Boolean)
      : [];

  return (
    <motion.section className="mt-4" aria-labelledby="featured-heading" {...sectionReveal(reduce)}>
      <div className="mb-5 flex items-baseline justify-between">
        <h2
          id="featured-heading"
          className="text-2xl font-semibold tracking-tight text-content"
        >
          Featured picks
        </h2>
        <a
          href="#catalog-heading"
          className="flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          See all
          <ArrowRight size={14} />
        </a>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {status === "loading"
          ? Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))
          : featured.map((product) => (
              <Link
                key={product.product_id}
                to={`/Card/${product.product_id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-subtle bg-surface transition-colors hover:border-strong"
              >
                <div className="flex h-44 items-center justify-center bg-photo p-5 ring-1 ring-inset ring-black/10">
                  <img
                    src={product.product_image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <p className="truncate text-sm font-medium text-content">
                    {product.product_title}
                  </p>
                  <p className="font-mono text-sm text-muted">${product.price}</p>
                </div>
              </Link>
            ))}
      </div>
    </motion.section>
  );
};

export default FeaturedRail;
