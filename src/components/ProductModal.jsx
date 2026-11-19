import { useEffect, useState } from "react";
import { X, Heart, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { SIZES } from "../data/products";
import StarRating from "./StarRating";
import { useLang } from "../context/LanguageContext";

export default function ProductModal({
  product: raw,
  isFavorite,
  onToggleFavorite,
  onClose,
  onAdd,
}) {
  const {
    t,
    formatPrice,
    category,
    color: colorName,
    product: localize,
  } = useLang();
  const product = localize(raw);

  const [size, setSize] = useState(null);
  const [color, setColor] = useState(raw.colors[0]);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);

  // قفل التمرير وإغلاق بزر Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    onAdd(raw, size, color, qty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* الخلفية مع أنيميشن الظهور */}
      <div className="absolute inset-0 animate-fade-in bg-black/60" onClick={onClose} />

      {/* النافذة المنبثقة مع أنيميشن التكبير */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative grid max-h-[92vh] w-full max-w-4xl animate-scale-in overflow-y-auto rounded-3xl bg-white shadow-2xl md:grid-cols-2"
      >
        <button
          onClick={onClose}
          aria-label={t.modal.close}
          className="absolute end-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-stone-100"
        >
          <X size={20} />
        </button>

        {/* الصورة */}
        <div className="relative aspect-square bg-stone-100 md:aspect-auto">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
            }}
            className="h-full w-full object-cover"
          />
          {discount > 0 && (
            <span className="absolute start-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
              {t.card.discount(discount)}
            </span>
          )}
        </div>

        {/* التفاصيل */}
        <div className="flex flex-col p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            {category(product.category)}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold">{product.name}</h2>
          <div className="mt-2">
            <StarRating
              rating={product.rating}
              reviews={product.reviews}
              size={16}
            />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-stone-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-stone-600">
            {product.description}
          </p>

          {/* اللون */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-bold">
              {t.modal.color}:{" "}
              <span className="font-normal text-stone-500">
                {colorName(color.name)}
              </span>
            </p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c)}
                  aria-label={colorName(c.name)}
                  title={colorName(c.name)}
                  style={{ backgroundColor: c.hex }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 transition ${
                    color.name === c.name
                      ? "ring-2 ring-stone-900 ring-offset-2"
                      : "hover:scale-110"
                  }`}
                >
                  {color.name === c.name && (
                    <Check
                      size={16}
                      className={
                        ["#f5f5f5", "#eab308"].includes(c.hex)
                          ? "text-stone-900"
                          : "text-white"
                      }
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* المقاس */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-bold">{t.modal.size}</p>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map((s) => {
                const available = product.sizes.includes(s);
                return (
                  <button
                    key={s}
                    disabled={!available}
                    onClick={() => {
                      setSize(s);
                      setError(false);
                    }}
                    className={`rounded-lg border py-2 text-sm font-semibold transition ${
                      size === s
                        ? "border-stone-900 bg-stone-900 text-white"
                        : available
                        ? "border-stone-200 hover:border-stone-500"
                        : "cursor-not-allowed border-stone-100 text-stone-300 line-through"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {error && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {t.modal.chooseSize}
              </p>
            )}
          </div>

          {/* الكمية + الإضافة */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-stone-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label={t.modal.decrease}
                className="p-3 hover:text-accent"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label={t.modal.increase}
                className="p-3 hover:text-accent"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 py-3.5 font-bold text-white transition hover:bg-accent"
            >
              <ShoppingBag size={20} />
              {t.modal.add}
            </button>

            <button
              onClick={() => onToggleFavorite(product.id)}
              aria-label={t.modal.favorite}
              className="rounded-full border border-stone-300 p-3.5 transition hover:border-red-300"
            >
              <Heart
                size={20}
                className={isFavorite ? "fill-red-500 text-red-500" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}