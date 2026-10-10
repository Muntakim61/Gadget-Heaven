import { createContext, useCallback, useEffect, useRef, useState } from "react";
import localforage from "localforage";

export const WishContext = createContext();

const WISH_KEY = "gadget-heaven-wishlist";

// A wishlist is a set: one entry per product, first occurrence wins.
const dedupe = (list) => {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const item of list) {
    if (!item || item.product_id == null) continue;
    const id = String(item.product_id);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(item);
  }
  return out;
};

export const WishProvider = ({ children }) => {
  const [wishItems, setWishItems] = useState([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    localforage
      .getItem(WISH_KEY)
      .then((stored) => {
        if (cancelled || !stored) return;
        // Merge so a pre-hydration add is not thrown away.
        setWishItems((pending) => dedupe([...stored, ...pending]));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) hasLoaded.current = true;
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    localforage.setItem(WISH_KEY, wishItems).catch(() => {});
  }, [wishItems]);

  const addToWish = useCallback((item) => {
    if (!item?.product_id) return;
    const id = String(item.product_id);
    setWishItems((prev) =>
      prev.some((entry) => String(entry.product_id) === id) ? prev : [...prev, item]
    );
  }, []);

  const removeFromWish = useCallback((product_id) => {
    const id = String(product_id);
    setWishItems((prev) => prev.filter((item) => String(item.product_id) !== id));
  }, []);

  const emptyWish = useCallback(() => setWishItems([]), []);

  return (
    <WishContext.Provider value={{ wishItems, addToWish, removeFromWish, emptyWish }}>
      {children}
    </WishContext.Provider>
  );
};
