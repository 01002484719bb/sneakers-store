import {
  ArrowLeft,
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
} from "lucide-react";
import { useLang } from "../context/LanguageContext";
import Hero3D from "./Hero3D";

const icons = [Truck, ShieldCheck, RefreshCw, Headphones];

export default function Hero({ onShopNow }) {
  const { t, lang } = useLang();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        {/* النص */}
        <div>
          {/* الشارة */}
          <span
            style={{ animationDelay: "0ms" }}
            className="inline-block animate-fade-up rounded-full bg-orange-100 px-4 py-1 text-sm font-bold text-accent"
          >
            {t.hero.badge}
          </span>

          {/* العنوان */}
          <h1
            style={{ animationDelay: "120ms" }}
            className="mt-5 animate-fade-up text-4xl font-extrabold leading-tight md:text-6xl"
          >
            {t.hero.title1}
            <span className="block text-accent">{t.hero.title2}</span>
          </h1>

          {/* الفقرة */}
          <p
            style={{ animationDelay: "240ms" }}
            className="mt-5 max-w-md animate-fade-up text-lg leading-relaxed text-stone-600"
          >
            {t.hero.desc}
          </p>

          {/* صف الأزرار */}
          <div
            style={{ animationDelay: "360ms" }}
            className="mt-8 flex animate-fade-up flex-wrap items-center gap-4"
          >
            <button
              onClick={onShopNow}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 font-bold text-white transition hover:bg-accent"
            >
              {t.hero.shopNow}
              <Arrow size={20} />
            </button>
            <div className="text-sm text-stone-500">
              <span className="block text-2xl font-extrabold text-stone-900">
                {t.hero.customersNum}
              </span>
              {t.hero.customers}
            </div>
          </div>
        </div>

        {/* ثلاثي الأبعاد / الصورة البديلة */}
        <div
          style={{ animationDelay: "200ms" }}
          className="relative animate-fade-in"
        >
          <Hero3D
            alt={t.hero.alt}
            poster="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80"
          />
        </div>
      </div>

      {/* شريط المزايا */}
      <div className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          {t.hero.features.map((f, i) => {
            const Icon = icons[i];
            return (
              <div key={f.title} className="flex items-center gap-3">
                <div className="rounded-full bg-stone-100 p-3">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-xs text-stone-500">{f.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}