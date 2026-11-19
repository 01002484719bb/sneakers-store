import { X, RotateCcw } from "lucide-react";
import { BRANDS, CATEGORIES, SIZES } from "../data/products";
import { useLang } from "../context/LanguageContext";

function FilterGroup({ title, children }) {
  return (
    <div className="border-b border-stone-200 py-5 last:border-0">
      <h4 className="mb-3 font-bold">{title}</h4>
      {children}
    </div>
  );
}

function FiltersContent({ filters, setFilters, priceMax, onReset }) {
  const { t, formatPrice, category } = useLang();

  const toggleIn = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((x) => x !== value)
        : [...f[key], value],
    }));

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold">{t.filters.title}</h3>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-sm font-semibold text-stone-500 hover:text-accent"
        >
          <RotateCcw size={14} />
          {t.filters.reset}
        </button>
      </div>

      <FilterGroup title={t.filters.category}>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label
              key={c}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(c)}
                onChange={() => toggleIn("categories", c)}
                className="h-4 w-4 accent-stone-900"
              />
              {category(c)}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t.filters.brand}>
        <div className="space-y-2">
          {BRANDS.map((b) => (
            <label
              key={b}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(b)}
                onChange={() => toggleIn("brands", b)}
                className="h-4 w-4 accent-stone-900"
              />
              {b}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t.filters.size}>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleIn("sizes", s)}
              className={`rounded-lg border py-1.5 text-sm font-semibold transition ${
                filters.sizes.includes(s)
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t.filters.price}>
        <input
          type="range"
          min={0}
          max={priceMax}
          step={100}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-stone-900"
        />
        <p className="mt-2 text-sm text-stone-600">
          {t.filters.upTo}{" "}
          <span className="font-bold">{formatPrice(filters.maxPrice)}</span>
        </p>
      </FilterGroup>
    </>
  );
}

export default function FiltersSidebar({
  filters,
  setFilters,
  priceMax,
  onReset,
  mobileOpen,
  onClose,
}) {
  const { t } = useLang();

  const content = (
    <FiltersContent
      filters={filters}
      setFilters={setFilters}
      priceMax={priceMax}
      onReset={onReset}
    />
  );

  return (
    <>
      {/* ديسكتوب */}
      <aside className="sticky top-24 hidden h-fit w-64 shrink-0 rounded-2xl border border-stone-200 bg-white p-5 lg:block">
        {content}
      </aside>

      {/* موبايل */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute inset-y-0 start-0 w-80 max-w-[85%] overflow-y-auto bg-white p-5 shadow-xl">
            <button
              onClick={onClose}
              aria-label={t.filters.close}
              className="mb-2 rounded-full p-1 hover:bg-stone-100"
            >
              <X size={22} />
            </button>
            {content}
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-full bg-stone-900 py-3 font-bold text-white"
            >
              {t.filters.showResults}
            </button>
          </div>
        </div>
      )}
    </>
  );
}