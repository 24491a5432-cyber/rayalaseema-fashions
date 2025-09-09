import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useState } from "react";
import CustomerInfoForm from "@/components/CustomerInfoForm";

const Cart = () => {
  const { getCartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const cartItems = getCartItems();
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const handleQuantityUpdate = (id: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    updateQuantity(id, quantity, selectedSize, selectedColor);
    if (quantity === 0) {
      toast.success("Item removed from cart");
    }
  };

  const handleRemoveItem = (id: string, selectedSize?: string, selectedColor?: string) => {
    removeFromCart(id, selectedSize, selectedColor);
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    setShowCustomerForm(true);
  };

  const getTotalWithTaxAndShipping = () => {
    const subtotal = getTotalPrice();
    const shipping = subtotal >= 1999 ? 0 : 99;
    // GST will be calculated based on shipping address in checkout form
    return subtotal + shipping;
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/">
            <Button className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Home</span>
          <span>/</span>
          <span className="text-foreground">Shopping Cart</span>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Cart Items ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-4 p-4 border border-border rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedSize && item.selectedColor && <span> • </span>}
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => handleQuantityUpdate(
                            item.id, 
                            item.quantity - 1, 
                            item.selectedSize, 
                            item.selectedColor
                          )}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => handleQuantityUpdate(
                            item.id, 
                            item.quantity + 1, 
                            item.selectedSize, 
                            item.selectedColor
                          )}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive w-8 h-8"
                          onClick={() => handleRemoveItem(
                            item.id, 
                            item.selectedSize, 
                            item.selectedColor
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-brand-gold">
                  {getTotalPrice() >= 1999 ? "FREE" : "₹99"}
                </span>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>GST</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal + Shipping</span>
                  <span>
                    ₹{(getTotalPrice() + 
                       (getTotalPrice() >= 1999 ? 0 : 99)
                      ).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  GST will be added based on your shipping address
                </div>
              </div>
              
              {getTotalPrice() < 1999 && (
                <div className="text-sm text-muted-foreground">
                  Add ₹{(1999 - getTotalPrice()).toLocaleString()} more for free shipping
                </div>
              )}
              
              <Button 
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-semibold"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              {/* GST Information */}
              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                <div className="font-medium mb-1">GST Information:</div>
                <div>• Andhra Pradesh: Local GST rate</div>
                <div>• Other Indian States: IGST rate</div>
                <div>• International: Special GST rate</div>
                <div className="mt-1 text-xs">GST rates are configurable by admin</div>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Secure payment powered by Razorpay
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Info Form Modal */}
      {showCustomerForm && (
        <CustomerInfoForm
          checkoutData={{
            amount: getTotalWithTaxAndShipping(),
            productName: `Cart Items (${getTotalItems()} items)`,
          }}
          onCancel={() => setShowCustomerForm(false)}
        />
      )}
    </div>
  );
};

export default Cart;