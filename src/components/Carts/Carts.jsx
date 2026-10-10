import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CartContext } from "../Context/Context";
import Cart from "../Cart/Cart";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowsDownUp, CheckCircle, ShoppingCart } from "@phosphor-icons/react";
import EmptyState from "../ui/EmptyState";
import "react-toastify/dist/ReactToastify.css";

const Carts = () => {
  const { cartItems, cartTotal, cartCount, emptyCart } = useContext(CartContext);
  const [sortDesc, setSortDesc] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paidTotal, setPaidTotal] = useState(0);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Drive the native dialog so focus trapping and Esc come from the platform
  // instead of being faked with aria-modal on a plain div.
  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;
    if (isModalOpen && !dialog.open) dialog.showModal();
    if (!isModalOpen && dialog.open) dialog.close();
  }, [isModalOpen]);

  // Sort on the line total, since a cheap item bought ten times can outweigh
  // a single expensive one.
  const visibleItems = useMemo(() => {
    if (!sortDesc) return cartItems;
    return [...cartItems].sort((a, b) => b.price * b.qty - a.price * a.qty);
  }, [cartItems, sortDesc]);

  const handlePurchase = () => {
    setPaidTotal(cartTotal);
    setIsModalOpen(true);
  };

  // Fired by the dialog's close event, so Esc and the button both settle the
  // purchase the same way.
  const closeModal = () => {
    setIsModalOpen(false);
    emptyCart();
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Helmet>
        <title>Cart</title>
        <meta name="description" content="Review the gadgets in your cart" />
      </Helmet>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          <p className="text-lg font-semibold text-content">
            Cart{cartCount > 0 && <span className="text-muted"> ({cartCount})</span>}
          </p>
          <p className="font-mono text-sm text-muted">Total: ${cartTotal}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSortDesc((v) => !v)}
            aria-pressed={sortDesc}
            disabled={cartItems.length === 0}
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-strong px-3 py-2 text-sm font-medium text-content transition-colors hover:border-accent hover:text-accent disabled:opacity-40 sm:flex-none sm:px-4"
          >
            Sort by Price
            <ArrowsDownUp size={16} />
          </button>
          <button
            onClick={handlePurchase}
            className="flex-1 whitespace-nowrap rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-40 sm:flex-none"
            disabled={cartTotal === 0}
          >
            Purchase
          </button>
        </div>
      </div>

      <div className="mt-8">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => <Cart key={item.product_id} product={item} />)
        ) : (
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Browse the catalog and add something you like."
            action={
              <Link to="/">
                <button className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover">
                  Start shopping
                </button>
              </Link>
            }
          />
        )}
      </div>

      <dialog
        ref={modalRef}
        onClose={closeModal}
        aria-label="Payment successful"
        className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-subtle bg-surface p-8 text-content backdrop:bg-black/70"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle size={48} className="text-success" weight="fill" />
          <p className="text-xl font-semibold text-content">Payment successful</p>
          <p className="text-sm text-muted">Thanks for purchasing.</p>
          <p className="font-mono text-sm text-muted">Total: ${paidTotal}</p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Carts;
