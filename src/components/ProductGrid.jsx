import { useMemo, useState } from "react";
import { SlidersHorizontal, SearchX, WifiOff, RotateCw } from "lucide-react";
import FiltersSidebar from "./FiltersSidebar";
import ProductCard from "./ProductCard";
import { useLang } from "../context/LanguageContext";
import { productsEn } from "../i18n/productsEn";
import { categoryNames } from "../i18n/translations";
import Reveal from "./Reveal";

const initialFilters = {
  categories: [],
  brands: [],
  sizes: [],
  maxPrice: null, // null = بدون حد أعلى
};

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="aspect-square bg-stone-200" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-stone-200" />
        <div className="h-4 w-2/3 rounded bg-stone-200" />
        <div className="h-4 w-1/2 rounded bg-stone-200" />
        <div className="h-10 rounded-full bg-stone-200" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  search,
  navCategory,
  showFavorites,
  isFavorite,
  onToggleFavorite,
  onView,
}) {
  const { t } = useLang();
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState("default");
  const [mobileFilters, setMobileFilters] = useState(false);

  const priceMax = useMemo(() => {
    if (!products.length) return 0;
    return Math.ceil(Math.max(...products.map((p) => p.price)) / 500) * 500;
  }, [products]);

  const resolvedFilters = {
    ...filters,
    maxPrice: filters.maxPrice ?? priceMax,
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const maxPrice = filters.maxPrice ?? priceMax;

    const list = products.filter((p) => {
      if (showFavorites && !isFavorite(p.id)) return false;
      if (navCategory !== "الكل" && p.category !== navCategory) return false;
      if (
        filters.categories.length &&
        !filters.categories.includes(p.category)
      )
        return false;
      if (filters.brands.length && !filters.brands.includes(p.brand))
        return false;
      if (
        filters.sizes.length &&
        !filters.sizes.some((s) => p.sizes.includes(s))
      )
        return false;
      if (p.price > maxPrice) return false;

      if (q) {
        const haystack = `${p.name} ${p.nameEn ?? ""} ${productsEn[p.id]?.name ?? ""} ${
          p.brand
        } ${p.category} ${categoryNames[p.category] ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [
    products,
    priceMax,
    search,
    navCategory,
    showFavorites,
    filters,
    sort,
    isFavorite,
  ]);

  return (
    <main id="products" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold">
            {showFavorites ? t.grid.favorites : t.grid.collection}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {loading ? t.grid.loading : t.grid.count(visible.length)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilters(true)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold lg:hidden"
          >
            <SlidersHorizontal size={16} />
            {t.grid.filters}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold outline-none"
          >
            <option value="default">{t.grid.sortDefault}</option>
            <option value="price-asc">{t.grid.sortPriceAsc}</option>
            <option value="price-desc">{t.grid.sortPriceDesc}</option>
            <option value="rating">{t.grid.sortRating}</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <FiltersSidebar
          filters={resolvedFilters}
          setFilters={setFilters}
          priceMax={priceMax}
          onReset={() => setFilters(initialFilters)}
          mobileOpen={mobileFilters}
          onClose={() => setMobileFilters(false)}
        />

        <div className="flex-1">
          {error ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-20 text-center">
              <WifiOff size={48} className="mb-3 text-red-400" />
              <p className="font-bold text-stone-800">{t.grid.errorTitle}</p>
              <p className="mt-1 text-sm text-stone-500">{error}</p>
              <button
                onClick={onRetry}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-accent"
              >
                <RotateCw size={16} />
                {t.grid.retry}
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 py-20 text-center text-stone-500">
              <SearchX size={48} className="mb-3 text-stone-400" />
              <p className="font-bold text-stone-700">{t.grid.noResults}</p>
              <p className="mt-1 text-sm">{t.grid.noResultsHint}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                           {visible.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 90}>
                  <ProductCard
                    product={p}
                    isFavorite={isFavorite(p.id)}
                    onToggleFavorite={onToggleFavorite}
                    onView={onView}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}