// Shared motion vocabulary. Everything here animates transform/opacity only,
// so nothing triggers layout, and every consumer passes the result of
// useReducedMotion() so the OS preference collapses motion to instant.

export const EASE = [0.16, 1, 0.3, 1];

export const pageTransition = (reduce) => ({
  initial: reduce ? false : { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: reduce ? {} : { opacity: 0, y: -8 },
  transition: { duration: reduce ? 0 : 0.25, ease: EASE },
});

export const sectionReveal = (reduce) => ({
  initial: reduce ? false : { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: reduce ? 0 : 0.5, ease: EASE },
});

export const staggerParent = (reduce) => ({
  initial: reduce ? false : "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.1 },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
  },
});

export const staggerChild = (reduce) => ({
  variants: {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.4, ease: EASE },
    },
  },
});

export const badgePop = (reduce) => ({
  initial: reduce ? false : { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring", stiffness: 500, damping: 22 },
});
