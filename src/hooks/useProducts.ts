import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductRecord {
  id: string;
  title: string;
  price: number;
  category: string;
  image_url: string;
  description?: string;
  stock?: number;
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
        .select("id,title,price,category,image_url,description,stock,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (payload: Omit<ProductRecord, "id" | "created_at">) => {
      const { data, error } = await supabase.from("products").insert(payload).select("*").single();
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
      const { data, error } = await supabase.from("products").update(rest).eq("id", id).select("*").single();
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


