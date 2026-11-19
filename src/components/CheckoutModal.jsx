import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLang } from "../context/LanguageContext";

const TEXT = {
  ar: {
    title: "إتمام الطلب",
    name: "الاسم بالكامل",
    phone: "رقم الموبايل",
    city: "المحافظة",
    total: "الإجمالي",
    confirm: "تأكيد الطلب",
    close: "إغلاق",
    errName: "من فضلك اكتب اسمك",
    errPhone: "اكتب رقم موبايل مصري صحيح (مثال: 01012345678)",
    errCity: "من فضلك اكتب المحافظة",
  },
  en: {
    title: "Checkout",
    name: "Full name",
    phone: "Mobile number",
    city: "Governorate",
    total: "Total",
    confirm: "Confirm order",
    close: "Close",
    errName: "Please enter your name",
    errPhone: "Enter a valid Egyptian mobile number (e.g. 01012345678)",
    errCity: "Please enter your governorate",
  },
};

export default function CheckoutModal({ total, onClose, onConfirm }) {
  const { lang, formatPrice } = useLang();
  const L = TEXT[lang];

  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [errors, setErrors] = useState({});

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

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const phone = form.phone.replace(/\s|-/g, "");
    const next = {};
    if (form.name.trim().length < 3) next.name = L.errName;
    if (!/^01[0125][0-9]{8}$/.test(phone)) next.phone = L.errPhone;
    if (form.city.trim().length < 2) next.city = L.errCity;
    setErrors(next);
    if (Object.keys(next).length) return;
    onConfirm({ name: form.name.trim(), phone, city: form.city.trim() });
  };

  const inputCls =
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900";

  const fields = [
    { key: "name", label: L.name, type: "text", dir: undefined },
    { key: "phone", label: L.phone, type: "tel", dir: "ltr" },
    { key: "city", label: L.city, type: "text", dir: undefined },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-black/60" onClick={onClose} />

      <form
        onSubmit={submit}
        noValidate
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md animate-scale-in rounded-3xl bg-white p-6 shadow-2xl md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={L.close}
          className="absolute end-4 top-4 rounded-full p-2 hover:bg-stone-100"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-extrabold">{L.title}</h2>

        <div className="mt-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 block text-sm font-bold">{f.label}</label>
              <input
                type={f.type}
                dir={f.dir}
                value={form[f.key]}
                onChange={set(f.key)}
                className={inputCls}
              />
              {errors[f.key] && (
                <p className="mt-1 text-xs font-semibold text-red-500">
                  {errors[f.key]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-stone-100 px-4 py-3">
          <span className="font-bold">{L.total}</span>
          <span className="text-lg font-extrabold">{formatPrice(total)}</span>
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-stone-900 py-3.5 font-bold text-white transition hover:bg-accent"
        >
          {L.confirm}
        </button>
      </form>
    </div>
  );
}