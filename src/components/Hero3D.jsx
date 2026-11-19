import { useEffect, useRef, useState } from "react";
import { Rotate3d } from "lucide-react";
import { useLang } from "../context/LanguageContext";

const VARIANT_NAMES = {
  midnight: { ar: "ميدنايت", en: "Midnight" },
  beach: { ar: "بيتش", en: "Beach" },
  street: { ar: "ستريت", en: "Street" },
};

function webglSupported() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Hero3D({ src = "/models/shoe.glb", poster, alt }) {
  const { lang, t } = useLang();
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [variants, setVariants] = useState([]);
  const [active, setActive] = useState(null);

  const reduceMotion =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!webglSupported()) {
      setFailed(true);
      return;
    }
    let cancelled = false;
    import("@google/model-viewer")
      .then(() => !cancelled && setReady(true))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!ready || !el) return;

    const onLoad = () => {
      const list = el.availableVariants ?? [];
      setVariants(list);
      setActive(el.variantName ?? list[0] ?? null);
      setLoaded(true);
    };
    const onError = () => setFailed(true);

    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
    };
  }, [ready]);

  const pick = (name) => {
    if (ref.current) ref.current.variantName = name;
    setActive(name);
  };

  const label = (name) => VARIANT_NAMES[name]?.[lang] ?? name;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-100 via-orange-200 to-amber-300 shadow-xl">
      {/* ===== طبقات الخلفية ===== */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* نقاط خفيفة */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(124,45,18,0.14) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        {/* كلمة ضخمة في الخلفية */}
        <p
          dir="ltr"
          className="absolute inset-x-0 top-[8%] select-none text-center text-6xl font-black tracking-tighter text-white/50 md:text-8xl"
        >
          SNEAKERS
        </p>

        {/* توهج الإضاءة */}
        <div className="absolute start-1/2 top-[46%] aspect-square h-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl rtl:translate-x-1/2" />
        <div className="absolute start-1/2 top-[48%] aspect-square h-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/20 rtl:translate-x-1/2" />

        {/* دوائر زخرفية */}
        <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full border-[18px] border-white/30" />
        <div className="absolute -bottom-12 -start-12 h-44 w-44 rounded-full bg-orange-400/30" />
      </div>

      {/* ===== الموديل ===== */}
      {failed ? (
        <img
          src={poster}
          alt={alt}
          className="relative z-10 h-full w-full object-cover"
        />
      ) : (
        ready && (
          <model-viewer
            ref={ref}
            src={src}
            alt={alt}
            camera-controls=""
            disable-zoom=""
            touch-action="pan-y"
            interaction-prompt="none"
            shadow-intensity="1.2"
            shadow-softness="0.9"
            exposure="1.05"
            environment-image="neutral"
            {...(reduceMotion
              ? {}
              : { "auto-rotate": "", "rotation-per-second": "25deg" })}
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
            }}
          />
        )
      )}

      {/* ===== حالة التحميل ===== */}
      {!failed && !loaded && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 p-4"
        >
          <img
            src={poster}
            alt={alt}
            className="min-h-0 w-full flex-1 object-contain"
          />
          <p className="shrink-0 animate-pulse text-sm font-bold text-orange-900/70">
            {t.grid.loading}
          </p>
        </div>
      )}

      {/* ===== شارة الإرشاد ===== */}
      {loaded && !failed && (
        <div className="absolute start-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-xs font-bold text-neutral-800 backdrop-blur">
          <Rotate3d size={14} />
          {lang === "ar" ? "اسحب لتدوير الحذاء" : "Drag to rotate"}
        </div>
      )}

      {/* ===== أزرار الألوان ===== */}
      {variants.length > 1 && !failed && (
        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center">
          <div className="flex gap-1.5 rounded-full bg-white/50 p-1.5 shadow-lg backdrop-blur">
            {variants.map((v) => (
              <button
                key={v}
                onClick={() => pick(v)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  active === v
                    ? "bg-neutral-900 text-neutral-50"
                    : "text-neutral-800 hover:bg-white/70"
                }`}
              >
                {label(v)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}