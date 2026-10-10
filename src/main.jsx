import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./components/Root/Root";
import Errorpage from "./components/Errorpage/Errorpage";
import Home from "./components/Home/Home";
import { CartProvider } from "./components/Context/Context";
import { WishProvider } from "./components/WishContext/WishContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/Theme/ThemeProvider";
import { getProducts } from "./lib/products";

// Home stays eager because it is the landing route and owns the LCP.
// Everything else is split out; /stat matters most since it pulls in Recharts.
const CardDetail = lazy(() => import("./components/CardDetail/CardDetail"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const DashboardBanner = lazy(() =>
  import("./components/DashboardBanner/DashboardBanner")
);
const Authors_Hub = lazy(() => import("./components/Authors-Hub/Authors_Hub"));
const Stat = lazy(() => import("./components/Stat/Stat"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "Card/:product_id",
        element: <CardDetail />,
        loader: () => getProducts(),
        errorElement: <Errorpage />,
      },
      { path: "dashboard", element: <Dashboard />, errorElement: <Errorpage /> },
      { path: "authors-hub", element: <Authors_Hub />, errorElement: <Errorpage /> },
      { path: "stat", element: <Stat />, errorElement: <Errorpage /> },
      { path: "wishlist", element: <DashboardBanner />, errorElement: <Errorpage /> },
      { path: "cart", element: <DashboardBanner />, errorElement: <Errorpage /> },
      // Catch-all so an unknown URL still renders inside the layout, with the
      // header, nav and footer available instead of a bare dead-end page.
      { path: "*", element: <Errorpage notFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <HelmetProvider>
        <CartProvider>
          <WishProvider>
            <RouterProvider router={router} />
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
          </WishProvider>
        </CartProvider>
      </HelmetProvider>
    </ThemeProvider>
  </StrictMode>
);
