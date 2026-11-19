import { useCallback, useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProductRow,
  deleteProductRow,
  uploadProductImage,
} from "../api/products";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await fetchProducts());
    } catch (e) {
      setError(e.message || "حدث خطأ أثناء تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // الدوال دي بترمي الخطأ لفوق، والنموذج هو اللي بيعرضه
  const addProduct = async (data) => {
    const created = await createProduct(data);
    setProducts((prev) => [...prev, created]);
  };

  const updateProduct = async (id, data) => {
    const updated = await updateProductRow(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const removeProduct = async (id) => {
    await deleteProductRow(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    products,
    loading,
    error,
    reload: load,
    addProduct,
    updateProduct,
    removeProduct,
    uploadImage: uploadProductImage,
  };
}