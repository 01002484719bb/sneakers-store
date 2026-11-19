import { useMemo } from "react";
import {
  ArrowRight,
  Banknote,
  ClipboardList,
  Package,
  TrendingUp,
  Trash2,
  Database,
  Info,
  LogOut,
} from "lucide-react";
import { formatPrice } from "../utils/format";

const STATUSES = {
  new: { label: "جديد", cls: "bg-blue-100 text-blue-700" },
  shipped: { label: "تم الشحن", cls: "bg-amber-100 text-amber-700" },
  delivered: { label: "تم التسليم", cls: "bg-green-100 text-green-700" },
};

const nf = new Intl.NumberFormat("en-US");

function StatCard({ icon: Icon, label, value, delay }) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="animate-fade-up rounded-2xl border border-stone-200 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-500">{label}</p>
        <div className="rounded-full bg-orange-100 p-2.5 text-accent">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function SalesChart({ orders }) {
  const days = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      list.push({
        key: d.toDateString(),
        label: d.toLocaleDateString("ar-EG", { weekday: "short" }),
        total: 0,
      });
    }
    orders.forEach((o) => {
      const k = new Date(o.date);
      k.setHours(0, 0, 0, 0);
      const day = list.find((x) => x.key === k.toDateString());
      if (day) day.total += o.total;
    });
    return list;
  }, [orders]);

  const weekTotal = days.reduce((s, d) => s + d.total, 0);
  const max = Math.max(...days.map((d) => d.total), 1);

  const W = 700;
  const H = 260;
  const top = 24;
  const bottom = 36;
  const chartH = H - top - bottom;
  const slot = W / days.length;
  const barW = slot * 0.5;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h3 className="text-lg font-extrabold">مبيعات آخر 7 أيام</h3>
        <p className="text-sm text-stone-500">
          الإجمالي: <span className="font-bold text-stone-900">{formatPrice(weekTotal)}</span>
        </p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="رسم بياني للمبيعات">
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1="0"
            x2={W}
            y1={top + chartH * (1 - f)}
            y2={top + chartH * (1 - f)}
            strokeDasharray="4 4"
            className="stroke-stone-200"
          />
        ))}

        {days.map((d, i) => {
          const h = (d.total / max) * chartH;
          const slotIndex = days.length - 1 - i; // الأحدث ناحية اليمين
          const x = slotIndex * slot + (slot - barW) / 2;
          const y = top + chartH - h;
          return (
            <g key={d.key}>
              <rect
                x={x}
                y={d.total > 0 ? y : top + chartH - 3}
                width={barW}
                height={d.total > 0 ? h : 3}
                rx="8"
                className={d.total > 0 ? "fill-accent" : "fill-stone-200"}
              >
                <title>{formatPrice(d.total)}</title>
              </rect>
              {d.total > 0 && (
                <text
                  x={x + barW / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-stone-600 text-[11px] font-bold"
                >
                  {nf.format(d.total)}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={H - 12}
                textAnchor="middle"
                className="fill-stone-500 text-[12px]"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Dashboard({ orders: store, products, onSignOut }) {
  const { orders, loading, error, setStatus, removeOrder, clearOrders, seedDemo } = store;

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const avg = orders.length ? Math.round(totalSales / orders.length) : 0;

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-xl font-extrabold">
            لوحة التحكم<span className="text-accent">.</span>
          </h1>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-bold">
            <span className="rounded-full bg-stone-900 px-4 py-2 text-white">الطلبات</span>
            <a href="#admin-products" className="rounded-full px-4 py-2 text-stone-600 hover:bg-stone-100">
              المنتجات
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 hover:border-stone-900"
            >
              العودة للمتجر
              <ArrowRight size={16} />
            </a>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-stone-500 hover:text-red-500"
              >
                <LogOut size={16} />
                خروج
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* صندوق التنبيه المحدث بعد ربط Supabase والأدمن */}
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Info size={18} className="mt-0.5 shrink-0" />
          لوحة التحكم متصلة بقاعدة البيانات (Supabase) ومحمية بصلاحيات الأدمن بنجاح.
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            حدث خطأ أثناء تحميل الطلبات: {error}
          </div>
        )}

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Banknote} label="إجمالي المبيعات" value={formatPrice(totalSales)} delay={0} />
          <StatCard icon={ClipboardList} label="عدد الطلبات" value={orders.length} delay={80} />
          <StatCard icon={Package} label="عدد المنتجات" value={products.length} delay={160} />
          <StatCard icon={TrendingUp} label="متوسط قيمة الطلب" value={formatPrice(avg)} delay={240} />
        </div>

        <SalesChart orders={orders} />

        {/* الطلبات */}
        <section className="rounded-2xl border border-stone-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 p-5">
            <h3 className="text-lg font-extrabold">الطلبات</h3>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  window.confirm("ده هيضيف 14 طلب وهمي في القاعدة الحقيقية. تكمل؟") &&
                  seedDemo(products)
                }
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-stone-900"
              >
                <Database size={16} />
                تحميل بيانات تجريبية
              </button>
              {orders.length > 0 && (
                <button
                  onClick={() => window.confirm("مسح كل الطلبات؟") && clearOrders()}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-red-500 hover:border-red-400"
                >
                  <Trash2 size={16} />
                  مسح الكل
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm font-semibold text-stone-500">
              جاري تحميل الطلبات من قاعدة البيانات...
            </div>
          ) : orders.length === 0 ? (
            <div className="px-6 py-16 text-center text-stone-500">
              <ClipboardList size={48} className="mx-auto mb-3 text-stone-300" />
              <p className="font-bold text-stone-700">لا توجد طلبات بعد</p>
              <p className="mt-1 text-sm">
                اطلب من المتجر، أو اضغط "تحميل بيانات تجريبية" لتجربة الداشبورد.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-stone-100 text-stone-600">
                  <tr className="text-start">
                    {["رقم الطلب", "التاريخ", "العميل", "المحافظة", "القطع", "الإجمالي", "الحالة", ""].map(
                      (h, i) => (
                        <th key={i} className="px-4 py-3 text-start font-bold">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((o) => {
                    const pieces = o.items.reduce((s, it) => s + it.qty, 0);
                    return (
                      <tr key={o.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3 font-bold">{o.id}</td>
                        <td className="px-4 py-3 text-stone-500">
                          {new Date(o.date).toLocaleDateString("ar-EG", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold">{o.customer.name}</p>
                          <p dir="ltr" className="text-start text-xs text-stone-500">
                            {o.customer.phone}
                          </p>
                        </td>
                        <td className="px-4 py-3">{o.customer.city}</td>
                        <td
                          className="px-4 py-3"
                          title={o.items.map((it) => `${it.name} × ${it.qty}`).join("\n")}
                        >
                          {pieces}
                        </td>
                        <td className="px-4 py-3 font-bold">{formatPrice(o.total)}</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) => setStatus(o.id, e.target.value)}
                            className={`rounded-full px-3 py-1 text-xs font-bold outline-none ${STATUSES[o.status].cls}`}
                          >
                            {Object.entries(STATUSES).map(([key, s]) => (
                              <option key={key} value={key} className="bg-white text-stone-900">
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeOrder(o.id)}
                            aria-label="حذف الطلب"
                            className="text-stone-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}