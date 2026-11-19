import { useEffect, useRef, useState } from "react";
import { X, Upload, Check } from "lucide-react";
import { BRANDS, CATEGORIES, SIZES } from "../data/products";
import { productsEn } from "../i18n/productsEn";


// أسماء الألوان هنا هي نفسها اللي في colorNames عشان الترجمة تشتغل
const PRESET_COLORS = [
  { name: "أحمر", hex: "#dc2626" },
  { name: "أسود", hex: "#171717" },
  { name: "أبيض", hex: "#f5f5f5" },
  { name: "رمادي", hex: "#9ca3af" },
  { name: "أزرق", hex: "#2563eb" },
  { name: "أخضر", hex: "#15803d" },
  { name: "كحلي", hex: "#1e3a8a" },
  { name: "برتقالي", hex: "#ea580c" },
  { name: "أصفر", hex: "#eab308" },
];

const emptyForm = {
  name: "",
  nameEn: "",
  description: "",
  descriptionEn: "",
  brand: BRANDS[0],
  category: CATEGORIES[0],
  price: "",
  oldPrice: "",
  rating: "4.5",
  reviews: "0",
  isNew: true,
  image: "",
  colors: [],
  sizes: [],
};

function initialForm(p) {
  if (!p) return emptyForm;
  const en = productsEn[p.id] ?? {};
  return {
    name: p.name,
    nameEn: p.nameEn ?? en.name ?? "",
    description: p.description ?? "",
    descriptionEn: p.descriptionEn ?? en.description ?? "",
    brand: p.brand,
    category: p.category,
    price: String(p.price),
    oldPrice: p.oldPrice ? String(p.oldPrice) : "",
    rating: String(p.rating),
    reviews: String(p.reviews),
    isNew: !!p.isNew,
    image: p.image,
    colors: p.colors,
    sizes: p.sizes,
  };
}

const inputCls =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-stone-900";

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold">{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>
      )}
    </div>
  );
}

