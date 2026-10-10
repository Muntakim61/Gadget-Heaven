import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Suspense, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { CartContext } from "../Context/Context";
import { CardGridSkeleton } from "../ui/Skeleton";
import CommandPalette from "../Search/CommandPalette";
import { pageTransition } from "../../lib/motion";

const Root = () => {
  const { pathname } = useLocation();
  const { cartCount } = useContext(CartContext);
  const reduce = useReducedMotion();
  const [announcement, setAnnouncement] = useState("");
  const previousCount = useRef(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  // Screen readers get no signal from a toast, so mirror cart changes here.
  useEffect(() => {
    const count = cartCount;
    if (previousCount.current !== null && previousCount.current !== count) {
      setAnnouncement(
        count === 0
          ? "Cart is now empty"
          : `Cart updated, ${count} ${count === 1 ? "item" : "items"}`
      );
    }
    previousCount.current = count;
  }, [cartCount]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-fg"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
              <CardGridSkeleton count={3} />
            </div>
          }
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={pathname} {...pageTransition(reduce)}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />

      <CommandPalette />

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
};

export default Root;
