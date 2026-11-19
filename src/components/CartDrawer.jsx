import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useLang } from "../context/LanguageContext";

export default function CartDrawer({
  open,
  onClose,
  items,
  total,
  count,
  onUpdateQty,
  onRemove,
  onClear,
  onCheckout,
}) {
  const { t, formatPrice, color: colorName, product: localize } = useLang();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* الخلفية */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* اللوحة */}
      <aside
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        {/* الرأس */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <ShoppingBag size={20} />
            {t.cart.title}
            <span className="text-sm font-semibold text-stone-500">
              ({count})
            </span>
          </h2>
          <button
            onClick={onClose}
            aria-label={t.modal.close}
            className="rounded-full p-2 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* المحتوى */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-stone-500">
            <ShoppingBag size={56} className="mb-3 text-stone-300" />
            <p className="font-bold text-stone-700">{t.cart.empty}</p>
            <p className="mt-1 text-sm">{t.cart.emptyHint}</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-accent"
            >
              {t.cart.continue}
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-stone-100 overflow-y-auto px-5">
              {items.map((rawItem) => {
                const item = localize(rawItem);
                return (
                  <li key={item.key} className="flex animate-fade-in gap-4 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 shrink-0 rounded-xl bg-stone-100 object-cover"
                  />
             

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold leading-snug">{item.name}</p>
                          <p className="mt-0.5 flex items-center gap-2 text-xs text-stone-500">
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-stone-300"
                              style={{ backgroundColor: item.color.hex }}
                            />
                            {colorName(item.color.name)} • {t.cart.size}{" "}
                            {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemove(item.key)}
                          aria-label={t.cart.remove}
                          className="text-stone-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-stone-300">
                          <button
                            onClick={() => onUpdateQty(item.key, item.qty - 1)}
                            aria-label={t.modal.decrease}
                            className="p-2 hover:text-accent"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center text-sm font-bold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.key, item.qty + 1)}
                            aria-label={t.modal.increase}
                            className="p-2 hover:text-accent"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-extrabold">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* التذييل */}
            <div className="border-t border-stone-200 bg-stone-50 px-5 py-5">
              <div className="flex items-center justify-between text-lg">
                <span className="font-bold">{t.cart.total}</span>
                <span className="font-extrabold">{formatPrice(total)}</span>
              </div>
              <p className="mt-1 text-xs text-stone-500">{t.cart.shipping}</p>

              <button
                onClick={onCheckout}
                className="mt-4 w-full rounded-full bg-stone-900 py-3.5 font-bold text-white transition hover:bg-accent"
              >
                {t.cart.checkout}
              </button>
              <button
                onClick={onClear}
                className="mt-2 w-full py-2 text-sm font-semibold text-stone-500 hover:text-red-500"
              >
                {t.cart.clear}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
