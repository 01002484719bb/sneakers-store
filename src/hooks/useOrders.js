import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { makeDemoOrders } from "../utils/demoOrders";

const fromRow = (r) => ({
  id: r.id,
  date: r.created_at,
  customer: r.customer,
  items: r.items,
  total: Number(r.total),
  status: r.status,
});

export default function useOrders(enabled) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setOrders(data.map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (enabled) load();
    else setOrders([]);
  }, [enabled, load]);

  const setStatus = async (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      setError(error.message);
      load();
    }
  };

  const removeOrder = async (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      setError(error.message);
      load();
    }
  };

  const clearOrders = async () => {
    const { error } = await supabase.from("orders").delete().neq("id", "");
    if (error) setError(error.message);
    await load();
  };

  // تحذير: بيضيف طلبات وهمية في القاعدة الحقيقية
  const seedDemo = async (products) => {
    const rows = makeDemoOrders(products).map((o) => ({
      id: o.id,
      created_at: o.date,
      customer: o.customer,
      items: o.items,
      total: o.total,
      status: o.status,
    }));
    const { error } = await supabase.from("orders").upsert(rows);
    if (error) setError(error.message);
    await load();
  };

  return {
    orders,
    loading,
    error,
    reload: load,
    setStatus,
    removeOrder,
    clearOrders,
    seedDemo,
  };
}