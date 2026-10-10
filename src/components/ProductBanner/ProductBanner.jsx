import { useLoaderData, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../Context/Context";
import { WishContext } from "../WishContext/WishContext";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { ShoppingCart, Heart, Star, CaretLeft } from "@phosphor-icons/react";
import { findProduct } from "../../lib/products";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import RelatedProducts from "../Product/RelatedProducts";
import RecentlyViewed from "../Product/RecentlyViewed";
import "react-toastify/dist/ReactToastify.css";

const ProductBanner = ({ id }) => {
  const products = useLoaderData();
  const productData = findProduct(products, id);
  const { addToCart } = useContext(CartContext);
  const { addToWish, wishItems } = useContext(WishContext);
  const { recent, record } = useRecentlyViewed();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (productData) record(productData);
  }, [productData, record]);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1400);
    return () => clearTimeout(t);
  }, [justAdded]);

  if (!productData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-content">Product not found</h1>
        <p className="mt-2 text-muted">
          The product you're looking for doesn't exist.
        </p>
        <Link to="/">
          <button className="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover">
            Back to catalog
          </button>
        </Link>
      </div>
    );
  }

  const {
    product_id,
    product_title,
    product_image,
    category,
    price,
    description,
    specification,
    availability,
    rating,
  } = productData;

  const inWishlist = wishItems.some(
    (item) => String(item.product_id) === String(product_id)
  );

  const handleAddToCart = () => {
    addToCart(productData);
    setJustAdded(true);
    toast.success(`${product_title} added to cart`);
  };

  const handleAddToWish = () => {
    if (inWishlist) return;
    addToWish(productData);
    toast.success(`${product_title} added to wishlist`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Helmet>
        <title>{product_title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-content"
      >
        <CaretLeft size={14} />
        Back to catalog
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex h-80 items-center justify-center rounded-2xl bg-photo p-8 ring-1 ring-inset ring-black/10 lg:h-full">
          <img
            src={product_image}
            alt={product_title}
            className="h-full max-h-96 w-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-sm capitalize text-muted">{category}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-content">
              {product_title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-mono text-2xl text-content">${price}</p>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                availability
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {availability ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 text-warn">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  weight={Math.round(rating) >= star ? "fill" : "regular"}
                />
              ))}
            </div>
            <span className="font-mono text-sm text-muted">{rating}</span>
          </div>

          <p className="leading-relaxed text-muted">{description}</p>

          <div className="rounded-2xl border border-subtle bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold text-content">Specifications</h2>
            <dl className="grid gap-2">
              {specification.map((spec, index) => (
                <div key={index} className="flex gap-2 text-sm">
                  <dt className="font-mono text-faint">{String(index + 1).padStart(2, "0")}</dt>
                  <dd className="text-muted">{spec}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!availability}
              className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40"
            >
              {justAdded ? "Added" : "Add to Cart"}
              <ShoppingCart size={18} weight={justAdded ? "fill" : "regular"} />
            </button>

            <button
              onClick={handleAddToWish}
              disabled={inWishlist}
              aria-label={inWishlist ? "Already in wishlist" : "Add to wishlist"}
              className="grid h-11 w-11 place-items-center rounded-full border border-strong text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
            >
              <Heart size={18} weight={inWishlist ? "fill" : "regular"} />
            </button>
          </div>
        </div>
      </div>

      <RelatedProducts
        products={products}
        category={category}
        excludeId={product_id}
      />
      <RecentlyViewed items={recent} excludeId={product_id} />
    </div>
  );
};

export default ProductBanner;
