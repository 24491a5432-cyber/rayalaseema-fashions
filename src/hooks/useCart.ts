import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage or database on mount
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      loadCartFromLocalStorage();
    }
  }, [user]);

  // Save cart to localStorage whenever it changes (for non-authenticated users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem("rayalaseema-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("rayalaseema-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("rayalaseema-cart");
      }
    }
  };

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_cart')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const items = data?.map(item => ({
        ...item.product_data,
        quantity: item.quantity,
        selectedSize: item.selected_size,
        selectedColor: item.selected_color,
      })) as CartItem[] || [];

      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart from database:", error);
      // Fallback to localStorage
      loadCartFromLocalStorage();
    }
  };

  const saveCartToDatabase = async (items: CartItem[]) => {
    if (!user) return;

    try {
      // Clear existing cart items
      await supabase
        .from('user_cart')
        .delete()
        .eq('user_id', user.id);

      // Insert new cart items
      if (items.length > 0) {
        const cartData = items.map(item => ({
          user_id: user.id,
          product_id: item.id,
          product_data: item,
          quantity: item.quantity,
          selected_size: item.selectedSize,
          selected_color: item.selectedColor,
        }));

        const { error } = await supabase
          .from('user_cart')
          .insert(cartData);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving cart to database:", error);
    }
  };

  const addToCart = (product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => 
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
      );

      let updated;
      if (existingItemIndex > -1) {
        updated = [...prev];
        updated[existingItemIndex].quantity += quantity;
      } else {
        updated = [...prev, { ...product, quantity, selectedSize, selectedColor }];
      }

      // Save to database if user is authenticated
      if (user) {
        saveCartToDatabase(updated);
      }

      return updated;
    });
  };

  const removeFromCart = (id: string, selectedSize?: string, selectedColor?: string) => {
    setCartItems((prev) => {
      const updated = prev.filter(
        (item) => !(
          item.id === id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
        )
      );

      // Save to database if user is authenticated
      if (user) {
        saveCartToDatabase(updated);
      }

      return updated;
    });
  };

  const updateQuantity = (id: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedSize, selectedColor);
      return;
    }

    setCartItems((prev) => {
      const updated = prev.map((item) => 
        item.id === id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      );

      // Save to database if user is authenticated
      if (user) {
        saveCartToDatabase(updated);
      }

      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    
    // Clear from database if user is authenticated
    if (user) {
      saveCartToDatabase([]);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItems = () => cartItems;

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartItems,
  };
};