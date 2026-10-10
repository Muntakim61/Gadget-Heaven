import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import localforage from "localforage";

export const CartContext = createContext();

const CART_KEY = "gadget-heaven-cart-v2";

const clampQty = (value) => Math.max(1, Number(value) || 1);

// Collapses a list into one quantity-aware entry per product id. Used both
// to dedupe on load and to merge anything added before loading finished.
const normalize = (list) => {
  if (!Array.isArray(list)) return [];
  const byId = new Map();
  for (const item of list) {
    if (!item || item.product_id == null) continue;
    const id = String(item.product_id);
    const existing = byId.get(id);
    if (existing) existing.qty += clampQty(item.qty);
    else byId.set(id, { ...item, qty: clampQty(item.qty) });
  }
  return [...byId.values()];
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await localforage.getItem(CART_KEY);
        if (cancelled) return;
        // Merge rather than replace: anything the user added while the store
        // was still loading would otherwise be silently discarded.
        if (stored) setCartItems((pending) => normalize([...stored, ...pending]));
      } catch {
        // Blocked or unavailable storage: carry on with an in-memory cart.
      } finally {
        if (!cancelled) hasLoaded.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    localforage.setItem(CART_KEY, cartItems).catch(() => {});
  }, [cartItems]);

  const addToCart = useCallback((item, quantity = 1) => {
    const id = String(item.product_id);
    setCartItems((prev) => {
      const match = prev.find((entry) => String(entry.product_id) === id);
      if (match) {
        return prev.map((entry) =>
          String(entry.product_id) === id
            ? { ...entry, qty: entry.qty + clampQty(quantity) }
            : entry
        );
      }
      return [...prev, { ...item, qty: clampQty(quantity) }];
    });
  }, []);

  const setQty = useCallback((product_id, qty) => {
    const id = String(product_id);
    setCartItems((prev) =>
      qty < 1
        ? prev.filter((entry) => String(entry.product_id) !== id)
        : prev.map((entry) =>
            String(entry.product_id) === id ? { ...entry, qty } : entry
          )
    );
  }, []);

  const incrementQty = useCallback((product_id) => {
    const id = String(product_id);
    setCartItems((prev) =>
      prev.map((entry) =>
        String(entry.product_id) === id ? { ...entry, qty: entry.qty + 1 } : entry
      )
    );
  }, []);

  const decrementQty = useCallback((product_id) => {
    const id = String(product_id);
    setCartItems((prev) =>
      prev
        .map((entry) =>
          String(entry.product_id) === id ? { ...entry, qty: entry.qty - 1 } : entry
        )
        .filter((entry) => entry.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((product_id) => {
    const id = String(product_id);
    setCartItems((prev) => prev.filter((entry) => String(entry.product_id) !== id));
  }, []);

  const emptyCart = useCallback(() => setCartItems([]), []);

  const { cartCount, cartTotal } = useMemo(
    () => ({
      cartCount: cartItems.reduce((sum, entry) => sum + entry.qty, 0),
      cartTotal: cartItems.reduce((sum, entry) => sum + entry.price * entry.qty, 0),
    }),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        setQty,
        incrementQty,
        decrementQty,
        removeFromCart,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
