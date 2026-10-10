import { useContext, useState } from "react";
import image3 from "../assets/banner.webp";
import { Link, useLocation } from "react-router-dom";
import { List, ShoppingCart, Heart, X } from "@phosphor-icons/react";
import { CartContext } from "../Context/Context";
import { WishContext } from "../WishContext/WishContext";
import ThemeToggle from "../Theme/ThemeToggle";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { badgePop } from "../../lib/motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/stat", label: "Statistics" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/authors-hub", label: "Author's Hub" },
];

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useContext(CartContext);
  const { wishItems } = useContext(WishContext);
  const reduce = useReducedMotion();

  const linkClass = (to) =>
    `text-sm font-medium transition-colors ${
      location.pathname === to
        ? "text-accent-400"
        : "text-muted hover:text-content"
    }`;

  return (
    <header className="w-full">
      <div className="sticky top-0 z-40 border-b border-subtle/80 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-muted"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <List size={22} />}
            </button>
            <Link to="/" className="text-lg font-semibold tracking-tight text-content">
              Gadget Heaven
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`${linkClass(link.to)} whitespace-nowrap`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-content"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    {...badgePop(reduce)}
                    className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-accent font-mono text-[10px] font-medium text-accent-fg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <Link
              to="/wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-content"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              <AnimatePresence>
                {wishItems.length > 0 && (
                  <motion.span
                    key={wishItems.length}
                    {...badgePop(reduce)}
                    className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-accent font-mono text-[10px] font-medium text-accent-fg"
                  >
                    {wishItems.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-subtle px-4 py-3 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`${linkClass(link.to)} py-2`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {isHome && (
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-content sm:text-5xl">
                Upgrade your tech with Gadget Heaven
              </h1>
              <p className="max-w-md text-base leading-relaxed text-muted">
                Smart devices and the coolest accessories, curated and ready
                to ship.
              </p>
              <div>
                <Link to="/dashboard">
                  <button className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-accent-fg transition-transform active:scale-[0.98] hover:bg-accent-600">
                    Shop now
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent-500/10 blur-2xl" />
              <img
                src={image3}
                alt="Featured gadgets"
                width={1000}
                height={667}
                loading="eager"
                decoding="async"
                className="w-full rounded-2xl border border-subtle object-cover shadow-2xl shadow-black/20"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
