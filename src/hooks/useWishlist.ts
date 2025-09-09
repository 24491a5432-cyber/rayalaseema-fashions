import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Product } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const items = data?.map(item => item.products).filter(Boolean) as Product[] || [];
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (!user) {
      toast.error('Please sign in to add items to wishlist');
      return { error: 'User not authenticated' };
    }

    try {
      // Check if already in wishlist
      const { data: existing } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (existing) {
        toast.info('Item already in wishlist');
        return { error: 'Already in wishlist' };
      }

      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: product.id,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      setWishlistItems(prev => [...prev, product]);
      toast.success('Added to wishlist');
      return { error: null };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return { error };
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      toast.success('Removed from wishlist');
      return { error: null };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return { error };
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    refetch: fetchWishlist,
  };
};
