import { useState, useEffect } from "react";
import Carts from "../Carts/Carts";
import Wishlists from "../Wishlists/Wishlists";
import { useLocation } from "react-router-dom";

const DashboardBanner = () => {
  // Default to the cart so /dashboard is never an empty dead end.
  const [active, setActive] = useState("cart");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/wishlist") setActive("wishlist");
    else if (location.pathname === "/cart") setActive("cart");
  }, [location.pathname]);

  return (
    <div>
      <div className="border-b border-subtle bg-canvas py-16 text-center">
        <p className="text-3xl font-semibold tracking-tight text-content">
          Dashboard
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-faint">
          Explore the latest gadgets that will take your experience to the
          next level.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === "cart"
                ? "bg-accent-500 text-accent-fg"
                : "bg-surface text-muted hover:bg-surface-2 hover:text-content"
            }`}
            onClick={() => setActive("cart")}
          >
            Cart
          </button>
          <button
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === "wishlist"
                ? "bg-accent-500 text-accent-fg"
                : "bg-surface text-muted hover:bg-surface-2 hover:text-content"
            }`}
            onClick={() => setActive("wishlist")}
          >
            Wishlist
          </button>
        </div>
      </div>

      {active === "cart" && <Carts />}
      {active === "wishlist" && <Wishlists />}
    </div>
  );
};

export default DashboardBanner;
