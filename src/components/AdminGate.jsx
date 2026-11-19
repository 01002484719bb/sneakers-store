import { useState } from "react";
import { Lock, ArrowRight, LogOut } from "lucide-react";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const inputCls =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900";

export default function AdminGate({ auth, children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (auth.loading) {
    return (
      <div dir="rtl" className="grid min-h-screen place-items-center bg-stone-50 text-stone-500">
        جاري التحميل...
      </div>
    );
  }

  const email0 = auth.session?.user?.email;
  const allowed =
    auth.session && (!ADMIN_EMAIL || email0?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  if (allowed) return children;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await auth.signIn(email.trim(), password);
    if (error) setError("الإيميل أو كلمة السر غير صحيحة");
    setBusy(false);
  };

  return (
    <div dir="rtl" className="grid min-h-screen place-items-center bg-stone-50 px-4 text-stone-900">
      <div className="w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-8 shadow-xl">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-orange-100 text-accent">
          <Lock size={26} />
        </div>
        <h1 className="text-center text-2xl font-extrabold">
          لوحة التحكم<span className="text-accent">.</span>
        </h1>

        {auth.session ? (
          <div className="mt-6 text-center">
            <p className="font-semibold text-red-500">هذا الحساب ليس له صلاحية الإدارة.</p>
            <button
              onClick={auth.signOut}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-accent"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold">الإيميل</label>
              <input
                type="email"
                dir="ltr"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold">كلمة السر</label>
              <input
                type="password"
                dir="ltr"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                required
              />
            </div>
            {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-stone-900 py-3.5 font-bold text-white transition hover:bg-accent disabled:opacity-50"
            >
              {busy ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        )}

        <a
          href="#"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-stone-500 hover:text-accent"
        >
          العودة للمتجر
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}