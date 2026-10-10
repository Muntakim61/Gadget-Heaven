import { useEffect, useRef, useState } from "react";
import { ChatCircleDots, Gift, PaperPlaneRight, X } from "@phosphor-icons/react";
import { sendChatMessage } from "../../lib/chatApi";
import { getProducts, findProduct } from "../../lib/products";
import Card from "../Card/Card";

const BUDGETS = [
  { value: "under-300", label: "Under $300" },
  { value: "300-800", label: "$300-$800" },
  { value: "800-1500", label: "$800-$1,500" },
  { value: "over-1500", label: "$1,500+" },
  { value: "any", label: "No limit" },
];

const CATEGORIES = [
  { value: "phone", label: "Phone" },
  { value: "laptop", label: "Laptop" },
  { value: "smart watch", label: "Smart watch" },
  { value: "macbook", label: "MacBook" },
  { value: "any", label: "Surprise me" },
];

const WELCOME = {
  role: "assistant",
  text: 'Hi! Ask me about anything in the catalog, or tap "Find a gift" for a quick recommendation.',
};

let uid = 0;
const nextId = () => ++uid;

// Built on <dialog> for free focus handling, same pattern as
// CommandPalette, shown non-modally so the page stays usable behind it.
const ChatWidget = () => {
  const dialogRef = useRef(null);
  const logRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ id: nextId(), ...WELCOME }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [giftStep, setGiftStep] = useState(null); // null | "budget" | "category" | "occasion"
  const [giftAnswers, setGiftAnswers] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.show();
      getProducts().then(setProducts).catch(() => setProducts([]));
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, giftStep]);

  const say = (role, text, extra) => setMessages((m) => [...m, { id: nextId(), role, text, ...extra }]);

  async function send(mode, message, quiz) {
    setBusy(true);
    setError(null);
    const history = messages.slice(-6).map((m) => ({ role: m.role === "assistant" ? "model" : "user", text: m.text }));
    const data = await sendChatMessage({ mode, message, history, quiz });
    setBusy(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    const matches = data.suggestedProductIds?.map((id) => findProduct(products, id)).filter(Boolean);
    say("assistant", data.reply, matches ? { products: matches } : undefined);
  }

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    say("user", text);
    send("chat", text);
  };

  const startGift = () => {
    setGiftAnswers({});
    setGiftStep("budget");
    setError(null);
    say("assistant", "Let's find a gift. What's the budget?");
  };

  const pickBudget = (opt) => {
    setGiftAnswers({ budget: opt.value });
    setGiftStep("category");
    say("user", opt.label);
    say("assistant", "Any category preference?");
  };

  const pickCategory = (opt) => {
    setGiftAnswers((a) => ({ ...a, category: opt.value }));
    setGiftStep("occasion");
    say("user", opt.label);
    say("assistant", "What's the occasion? (optional)");
  };

  const finishGift = (occasion) => {
    const quiz = { ...giftAnswers, occasion };
    setGiftStep(null);
    if (occasion) say("user", occasion);
    send("gift", "Find me a gift", quiz);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close shopping assistant" : "Open shopping assistant"}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-fg shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X size={24} /> : <ChatCircleDots size={24} weight="fill" />}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label="Shopping assistant"
        className="fixed inset-auto inset-x-3 bottom-20 m-0 hidden h-[min(32rem,75dvh)] max-w-none flex-col rounded-2xl border border-subtle bg-surface p-0 text-content open:flex sm:inset-x-auto sm:bottom-24 sm:right-5 sm:w-96"
      >
        <div className="flex items-center justify-between border-b border-subtle px-4 py-3">
          <p className="text-sm font-semibold">Gadget Heaven Assistant</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-content"
          >
            <X size={16} />
          </button>
        </div>

        <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.role === "user" ? "bg-accent text-accent-fg" : "bg-surface-2 text-content"
                }`}
              >
                <p>{m.text}</p>
                {m.products?.length > 0 && (
                  <div className="mt-3 grid gap-3">
                    {m.products.map((p) => (
                      <div key={p.product_id} className="w-44">
                        <Card card={p} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {giftStep === "budget" && <QuizRow options={BUDGETS} onPick={pickBudget} />}
          {giftStep === "category" && <QuizRow options={CATEGORIES} onPick={pickCategory} />}
          {giftStep === "occasion" && <OccasionForm onSubmit={finishGift} />}
          {busy && <p className="text-xs text-faint">Thinking…</p>}
        </div>

        {error && (
          <p className="border-t border-subtle px-4 py-2 text-xs text-danger" role="status">
            {error}
          </p>
        )}

        <div className="border-t border-subtle p-3">
          {!giftStep && (
            <button
              type="button"
              onClick={startGift}
              disabled={busy}
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-full border border-accent py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-fg disabled:opacity-50"
            >
              <Gift size={16} />
              Find a gift
            </button>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a product…"
              aria-label="Message the shopping assistant"
              disabled={busy || !!giftStep}
              maxLength={500}
              className="flex-1 rounded-full border border-subtle bg-canvas px-4 py-2 text-sm text-content outline-none transition-colors placeholder:text-faint focus:border-accent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={busy || !!giftStep || !input.trim()}
              aria-label="Send"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-40"
            >
              <PaperPlaneRight size={16} />
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

const QuizRow = ({ options, onPick }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onPick(opt)}
        className="rounded-full border border-subtle bg-canvas px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const OccasionForm = ({ onSubmit }) => {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value.trim());
      }}
      className="flex items-center gap-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. birthday (optional)"
        maxLength={100}
        className="flex-1 rounded-full border border-subtle bg-canvas px-3 py-1.5 text-xs outline-none focus:border-accent"
      />
      <button type="submit" className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg transition-colors hover:bg-accent-hover">
        Go
      </button>
    </form>
  );
};

export default ChatWidget;
