import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Eye, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Order {
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

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your orders
            </p>
            <Link to="/login">
              <Button className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-md mx-auto text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">
            When you place your first order, it will appear here
          </p>
          <Link to="/">
            <Button className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Items</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Total Amount</h4>
                    <p className="text-sm text-muted-foreground">
                      ₹{order.total_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Payment Status</h4>
                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-1">Tracking Number</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {order.tracking_number}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Details - #{selectedOrder.order_number}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-4">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              {item.size && (
                                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                              )}
                              {item.color && (
                                <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.price.toLocaleString()}</TableCell>
                        <TableCell>₹{(item.price * item.quantity).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-4">Shipping Address</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium">{selectedOrder.shipping_address.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address.phone}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address.email}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedOrder.shipping_address.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address.country}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{(selectedOrder.total_amount * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (10%):</span>
                    <span>₹{(selectedOrder.total_amount * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Orders;
