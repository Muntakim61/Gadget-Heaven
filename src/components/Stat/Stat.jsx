import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/Context";
import {
  ComposedChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartBar } from "@phosphor-icons/react";
import Statbar from "../StatBar/Statbar";
import { useTheme } from "../Theme/ThemeProvider";
import EmptyState from "../ui/EmptyState";

// Recharts styles SVG via props, not classes, so the palette is resolved in JS.
const CHART = {
  dark: { grid: "#27272a", axis: "#a1a1aa", tipBg: "#18181b", tipBorder: "#3f3f46", tipText: "#f4f4f5", bar: "#4C7EF2", dot: "#fbbf24" },
  light: { grid: "#e4e4e7", axis: "#52525b", tipBg: "#ffffff", tipBorder: "#e4e4e7", tipText: "#18181b", bar: "#3A63D1", dot: "#b45309" },
};

const Stat = () => {
  const { cartItems } = useContext(CartContext);
  const { theme } = useTheme();
  const c = CHART[theme] || CHART.dark;

  // Plot the line total so quantity is reflected in the chart.
  const data = cartItems.map((item) => ({
    name: item.product_title,
    "Line total": item.price * item.qty,
    Rating: item.rating,
  }));

  return (
    <div>
      <Helmet>
        <title>Statistics</title>
        <meta
          name="description"
          content="See how the gadgets in your cart compare on price and rating."
        />
      </Helmet>

      <Statbar />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {data.length === 0 ? (
          <EmptyState
            icon={ChartBar}
            title="Nothing to chart yet"
            description="Add a few gadgets to your cart and this page will compare them on price and rating."
            action={
              <Link to="/">
                <button className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover">
                  Browse the catalog
                </button>
              </Link>
            }
          />
        ) : (
          <div className="rounded-2xl border border-subtle bg-surface py-10">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke={c.grid} />
                <XAxis dataKey="name" stroke={c.axis} fontSize={12} />
                {/* Price and rating are different scales. Sharing one axis
                    pins every 0-5 rating to the baseline of a 0-2500 price
                    range, which makes the rating series unreadable. */}
                <YAxis yAxisId="price" stroke={c.axis} fontSize={12} />
                <YAxis
                  yAxisId="rating"
                  orientation="right"
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  stroke={c.axis}
                  fontSize={12}
                />
                <Tooltip
                  cursor={{ fill: c.grid, fillOpacity: 0.4 }}
                  contentStyle={{
                    background: c.tipBg,
                    border: `1px solid ${c.tipBorder}`,
                    borderRadius: "0.5rem",
                    color: c.tipText,
                  }}
                />
                <Legend />
                <Bar yAxisId="price" dataKey="Line total" barSize={28} fill={c.bar} radius={[4, 4, 0, 0]} />
                <Scatter yAxisId="rating" dataKey="Rating" fill={c.dot} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stat;
