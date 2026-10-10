import { useContext } from "react";
import { CartContext } from "../Context/Context";
import { toast } from "react-toastify";
import { Minus, Plus, X } from "@phosphor-icons/react";
import "react-toastify/dist/ReactToastify.css";

const Cart = ({ product }) => {
  const { removeFromCart, incrementQty, decrementQty } = useContext(CartContext);
  const { product_id, product_title, product_image, price, description, qty } = product;

  const handleRemove = () => {
    removeFromCart(product_id);
    toast.warn("Item has been removed from cart!");
  };

  return (
    <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-subtle bg-surface p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
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
          <p className="mt-1 font-mono text-sm text-muted">${price} each</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:ml-auto">
        <div className="flex items-center gap-1 rounded-full border border-subtle p-1">
          <button
            onClick={() => decrementQty(product_id)}
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-content"
            aria-label={`Decrease quantity of ${product_title}`}
          >
            <Minus size={14} />
          </button>
          <span
            className="min-w-[2ch] text-center font-mono text-sm text-content"
            aria-label={`Quantity: ${qty}`}
          >
            {qty}
          </span>
          <button
            onClick={() => incrementQty(product_id)}
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-content"
            aria-label={`Increase quantity of ${product_title}`}
          >
            <Plus size={14} />
          </button>
        </div>

        <p className="min-w-[5ch] text-right font-mono text-sm font-medium text-content">
          ${price * qty}
        </p>

        <button
          onClick={handleRemove}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-strong text-muted transition-colors hover:border-danger hover:text-danger"
          aria-label={`Remove ${product_title} from cart`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Cart;
