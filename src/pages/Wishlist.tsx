import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
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

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };

  const addToCartFromWishlist = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const addAllToCart = () => {
    wishlistItems.forEach(product => addToCart(product));
    toast.success('All items added to cart!');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your wishlist
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
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-md mx-auto text-center">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Save items you love by clicking the heart icon on any product
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

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {wishlistItems.length > 0 && (
          <Button
            onClick={addAllToCart}
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add All to Cart
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <Card key={product.id} className="group cursor-pointer transition-all duration-300 hover:shadow-hover border-border/50 bg-card-gradient">
            <Link to={`/product/${product.id}`}>
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.originalPrice && (
                    <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sizes/Colors */}
                  <div className="mt-3 pt-3 border-t border-border/50">
                    {product.sizes && (
                      <div className="text-xs text-muted-foreground">
                        Sizes: {product.sizes.join(", ")}
                      </div>
                    )}
                    {product.colors && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Colors: {product.colors.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Link>

            {/* Action Buttons */}
            <div className="p-4 pt-0 flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCartFromWishlist(product);
                }}
                variant="outline"
                className="flex-1 gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromWishlist(product.id);
                }}
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
