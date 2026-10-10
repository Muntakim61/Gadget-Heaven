import { Link, useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { WarningCircle } from "@phosphor-icons/react";

// Rendered inside Root for child-route errors (so it inherits header/footer),
// and standalone if the root route itself fails.
// Used two ways: as an errorElement (where useRouteError supplies the error)
// and as the catch-all "*" route, which passes notFound explicitly because no
// router error exists in that case.
const Errorpage = ({ notFound = false }) => {
  const error = useRouteError();
  const is404 = notFound || error?.status === 404;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <Helmet>
        <title>{is404 ? "Page not found" : "Something went wrong"}</title>
      </Helmet>

      <span className="grid h-14 w-14 place-items-center rounded-full bg-danger/10 text-danger">
        <WarningCircle size={28} />
      </span>

      <h1 className="text-4xl font-semibold tracking-tight text-content">
        {is404 ? "404" : "Something went wrong"}
      </h1>
      <p className="text-muted">
        {is404
          ? "We couldn't find that page."
          : error?.message || "An unexpected error occurred."}
      </p>

      <Link to="/">
        <button className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover">
          Back to homepage
        </button>
      </Link>
    </div>
  );
};

export default Errorpage;
