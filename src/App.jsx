import { useEffect, useRef, useState } from "react";
import useCart from "./hooks/useCart";
import useFavorites from "./hooks/useFavorites";
import useProducts from "./hooks/useProducts";
import useTheme from "./hooks/useTheme";
import useOrders from "./hooks/useOrders";
import useAuth from "./hooks/useAuth";
import { createOrder } from "./api/orders";
import { useLang } from "./context/LanguageContext";
import { CATEGORIES } from "./data/products";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import Dashboard from "./components/Dashboard";
import ProductsAdmin from "./components/ProductsAdmin";
import AdminGate from "./components/AdminGate";
import Footer from "./components/Footer";
import Stats from "./components/Stats";

export default function App() {
  const cart = useCart();
  const favorites = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { t, lang } = useLang();
  const auth = useAuth();
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdmin =
    !!auth.session &&
    (!ADMIN_EMAIL ||
      auth.session.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  const {
    products,
    loading,
    error,
    reload,
    addProduct,
    updateProduct,
    removeProduct,
    uploadImage,
  } = useProducts();

  const [route, setRoute] = useState(window.location.hash);
  const isAdminRoute = route === "#admin" || route === "#admin-products";
  const orders = useOrders(isAdminRoute && !!auth.session);
  const placingRef = useRef(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [showFavorites, setShowFavorites] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(id);
  }, [toast]);

  const scrollToProducts = () =>
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  const handleCategory = (c) => {
    setCategory(c);
    setShowFavorites(false);
    scrollToProducts();
  };

  const handleAdd = (product, size, color, qty) => {
    cart.addItem(product, size, color, qty);
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleConfirmOrder = async (customer) => {
    if (placingRef.current) return; // يمنع الضغط المزدوج
    placingRef.current = true;

    const id = `ORD-${Date.now().toString().slice(-6)}`;
    try {
      await createOrder({
        id,
        customer,
        items: cart.items,
        total: cart.total,
      });
      cart.clearCart();
      setCheckoutOpen(false);
      setToast(`${t.alertOrder} #${id}`);
    } catch {
      setToast(
        lang === "ar"
          ? "تعذّر تسجيل الطلب، حاول مرة أخرى"
          : "Couldn't place your order, please try again"
      );
    } finally {
      placingRef.current = false;
    }
  };

  const handleDeleteProduct = async (id) => {
    await removeProduct(id);
    if (favorites.isFavorite(id)) favorites.toggle(id);
  };

  if (route === "#admin") {
    return (
      <AdminGate auth={auth}>
        <Dashboard
          orders={orders}
          products={products}
          onSignOut={auth.signOut}
        />
      </AdminGate>
    );
  }

  if (route === "#admin-products") {
    return (
      <AdminGate auth={auth}>
        <ProductsAdmin
          products={products}
          loading={loading}
          onAdd={addProduct}
          onUpdate={updateProduct}
          onDelete={handleDeleteProduct}
          onUploadImage={uploadImage}
        />
      </AdminGate>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Navbar
        search={search}
        onSearchChange={setSearch}
        categories={CATEGORIES}
        activeCategory={category}
        onCategoryChange={handleCategory}
        favCount={favorites.count}
        showFavorites={showFavorites}
        onToggleFavorites={() => {
          setShowFavorites((v) => !v);
          scrollToProducts();
        }}
        cartCount={cart.count}
        onCartClick={() => setCartOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isAdmin={isAdmin}
      />

      <Hero onShopNow={scrollToProducts} />

      <Stats modelsCount={products.length} />

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={reload}
        search={search}
        navCategory={category}
        showFavorites={showFavorites}
        isFavorite={favorites.isFavorite}
        onToggleFavorite={favorites.toggle}
        onView={setSelectedProduct}
      />

      <Footer />

      {selectedProduct && (
        <ProductModal
          key={selectedProduct.id}
          product={selectedProduct}
          isFavorite={favorites.isFavorite(selectedProduct.id)}
          onToggleFavorite={favorites.toggle}
          onClose={() => setSelectedProduct(null)}
          onAdd={handleAdd}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        total={cart.total}
        count={cart.count}
        onUpdateQty={cart.updateQty}
        onRemove={cart.removeItem}
        onClear={cart.clearCart}
        onCheckout={handleCheckout}
      />

      {checkoutOpen && (
        <CheckoutModal
          total={cart.total}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={handleConfirmOrder}
        />
      )}

      {toast && (
        <div className="fixed inset-x-4 bottom-6 z-[60] mx-auto max-w-md animate-scale-in rounded-2xl bg-neutral-900 px-5 py-4 text-center text-sm font-semibold text-neutral-50 shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}