export default function ProductFormModal({ product, onClose, onSave,onUploadImage }) {
  const [form, setForm] = useState(() => initialForm(product));
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

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

  const toggleColor = (preset) =>
    setForm((f) => ({
      ...f,
      colors: f.colors.some((c) => c.name === preset.name)
        ? f.colors.filter((c) => c.name !== preset.name)
        : [...f.colors, preset],
    }));

  const toggleSize = (s) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s)
        ? f.sizes.filter((x) => x !== s)
        : [...f.sizes, s],
    }));

    const handleFile = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const image = await onUploadImage(file);
        setForm((f) => ({ ...f, image }));
        setErrors((er) => ({ ...er, image: undefined }));
      } catch (err) {
        setErrors((er) => ({
          ...er,
          image: `تعذّر رفع الصورة: ${err.message}`,
        }));
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    };

    const submit = async (e) => {
      e.preventDefault();
      const price = Number(form.price);
      const oldPrice = form.oldPrice === "" ? null : Number(form.oldPrice);
      const next = {};
  
      if (form.name.trim().length < 2) next.name = "اكتب اسم المنتج";
      if (!(price > 0)) next.price = "اكتب سعراً صحيحاً";
      if (oldPrice !== null && !(oldPrice > price))
        next.oldPrice = "السعر القديم لازم يكون أكبر من السعر الحالي";
      if (!form.image) next.image = "أضف صورة للمنتج";
      if (!form.colors.length) next.colors = "اختر لوناً واحداً على الأقل";
      if (!form.sizes.length) next.sizes = "اختر مقاساً واحداً على الأقل";
  
      setErrors(next);
      if (Object.keys(next).length) return;
  
      setSaving(true);
      try {
        await onSave({
          name: form.name.trim(),
          nameEn: form.nameEn.trim(),
          description: form.description.trim(),
          descriptionEn: form.descriptionEn.trim(),
          brand: form.brand,
          category: form.category,
          price,
          oldPrice,
          rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
          reviews: Math.max(0, parseInt(form.reviews, 10) || 0),
          isNew: form.isNew,
          image: form.image,
          colors: form.colors,
          sizes: [...form.sizes].sort((a, b) => a - b),
        });
      } catch (err) {
        setErrors({ form: err.message });
      } finally {
        setSaving(false);
      }
    };

  const isData = form.image.startsWith("data:");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-black/60" onClick={onClose} />

      <form
        onSubmit={submit}
        noValidate
        role="dialog"
        aria-modal="true"
        className="relative max-h-[92vh] w-full max-w-2xl animate-scale-in overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute end-4 top-4 rounded-full p-2 hover:bg-stone-100"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-extrabold">
          {product ? "تعديل المنتج" : "إضافة منتج جديد"}
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="الاسم (عربي)" error={errors.name}>
            <input className={inputCls} value={form.name} onChange={set("name")} />
          </Field>
          <Field label="الاسم (English)">
            <input
              dir="ltr"
              className={inputCls}
              value={form.nameEn}
              onChange={set("nameEn")}
            />
          </Field>

          <Field label="الوصف (عربي)">
            <textarea
              rows={3}
              className={inputCls}
              value={form.description}
              onChange={set("description")}
            />
          </Field>
          <Field label="الوصف (English)">
            <textarea
              dir="ltr"
              rows={3}
              className={inputCls}
              value={form.descriptionEn}
              onChange={set("descriptionEn")}
            />
          </Field>

          <Field label="العلامة التجارية">
            <select className={inputCls} value={form.brand} onChange={set("brand")}>
              {BRANDS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Field>
          <Field label="الفئة">
            <select className={inputCls} value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="السعر (ج.م)" error={errors.price}>
            <input
              type="number"
              min="0"
              dir="ltr"
              className={inputCls}
              value={form.price}
              onChange={set("price")}
            />
          </Field>
          <Field label="السعر قبل الخصم (اختياري)" error={errors.oldPrice}>
            <input
              type="number"
              min="0"
              dir="ltr"
              className={inputCls}
              value={form.oldPrice}
              onChange={set("oldPrice")}
            />
          </Field>

          <Field label="التقييم (0 - 5)">
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              dir="ltr"
              className={inputCls}
              value={form.rating}
              onChange={set("rating")}
            />
          </Field>
          <Field label="عدد التقييمات">
            <input
              type="number"
              min="0"
              dir="ltr"
              className={inputCls}
              value={form.reviews}
              onChange={set("reviews")}
            />
          </Field>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.isNew}
            onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
            className="h-4 w-4 accent-stone-900"
          />
          عرض شارة "جديد"
        </label>

        {/* الصورة */}
        <div className="mt-6">
          <p className="mb-1.5 text-sm font-bold">الصورة</p>
          <div className="flex items-start gap-4">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-100">
              {form.image && (
                <img src={form.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-stone-900 disabled:opacity-50"
              >
                <Upload size={16} />
                {uploading ? "جاري الرفع..." : "رفع صورة من الجهاز"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              <input
                dir="ltr"
                className={inputCls}
                placeholder="أو الصق رابط الصورة https://..."
                value={isData ? "" : form.image}
                onChange={set("image")}
              />
            </div>
          </div>
          {errors.image && (
            <p className="mt-1 text-xs font-semibold text-red-500">{errors.image}</p>
          )}
        </div>

        {/* الألوان */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-bold">الألوان المتاحة</p>
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map((c) => {
              const on = form.colors.some((x) => x.name === c.name);
              return (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => toggleColor(c)}
                  title={c.name}
                  aria-label={c.name}
                  style={{ backgroundColor: c.hex }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 transition ${
                    on ? "ring-2 ring-stone-900 ring-offset-2" : "hover:scale-110"
                  }`}
                >
                  {on && (
                    <Check
                      size={16}
                      className={
                        ["#f5f5f5", "#eab308"].includes(c.hex)
                          ? "text-neutral-900"
                          : "text-neutral-50"
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
          {errors.colors && (
            <p className="mt-1 text-xs font-semibold text-red-500">{errors.colors}</p>
          )}
        </div>

        {/* المقاسات */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-bold">المقاسات المتاحة</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {SIZES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSize(s)}
                className={`rounded-lg border py-2 text-sm font-semibold transition ${
                  form.sizes.includes(s)
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {errors.sizes && (
            <p className="mt-1 text-xs font-semibold text-red-500">{errors.sizes}</p>
          )}
        </div>

        {errors.form && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {errors.form}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 rounded-full bg-stone-900 py-3.5 font-bold text-white transition hover:bg-accent disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : product ? "حفظ التعديلات" : "إضافة المنتج"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-300 px-6 py-3.5 font-bold hover:border-stone-900"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}