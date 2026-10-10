/** @type {import('tailwindcss').Config} */

// Semantic tokens resolve to CSS variables declared in src/index.css.
// The <alpha-value> placeholder keeps Tailwind opacity modifiers working
// (e.g. bg-surface/60) even though the channel values come from a variable.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        photo: token("photo"),
        content: token("text"),
        muted: token("muted"),
        faint: token("faint"),
        subtle: token("border"),
        strong: token("border-strong"),
        accent: {
          DEFAULT: token("accent"),
          hover: token("accent-hover"),
          soft: token("accent-soft"),
          fg: token("accent-fg"),
          400: token("accent-hover"),
          500: token("accent"),
          600: token("accent-hover"),
        },
        success: token("success"),
        danger: token("danger"),
        warn: token("warn"),
      },
      ringColor: {
        DEFAULT: token("ring"),
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
}
