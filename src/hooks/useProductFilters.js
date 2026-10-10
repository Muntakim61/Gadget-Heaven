import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const CATEGORIES = ["All Products", "Laptop", "Phone", "Smart watch", "Macbook"];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "name", label: "Name A-Z" },
];

// Buckets rather than a slider: with 24 products spanning $169-$2499 a
// dual-handle range control is more precision than the catalog can use.
export const PRICE_BUCKETS = [
  { value: "", label: "Any price", min: null, max: null },
  { value: "under-500", label: "Under $500", min: 0, max: 499 },
  { value: "500-1000", label: "$500 to $1000", min: 500, max: 1000 },
  { value: "1000-2000", label: "$1000 to $2000", min: 1001, max: 2000 },
  { value: "over-2000", label: "Over $2000", min: 2001, max: null },
];

const DEFAULTS = { q: "", cat: CATEGORIES[0], sort: "featured", price: "" };

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL params are user input: anything unrecognised falls back to the default
  // rather than leaving the UI in a state with no category tab selected (which
  // would also leave the roving tabindex with nothing focusable).
  const filters = useMemo(() => {
    const rawCat = searchParams.get("cat");
    const rawSort = searchParams.get("sort");
    const rawPrice = searchParams.get("price");
    return {
      q: searchParams.get("q") ?? DEFAULTS.q,
      cat: CATEGORIES.includes(rawCat) ? rawCat : DEFAULTS.cat,
      sort: SORT_OPTIONS.some((o) => o.value === rawSort) ? rawSort : DEFAULTS.sort,
      price: PRICE_BUCKETS.some((b) => b.value === rawPrice) ? rawPrice : DEFAULTS.price,
    };
  }, [searchParams]);

  const setFilter = useCallback(
    (key, value) => {
      // Typing replaces (one history entry per keystroke would be unusable),
      // but picking a category/sort/price pushes so Back undoes that choice.
      const replace = key === "q";
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          // Keep defaults out of the URL so shared links stay readable.
          if (!value || value === DEFAULTS[key]) next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const reset = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  const activeCount = Object.keys(DEFAULTS).filter(
    (key) => filters[key] !== DEFAULTS[key]
  ).length;

  return { filters, setFilter, reset, activeCount };
};

export const applyFilters = (products, filters) => {
  const { q, cat, sort, price } = filters;
  let result = products;

  if (cat && cat !== CATEGORIES[0]) {
    result = result.filter((p) => p.category.toLowerCase() === cat.toLowerCase());
  }

  const bucket = PRICE_BUCKETS.find((b) => b.value === price);
  if (bucket && (bucket.min !== null || bucket.max !== null)) {
    result = result.filter(
      (p) =>
        (bucket.min === null || p.price >= bucket.min) &&
        (bucket.max === null || p.price <= bucket.max)
    );
  }

  const term = q.trim().toLowerCase();
  if (term) {
    result = result.filter((p) => p.product_title.toLowerCase().includes(term));
  }

  if (sort === "featured") return result;

  const sorted = [...result];
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
  if (sort === "name") sorted.sort((a, b) => a.product_title.localeCompare(b.product_title));
  return sorted;
};
