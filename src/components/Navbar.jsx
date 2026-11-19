import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  LayoutDashboard,
} from "lucide-react";
import { useLang } from "../context/LanguageContext";

export default function Navbar({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  favCount,
  showFavorites,
  onToggleFavorites,
  cartCount,
  onCartClick,
  theme,
  onToggleTheme,
  isAdmin,
}) {
  const { t, lang, toggleLang, category } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  // المفاتيح الداخلية بالعربي، والعرض مترجم
  const links = ["الكل", ...categories];
  const label = (c) => (c === "الكل" ? t.all : category(c));

  const searchBox = (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-stone-400"
      />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t.nav.searchPlaceholder}
        className="w-full rounded-full border border-stone-200 bg-stone-100 py-2 pe-4 ps-10 text-sm outline-none transition focus:border-stone-400 focus:bg-white"
      />
      {search && (
        <button
          onClick={() => onSearchChange("")}
          aria-label={t.nav.clearSearch}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* زر القائمة (موبايل) */}
        <button
          className="lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={t.nav.menu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* الشعار */}
        <a href="#" className="text-2xl font-extrabold tracking-tight">
          {t.brand}
          <span className="text-accent">.</span>
        </a>

        {/* روابط الأقسام (ديسكتوب) */}
        <nav className="ms-6 hidden items-center gap-1 lg:flex">
          {links.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeCategory === c
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {label(c)}
            </button>
          ))}
        </nav>

        {/* البحث (ديسكتوب) */}
        <div className="mx-auto hidden max-w-sm flex-1 md:block">
          {searchBox}
        </div>

        {/* الأيقونات */}
        <div className="ms-auto flex items-center gap-1 md:ms-0">
          {isAdmin && (
            <a
              href="#admin"
              aria-label={lang === "ar" ? "لوحة التحكم" : "Dashboard"}
              className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-2 text-sm font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">
                {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
              </span>
            </a>
          )}

          <button
            onClick={toggleLang}
            aria-label={t.langAria}
            className="flex items-center gap-1 rounded-full px-2.5 py-2 text-sm font-bold transition hover:bg-stone-100"
          >
            <Globe size={20} />
            <span lang={lang === "ar" ? "en" : "ar"}>{t.langBtn}</span>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={t.nav.theme}
            className="rounded-full p-2 transition hover:bg-stone-100"
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          <button
            onClick={onToggleFavorites}
            aria-label={t.nav.favorites}
            className={`relative rounded-full p-2 transition hover:bg-stone-100 ${
              showFavorites ? "text-red-500" : ""
            }`}
          >
            <Heart size={22} className={showFavorites ? "fill-red-500" : ""} />
            {favCount > 0 && (
              <span
                key={favCount}
                className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white"
              >
                {favCount}
              </span>
            )}
          </button>

          <button
            onClick={onCartClick}
            aria-label={t.nav.cart}
            className="relative rounded-full p-2 transition hover:bg-stone-100"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* البحث (موبايل) */}
      <div className="px-4 pb-3 md:hidden">{searchBox}</div>

      {/* القائمة المنسدلة (موبايل) */}
      {menuOpen && (
        <nav className="border-t border-stone-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {links.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onCategoryChange(c);
                  setMenuOpen(false);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  activeCategory === c
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {label(c)}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
