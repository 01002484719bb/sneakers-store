import { Mail, Phone, MapPin } from "lucide-react";
import { useLang } from "../context/LanguageContext";

const SHOP_LINKS = ["رياضي", "كاجوال", "جري", "كلاسيك"];

export default function Footer() {
  const { t, category, lang } = useLang();

  return (
    <footer className="mt-20 bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-2xl font-extrabold text-neutral-50">
            {t.brand}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            {t.footer.desc}
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-neutral-50">{t.footer.shop}</h4>
          <ul className="space-y-2 text-sm">
            {SHOP_LINKS.map((c) => (
              <li key={c}>{category(c)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-neutral-50">
            {t.footer.service}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>{t.footer.track}</li>
            <li>{t.footer.returns}</li>
            <li>{t.footer.sizeGuide}</li>
            <li>{t.footer.faq}</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-neutral-50">
            {t.footer.contact}
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-accent" />
              <span dir="ltr">01274517670</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-accent" />
              <span dir="ltr">abdulrahman63@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-accent" />
              {t.footer.location}
            </li>
          </ul>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[2rem] bg-orange-200" />
    </footer>

  
  );
}