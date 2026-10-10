import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import Cards from "../Cards/Cards";
import FeaturedRail from "../Product/FeaturedRail";
import CategoryShowcase from "../Product/CategoryShowcase";
import RecentlyViewed from "../Product/RecentlyViewed";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import {
  CATEGORIES,
  PRICE_BUCKETS,
  SORT_OPTIONS,
  useProductFilters,
} from "../../hooks/useProductFilters";

const selectClass =
  "rounded-full border border-subtle bg-surface px-4 py-2.5 text-sm text-content outline-none transition-colors focus:border-accent";

const Home = () => {
  const { filters, setFilter, reset, activeCount } = useProductFilters();
  const { recent } = useRecentlyViewed();
  const tabRefs = useRef([]);
  const selectedIndex = Math.max(0, CATEGORIES.indexOf(filters.cat));
  const [focusIndex, setFocusIndex] = useState(selectedIndex);

  // Keep the roving tabindex on the selected tab when the category is changed
  // from somewhere else, such as the category showcase tiles.
  useEffect(() => setFocusIndex(selectedIndex), [selectedIndex]);

  // Manual activation: arrows move focus only, Enter/Space (native button
  // activation) commits. Automatic activation would both fight the URL and
  // push a history entry for every arrow keypress.
  const onTabKeyDown = (event, index) => {
    const last = CATEGORIES.length - 1;
    let next = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setFocusIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <Helmet>
        <title>Gadget Heaven</title>
        <meta
          name="description"
          content="Browse laptops, phones, smart watches and MacBooks at Gadget Heaven."
        />
      </Helmet>

      <FeaturedRail />
      <CategoryShowcase active={filters.cat} onSelect={(cat) => setFilter("cat", cat)} />

      <section className="mt-20" aria-labelledby="catalog-heading">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2
            id="catalog-heading"
            className="text-2xl font-semibold tracking-tight text-content"
          >
            Browse the catalog
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <MagnifyingGlass
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
              />
              <input
                type="search"
                value={filters.q}
                onChange={(e) => setFilter("q", e.target.value)}
                placeholder="Search gadgets"
                aria-label="Search gadgets"
                className="w-full rounded-full border border-subtle bg-surface py-2.5 pl-10 pr-4 text-sm text-content outline-none transition-colors placeholder:text-faint focus:border-accent"
              />
            </div>

            <select
              value={filters.price}
              onChange={(e) => setFilter("price", e.target.value)}
              aria-label="Filter by price"
              className={selectClass}
            >
              {PRICE_BUCKETS.map((bucket) => (
                <option key={bucket.value || "any"} value={bucket.value}>
                  {bucket.label}
                </option>
              ))}
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilter("sort", e.target.value)}
              aria-label="Sort products"
              className={selectClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {activeCount > 0 && (
              <button
                onClick={reset}
                className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:text-content"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
          <div
            role="tablist"
            aria-label="Product categories"
            aria-orientation="vertical"
            className="scrollbar-hide flex gap-2 overflow-x-auto md:flex-col md:overflow-visible"
          >
            {CATEGORIES.map((category, index) => {
              const selected = filters.cat === category;
              return (
                <button
                  key={category}
                  ref={(el) => (tabRefs.current[index] = el)}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  tabIndex={index === focusIndex ? 0 : -1}
                  onClick={() => {
                    setFocusIndex(index);
                    setFilter("cat", category);
                  }}
                  onKeyDown={(e) => onTabKeyDown(e, index)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors md:text-left ${
                    selected
                      ? "bg-accent text-accent-fg"
                      : "bg-surface text-muted hover:bg-surface-2 hover:text-content"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <Cards filters={filters} onReset={reset} />
        </div>
      </section>

      <RecentlyViewed items={recent} />
    </div>
  );
};

export default Home;
