import { useCallback, useEffect, useRef, useState } from "react";
import localforage from "localforage";

const KEY = "gadget-heaven-recent";
const CAP = 8;

export const useRecentlyViewed = () => {
  const [recent, setRecent] = useState([]);
  // The stored history is the source of truth. Recording must wait for the
  // async load, otherwise a record fired on mount would overwrite the saved
  // list with a single entry.
  const listRef = useRef([]);
  const readyRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    readyRef.current = localforage.getItem(KEY).then((stored) => {
      const list = Array.isArray(stored) ? stored : [];
      listRef.current = list;
      if (!cancelled) setRecent(list);
      return list;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const record = useCallback(async (product) => {
    if (!product?.product_id) return;
    await readyRef.current;

    const id = String(product.product_id);
    const next = [
      {
        product_id: id,
        product_title: product.product_title,
        product_image: product.product_image,
        price: product.price,
      },
      ...listRef.current.filter((p) => String(p.product_id) !== id),
    ].slice(0, CAP);

    listRef.current = next;
    setRecent(next);
    localforage.setItem(KEY, next);
  }, []);

  return { recent, record };
};
