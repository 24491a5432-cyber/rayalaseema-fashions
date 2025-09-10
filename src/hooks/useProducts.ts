import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductRecord {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  original_price?: number | null;
  in_stock?: boolean;
  created_at?: string;
}

const PRODUCTS_QUERY_KEY = ["products"] as const;

export const useProducts = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async (): Promise<ProductRecord[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,price,category,image,description,original_price,in_stock,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (payload: Omit<ProductRecord, "id" | "created_at">) => {
      const generatedId = (globalThis as any).crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const row = { id: generatedId, ...payload } as ProductRecord;
      const { data, error } = await supabase
        .from("products")
        .insert(row)
        .select("*")
        .single();
      if (error) throw error;
      return data as ProductRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<ProductRecord> & { id: string }) => {
      const { id, ...rest } = payload;
      // Only include columns that exist in the products table
      const allowedKeys = [
        "name",
        "price",
        "category",
        "image",
        "description",
        "original_price",
        "in_stock",
      ] as const;
      const updateData: Record<string, unknown> = {};
      for (const key of allowedKeys) {
        if (key in rest && (rest as any)[key] !== undefined) {
          (updateData as any)[key] = (rest as any)[key];
        }
      }
      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as ProductRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  return {
    products: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    addProduct: addMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};


