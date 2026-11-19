import { Heart, Eye } from "lucide-react";
import StarRating from "./StarRating";
import { useLang } from "../context/LanguageContext";

export default function ProductCard({
  product: raw,
  isFavorite,
  onToggleFavorite,
  onView,
}) {
  const { t, formatPrice, category, product: localize } = useLang();
  const product = localize(raw);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:shadow-lg">
      {/* الصورة */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* الشارات */}
        <div className="absolute start-3 top-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-stone-900 px-3 py-0.5 text-xs font-bold text-white">
              {t.card.new}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-white">
              {t.card.discount(discount)}
            </span>
          )}
        </div>

        {/* زر المفضلة */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          aria-label={t.card.addFav}
          className="absolute end-3 top-3 rounded-full bg-white/90 p-2 shadow transition hover:scale-110"
        >
                   <Heart
            key={String(isFavorite)}
            size={18}
            className={
              isFavorite
                ? "animate-pop fill-red-500 text-red-500"
                : "text-stone-600"
            }
          />
        </button>
      </div>

      {/* المحتوى */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          {product.brand} • {category(product.category)}
        </p>
        <h3 className="mt-1 font-bold leading-snug">{product.name}</h3>
        <div className="mt-2">
          <StarRating rating={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => onView(raw)}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 py-2.5 text-sm font-bold text-white transition hover:bg-accent"
        >
          <Eye size={16} />
          {t.card.view}
        </button>
      </div>
    </article>
  );
}