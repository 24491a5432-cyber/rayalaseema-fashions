import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image_url?: string;
  description?: string;
  inStock?: boolean;
  created_at?: string;
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Product[];
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("category", category);
  if (error) throw error;
  return data as Product[];
}

// Get single product
export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Product;
}

// Add a new product
export async function addProduct(product: Omit<Product, "id">): Promise<Product> {
  const { data, error } = await supabase.from("products").insert([product]).select().single();
  if (error) throw error;
  return data as Product;
}

// Update product
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as Product;
}
