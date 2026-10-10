// Single source of truth for the product catalog.
// Previously this file was fetched twice (a router loader plus a component
// effect) with no caching, so every navigation refetched all 24 products.
let inFlight = null;

const FRIENDLY_ERROR = "We couldn't reach the product catalog.";

const loadProducts = async () => {
  let res;
  try {
    res = await fetch("/cardData.json");
  } catch {
    throw new Error(FRIENDLY_ERROR);
  }

  if (!res.ok) throw new Error(FRIENDLY_ERROR);

  // The SPA rewrite serves index.html with a 200 for missing files, so a
  // successful status is not enough to know we actually got the catalog.
  const type = res.headers.get("content-type") || "";
  if (!type.includes("application/json")) throw new Error(FRIENDLY_ERROR);

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(FRIENDLY_ERROR);
  }

  if (!Array.isArray(data)) throw new Error(FRIENDLY_ERROR);
  return data;
};

export const getProducts = () => {
  if (!inFlight) {
    inFlight = loadProducts().catch((err) => {
      // Don't cache a rejection, or retry could never succeed.
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
