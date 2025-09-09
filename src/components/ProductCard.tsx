import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Product } from "@/data/products";
import { toast } from "sonner";
import { useState } from "react";
import CustomerInfoForm from "@/components/CustomerInfoForm";

type LegacyProduct = Product;

type SupabaseProduct = {
  id: string;
  title?: string;
  name?: string;
  price: number;
  originalPrice?: number;
  image_url?: string;
  image?: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
};

interface ProductCardProps { product: LegacyProduct | SupabaseProduct; }

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // For cart, coerce to legacy shape minimally
    const legacy: any = {
      ...(product as any),
      name: (product as any).name || (product as any).title || "Item",
      image: (product as any).image || (product as any).image_url || "/placeholder.svg",
    };
    addToCart(legacy);
    toast.success(`${legacy.name} added to cart!`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCustomerForm(true);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  const discountPercentage = (product as any).originalPrice 
    ? Math.round(((((product as any).originalPrice - (product as any).price) / (product as any).originalPrice) * 100))
    : 0;

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-hover border-border/50 bg-card-gradient">
      <Link to={`/product/${(product as any).id}`}>
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={(product as any).image || (product as any).image_url}
              alt={(product as any).name || (product as any).title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                -{discountPercentage}%
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background ${
                isInWishlist(product.id) ? 'opacity-100 text-red-500' : ''
              }`}
              onClick={handleWishlistToggle}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
              {(product as any).name || (product as any).title}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {(product as any).description}
            </p>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  ₹{(product as any).price.toLocaleString()}
                </span>
                {(product as any).originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{(product as any).originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-medium"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            {/* Sizes/Colors */}
            <div className="mt-3 pt-3 border-t border-border/50">
              {(product as any).sizes && (
                <div className="text-xs text-muted-foreground">
                  Sizes: {(product as any).sizes.join(", ")}
                </div>
              )}
              {(product as any).colors && (
                <div className="text-xs text-muted-foreground mt-1">
                  Colors: {(product as any).colors.join(", ")}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      
      {/* Customer Info Form Modal */}
      {showCustomerForm && (
        <CustomerInfoForm
          checkoutData={{
            amount: product.price,
            productName: product.name,
          }}
          onCancel={() => setShowCustomerForm(false)}
        />
      )}
    </Card>
  );
};

export default ProductCard;