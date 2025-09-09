import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Download, Eye, Calendar, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  gst_amount: number;
  gst_rate: number;
  shipping_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  size?: string;
  color?: string;
}

const OrderHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load order history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const downloadInvoice = async (order: Order) => {
    // This would typically generate a PDF invoice
    toast({
      title: "Invoice Download",
      description: "Invoice download functionality will be implemented soon."
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Order History</h3>
          <p className="text-sm text-muted-foreground">
            View and track all your orders
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order #{order.order_number}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(order.created_at), 'PPP')}
                    </span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      Payment: {order.payment_status}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadInvoice(order)}>
                    <Download className="w-4 h-4 mr-2" />
                    Invoice
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Track
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    {item.product_image && (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        <span>₹{item.unit_price.toFixed(2)} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.total_price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.gst_amount > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span>GST ({order.gst_rate}%)</span>
                    <span>₹{order.gst_amount.toFixed(2)}</span>
                  </div>
                )}
                {order.shipping_amount > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span>Shipping</span>
                    <span>₹{order.shipping_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Status */}
              {order.status === 'shipped' || order.status === 'delivered' ? (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {order.status === 'delivered' ? 'Order Delivered' : 'Order Shipped'}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    {order.status === 'delivered' 
                      ? 'Your order has been successfully delivered.'
                      : 'Your order is on its way. Track shipment for updates.'
                    }
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `No orders with status "${statusFilter}".`
                }
              </p>
              <Button className="mt-4" onClick={() => window.location.href = '/'}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;