import { supabase } from "../lib/supabaseClient";
import { compressImage } from "../utils/image";

const BUCKET = "product-images";

const fromRow = (r) => ({
  id: r.id,
  name: r.name,
  nameEn: r.name_en ?? "",
  description: r.description ?? "",
  descriptionEn: r.description_en ?? "",
  brand: r.brand,
  category: r.category,
  price: Number(r.price),
  oldPrice: r.old_price ? Number(r.old_price) : null,
  rating: Number(r.rating ?? 0),
  reviews: r.reviews ?? 0,
  isNew: !!r.is_new,
  image: r.image,
  colors: r.colors ?? [],
  sizes: r.sizes ?? [],
});

const toRow = (p) => ({
  name: p.name,
  name_en: p.nameEn || null,
  description: p.description || null,
  description_en: p.descriptionEn || null,
  brand: p.brand,
  category: p.category,
  price: p.price,
  old_price: p.oldPrice ?? null,
  rating: p.rating,
  reviews: p.reviews,
  is_new: p.isNew,
  image: p.image,
  colors: p.colors,
  sizes: p.sizes,
});

const NO_PERMISSION = "لا تملك صلاحية التعديل. تأكد إنك مسجّل بحساب الأدمن.";

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data.map(fromRow);
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert(toRow(product))
    .select();

  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error(NO_PERMISSION);
  return fromRow(data[0]);
}

export async function updateProductRow(id, product) {
  const { data, error } = await supabase
    .from("products")
    .update(toRow(product))
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error(NO_PERMISSION);
  return fromRow(data[0]);
}

export async function deleteProductRow(id) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error(NO_PERMISSION);
}

export async function uploadProductImage(file) {
  const blob = await compressImage(file);
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: "image/jpeg",
      cacheControl: "31536000",
    });

  if (error) throw new Error(error.message);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}