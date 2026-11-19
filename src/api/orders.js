import { supabase } from "../lib/supabaseClient";

export async function createOrder({ id, customer, items, total }) {
  const { error } = await supabase
    .from("orders")
    .insert({ id, customer, items, total });

  if (error) throw new Error(error.message);
}