import { useMemo, useState } from "react";
import {
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Search,
  Info,
  AlertTriangle,
  PackageSearch,
} from "lucide-react";
import ProductFormModal from "./ProductFormModal";
import { formatPrice } from "../utils/format";

export default function ProductsAdmin({
  products,
  loading,
  onAdd,
  onUpdate,
  onDelete,
  onUploadImage,
}) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // null | { product: null | منتج }
  const [actionError, setActionError] = useState("");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      `${p.name} ${p.nameEn ?? ""} ${p.brand}`.toLowerCase().includes(q)
    );
  }, [products, query]);

  const handleSave = async (data) => {
    if (modal.product) await onUpdate(modal.product.id, data);
    else await onAdd(data);
    setModal(null);
  };
  const handleDelete = async (p) => {
    if (!window.confirm(`حذف "${p.name}" نهائياً؟`)) return;
    setActionError("");
    try {
      await onDelete(p.id);
    } catch (e) {
      setActionError(e.message);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-xl font-extrabold">
            لوحة التحكم<span className="text-accent">.</span>
          </h1>
          <nav className="flex items-center gap-2 text-sm font-bold">
            <a href="#admin" className="rounded-full px-4 py-2 text-stone-600 hover:bg-stone-100">
              الطلبات
            </a>
            <span className="rounded-full bg-stone-900 px-4 py-2 text-white">المنتجات</span>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 hover:border-stone-900"
            >
              العودة للمتجر
              <ArrowRight size={16} />
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-8">
  <div className="flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
    <Info size={18} className="mt-0.5 shrink-0" />
    متصل بقاعدة البيانات: أي تعديل بيظهر في المتجر فوراً على كل الأجهزة.
  </div>

  {actionError && (
    <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      {actionError}
    </div>
  )}

  <div className="flex flex-wrap items-center gap-3">
    <div className="relative min-w-[200px] flex-1">
      <Search
        size={18}
        className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-stone-400"
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث في المنتجات..."
        className="w-full rounded-full border border-stone-300 bg-white py-2.5 pe-4 ps-10 text-sm outline-none focus:border-stone-900"
      />
    </div>
          <button
            onClick={() => setModal({ product: null })}
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent"
          >
            <Plus size={18} />
            إضافة منتج
          </button>
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white">
          {loading ? (
            <p className="px-6 py-16 text-center text-stone-500">جاري التحميل...</p>
          ) : list.length === 0 ? (
            <div className="px-6 py-16 text-center text-stone-500">
              <PackageSearch size={48} className="mx-auto mb-3 text-stone-300" />
              <p className="font-bold text-stone-700">لا توجد منتجات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-stone-100 text-stone-600">
                  <tr>
                    {["", "المنتج", "العلامة / الفئة", "السعر", "المقاسات", ""].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-start font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {list.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="px-4 py-3">
                        <img
                          src={p.image}
                          alt=""
                          className="h-14 w-14 rounded-lg bg-stone-100 object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold">{p.name}</p>
                        {p.nameEn && (
                          <p dir="ltr" className="text-start text-xs text-stone-500">
                            {p.nameEn}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {p.brand} • {p.category}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold">{formatPrice(p.price)}</p>
                        {p.oldPrice && (
                          <p className="text-xs text-stone-400 line-through">
                            {formatPrice(p.oldPrice)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-600">{p.sizes.length} مقاس</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setModal({ product: p })}
                            aria-label="تعديل"
                            className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            aria-label="حذف"
                            className="rounded-full p-2 text-stone-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {modal && (
        <ProductFormModal
          key={modal.product?.id ?? "new"}
          product={modal.product}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onUploadImage={onUploadImage}
        />
      )}
    </div>
  );
}