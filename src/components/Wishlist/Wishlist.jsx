import { useContext } from "react";
import { WishContext } from "../WishContext/WishContext";
import { CartContext } from "../Context/Context";
import { toast } from "react-toastify";
import { X } from "@phosphor-icons/react";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = ({ product }) => {
  const { removeFromWish } = useContext(WishContext);
  const { addToCart } = useContext(CartContext);
  const { product_id, product_title, product_image, price, description, availability } = product;

  // Moving to the cart should empty the slot in the wishlist, otherwise the
  // same product sits in both lists and the counts stop meaning anything.
  // The stock rule has to hold here too: the detail page blocks adding an
  // out-of-stock item, so this path must not be a way around it.
  const handleMoveToCart = () => {
    if (!availability) {
      toast.error(`${product_title} is out of stock`);
      return;
    }
    addToCart(product);
    removeFromWish(product_id);
    toast.success(`${product_title} moved to cart`);
  };

  const handleRemove = () => {
    removeFromWish(product_id);
    toast.info(`${product_title} removed from wishlist`);
  };

  return (
    <div className="mb-4 flex items-center gap-4 rounded-2xl border border-subtle bg-surface p-4">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-photo p-2 ring-1 ring-inset ring-black/10">
        <img
          src={product_image}
          className="h-full w-full object-contain"
          alt={product_title}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex-1">
        <p className="font-medium text-content">{product_title}</p>
        <p className="mt-1 line-clamp-1 text-sm text-faint">{description}</p>
        <p className="mt-1 mb-2 font-mono text-sm text-muted">${price}</p>
        <button
          onClick={handleMoveToCart}
          disabled={!availability}
          title={availability ? undefined : "Out of stock"}
          className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {availability ? "Move to Cart" : "Out of stock"}
        </button>
      </div>
      <button
        onClick={handleRemove}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-strong text-muted transition-colors hover:border-danger hover:text-danger"
        aria-label={`Remove ${product_title} from wishlist`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Wishlist;
