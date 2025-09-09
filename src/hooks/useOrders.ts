import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sendOrderConfirmationEmail, sendOrderShippedEmail } from '@/utils/emailNotifications';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  items: Array<{
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          order_number: orderNumber,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => [data, ...prev]);
      
      // Send order confirmation email
      try {
        await sendOrderConfirmationEmail({
          orderNumber: data.order_number,
          customerName: orderData.shipping_address.name,
          customerEmail: orderData.shipping_address.email,
          totalAmount: orderData.total_amount,
          items: orderData.items,
          shippingAddress: orderData.shipping_address,
        });
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }
      
      toast.success('Order placed successfully!');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
      return { data: null, error };
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (error) throw error;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status, updated_at: new Date().toISOString() }
            : order
        )
      );

      toast.success('Order status updated');
      return { error: null };
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
      return { error };
    }
  };

  const addTrackingNumber = async (orderId: string, trackingNumber: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          tracking_number: trackingNumber,
          status: 'shipped',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedOrder = orders.find(order => order.id === orderId);
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                tracking_number: trackingNumber, 
                status: 'shipped',
                updated_at: new Date().toISOString() 
              }
            : order
        )
      );

      // Send shipping notification email
      if (updatedOrder) {
        try {
          await sendOrderShippedEmail({
            orderNumber: updatedOrder.order_number,
            customerName: updatedOrder.shipping_address.name,
            customerEmail: updatedOrder.shipping_address.email,
            trackingNumber: trackingNumber,
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
          });
        } catch (emailError) {
          console.error('Failed to send shipping notification email:', emailError);
        }
      }

      toast.success('Tracking number added');
      return { error: null };
    } catch (error) {
      console.error('Error adding tracking number:', error);
      toast.error('Failed to add tracking number');
      return { error };
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (error) throw error;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled', updated_at: new Date().toISOString() }
            : order
        )
      );

      toast.success('Order cancelled');
      return { error: null };
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
      return { error };
    }
  };

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    addTrackingNumber,
    cancelOrder,
    refetch: fetchOrders,
  };
};
