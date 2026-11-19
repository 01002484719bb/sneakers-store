import { useEffect, useRef, useState } from "react";
import { Users, Footprints, MapPin, Clock } from "lucide-react";
import { useLang } from "../context/LanguageContext";
import useCountUp from "../hooks/useCountUp";
import Reveal from "./Reveal";

const nf = new Intl.NumberFormat("en-US");

function Counter({ to, suffix = "", active }) {
  const value = useCountUp(to, active);
  return (
    <>
      {nf.format(value)}
      {suffix}
    </>
  );
}

export default function Stats({ modelsCount }) {
  const { t } = useLang();
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // غيّر الأرقام الثابتة هنا لأرقامك الحقيقية
  const items = [
    { key: "customers", icon: Users, to: 2000, suffix: "+" },
    { key: "models", icon: Footprints, to: modelsCount },
    { key: "governorates", icon: MapPin, to: 27 },
    { key: "delivery", icon: Clock, range: [24, 48] },
  ];

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 pt-14">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map(({ key, icon: Icon, to, suffix, range }, i) => (
          <Reveal key={key} delay={i * 100} className="h-full">
            <div className="h-full rounded-2xl border border-stone-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-orange-100 text-accent">
                <Icon size={24} />
              </div>

              <p
                dir="ltr"
                className="text-3xl font-extrabold tabular-nums md:text-4xl"
              >
                {range ? (
                  <>
                    <Counter to={range[0]} active={active} />
                    {"–"}
                    <Counter to={range[1]} active={active} />
                  </>
                ) : (
                  <Counter to={to} suffix={suffix} active={active} />
                )}
              </p>

              <p className="mt-1 text-sm font-semibold text-stone-500">
                {t.stats[key]}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}