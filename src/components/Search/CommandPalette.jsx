import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchSorter } from "match-sorter";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { getProducts } from "../../lib/products";

const MAX_RESULTS = 6;

// Built on <dialog> so focus trapping, Esc-to-close and inertness come from
// the platform instead of a focus-management dependency.
const CommandPalette = () => {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const results = query.trim()
    ? matchSorter(products, query, { keys: ["product_title", "category"] }).slice(0, MAX_RESULTS)
    : products.slice(0, MAX_RESULTS);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      getProducts()
        .then(setProducts)
        .catch(() => setProducts([]));
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const go = (product) => {
    if (!product) return;
    setOpen(false);
    navigate(`/Card/${product.product_id}`);
  };

  const onInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[activeIndex]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === dialogRef.current) setOpen(false);
      }}
      aria-label="Search products"
      className="w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-subtle bg-surface p-0 text-content backdrop:bg-black/60"
    >
      <div className="flex items-center gap-3 border-b border-subtle px-4">
        <MagnifyingGlass size={18} className="shrink-0 text-faint" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Search gadgets"
          aria-label="Search gadgets"
          className="w-full bg-transparent py-4 text-sm text-content outline-none placeholder:text-faint"
        />
        <kbd className="shrink-0 rounded border border-subtle px-1.5 py-0.5 font-mono text-[10px] text-faint">
          Esc
        </kbd>
      </div>

      <ul className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted">
            No gadgets match that search.
          </li>
        )}
        {results.map((product, index) => (
          <li key={product.product_id}>
            <button
              type="button"
              onClick={() => go(product)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                index === activeIndex ? "bg-surface-2" : ""
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-photo p-1 ring-1 ring-inset ring-black/10">
                <img
                  src={product.product_image}
                  alt=""
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-content">
                  {product.product_title}
                </span>
                <span className="block text-xs capitalize text-faint">{product.category}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted">${product.price}</span>
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
};

export default CommandPalette;
