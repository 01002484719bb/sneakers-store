import useLocalStorage from "./useLocalStorage";

export default function useCart() {
  const [items, setItems] = useLocalStorage("sneakers-cart", []);

  const addItem = (product, size, color, qty = 1) => {
    const key = `${product.id}-${size}-${color.name}`;
    setItems((prev) => {
      const exists = prev.find((item) => item.key === key);
      if (exists) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + qty } : item
        );
      }

      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          nameEn: product.nameEn,
          price: product.price,
          image: product.image,
          size,
          color,
          qty,
        },
      ];
    });
  };

  const updateQty = (key, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((item) => item.key !== key));
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, qty } : item))
    );
  };

  const removeItem = (key) =>
    setItems((prev) => prev.filter((item) => item.key !== key));

  const clearCart = () => setItems([]);
  const count = items.reduce((total, item) => total + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return { items, count, total, addItem, updateQty, removeItem, clearCart };
}
