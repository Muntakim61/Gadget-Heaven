import { Link } from "react-router-dom";
import { Star } from "@phosphor-icons/react";

const Card = ({ card }) => {
  const { product_id, product_image, product_title, price, rating, availability } = card;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-subtle bg-surface transition-colors hover:border-strong">
      <div className="relative flex h-56 items-center justify-center bg-photo p-6 ring-1 ring-inset ring-black/10">
        <img
          src={product_image}
          alt={product_title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {!availability && (
          <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-danger ring-1 ring-inset ring-black/10">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-medium text-content">{product_title}</h3>

        <div className="flex items-center justify-between">
          <p className="font-mono text-sm text-muted">${price}</p>
          <span className="flex items-center gap-1 text-sm text-muted">
            <Star size={14} weight="fill" className="text-warn" />
            <span className="font-mono">{rating}</span>
          </span>
        </div>

        <Link to={`/Card/${product_id}`} className="mt-auto pt-2">
          <button className="w-full rounded-full border border-accent py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-fg">
            Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
