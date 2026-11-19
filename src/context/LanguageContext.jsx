import { createContext, useContext, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { translations, categoryNames, colorNames } from "../i18n/translations";
import { productsEn } from "../i18n/productsEn";

const LanguageContext = createContext(null);
const numberFormat = new Intl.NumberFormat("en-US");

export function LanguageProvider({ children }) {
  const [lang, setLang] = useLocalStorage("sneakers-lang", "ar");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo(
    () => ({
      lang,
      dir,
      t: translations[lang],
      toggleLang: () => setLang((l) => (l === "ar" ? "en" : "ar")),
      formatPrice: (v) =>
        lang === "ar"
          ? `${numberFormat.format(v)} ج.م`
          : `EGP ${numberFormat.format(v)}`,
      category: (c) => (lang === "ar" ? c : categoryNames[c] ?? c),
      color: (c) => (lang === "ar" ? c : colorNames[c] ?? c),
      // يرجّع المنتج (أو عنصر السلة) بالاسم والوصف المترجمين
      product: (p) => {
        if (lang === "ar") return p;
        const en = productsEn[p.id] ?? {};
        return {
          ...p,
          name: p.nameEn || en.name || p.name,
          description: p.descriptionEn || en.description || p.description,
        };
      },
    }),
    [lang, dir, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}