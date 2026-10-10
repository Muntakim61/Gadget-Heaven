import { useCallback, useEffect, useState } from "react";
import { getProducts, resetProducts } from "../lib/products";

export const useProducts = () => {
  const [state, setState] = useState({ status: "loading", data: [], error: null });

  const load = useCallback(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, status: "loading", error: null }));
    getProducts()
      .then((data) => {
        if (!cancelled) setState({ status: "success", data, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ status: "error", data: [], error });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(load, [load]);

  const retry = useCallback(() => {
    resetProducts();
    load();
  }, [load]);

  return { ...state, retry };
};
