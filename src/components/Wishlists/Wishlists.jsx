import { useContext } from "react";
import { WishContext } from "../WishContext/WishContext";
import Wishlist from "../Wishlist/Wishlist";
import { Helmet } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";

const Wishlists = () => {
  const { wishItems } = useContext(WishContext);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Helmet>
        <title>Wishlist</title>
        <meta name="description" content="Learn more about us on this page" />
      </Helmet>

      <p className="text-lg font-semibold text-content">Wishlist</p>

      <div className="mt-8">
        {wishItems.length > 0 ? (
          wishItems.map((item) => (
            <Wishlist key={item.product_id} product={item} />
          ))
        ) : (
          <p className="rounded-2xl border border-subtle bg-surface p-12 text-center text-lg text-muted">
            Your wishlist is empty.
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlists;
