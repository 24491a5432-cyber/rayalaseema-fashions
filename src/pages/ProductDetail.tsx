import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { getProductById, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  
  const product = id ? getProductById(id) : null;
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    setShowCustomerForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to={`/${product.category}`} className="hover:text-foreground capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Back Button */}
      <Link to={`/${product.category}`}>
        <Button variant="outline" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Button>
      </Link>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-lg"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          {/* Additional images would go here */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={product.image}
                alt={`${product.name} view ${i}`}
                className="w-full h-20 object-cover rounded border-2 border-transparent hover:border-brand-gold cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8) 156 reviews</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </Badge>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size Selection */}
          {product.sizes && (
            <div>
              <h3 className="font-medium mb-3">Size</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? "bg-brand-gold text-brand-navy" : ""}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && (
            <div>
              <h3 className="font-medium mb-3">Color</h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className={selectedColor === color ? "bg-brand-gold text-brand-navy" : ""}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1 gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-medium"
            >
              Buy Now
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-brand-gold" />
              <span>Free shipping on orders above ₹1999</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="w-5 h-5 text-brand-gold" />
              <span>30-day easy returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-brand-gold" />
              <span>1-year warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <Separator className="mb-8" />
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <Link to={`/${product.category}`}>
              <Button variant="outline">View All {product.category}</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}

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
    </div>
  );
};

export default ProductDetail;