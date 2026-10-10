// Loads the real product catalog from the site's own public JSON (same
// file the frontend uses) so gift suggestions always point at real,
// in-stock products, never something the model or the client made up.
let catalog = null;

async function getCatalog(origin) {
  if (!catalog) {
    const res = await fetch(`${origin}/cardData.json`);
    catalog = await res.json();
  }
  return catalog;
}

const BUDGETS = {
  "under-300": [0, 300],
  "300-800": [300, 800],
  "800-1500": [800, 1500],
  "over-1500": [1500, Infinity],
  any: [0, Infinity],
};

export async function buildGiftShortlist(origin, { budget, category }) {
  const items = await getCatalog(origin);
  const [min, max] = BUDGETS[budget] || BUDGETS.any;

  const inBudget = (p) => p.availability && p.price >= min && p.price <= max;

  let matches = items.filter((p) => inBudget(p) && (category === "any" || p.category === category));
  // If that category has nothing in budget, relax the category but keep
  // the budget - a "gift under $300" request should never suggest
  // something far outside that budget just to return a result.
  if (matches.length === 0) matches = items.filter(inBudget);

  return matches
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)
    .map(({ product_id, product_title, category, price, rating, description }) => ({
      product_id,
      product_title,
      category,
      price,
      rating,
      description,
    }));
}

export async function isRealProductId(origin, id) {
  const items = await getCatalog(origin);
  return items.some((p) => String(p.product_id) === String(id));
}
