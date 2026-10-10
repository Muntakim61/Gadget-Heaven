// Single source of truth for the product catalog, fetched once and cached
// in memory so every page that needs products shares the same request.
let inFlight = null;

const FRIENDLY_ERROR = "We couldn't reach the product catalog.";

async function loadProducts() {
  try {
    const res = await fetch("/cardData.json");
    // The SPA rewrite serves index.html (200, text/html) for any missing
    // file, so we also check the content type before trusting a 200.
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    if (!res.ok || !isJson) throw new Error();
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error();
    return data;
  } catch {
    throw new Error(FRIENDLY_ERROR);
  }
}

export const getProducts = () => {
  if (!inFlight) {
    // Don't cache a rejection, or a retry could never succeed.
    inFlight = loadProducts().catch((err) => {
      inFlight = null;
      throw err;
    });
  }
  return inFlight;
};

export const resetProducts = () => {
  inFlight = null;
};

export const findProduct = (products, id) =>
  products.find((item) => String(item.product_id) === String(id));
