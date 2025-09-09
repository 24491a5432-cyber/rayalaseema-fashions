import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts, getAllProducts } from "@/data/products";
import { useState, useEffect } from "react";

const Index = () => {
  const [allProducts, setAllProducts] = useState(getAllProducts());
  
  // Refresh products when component mounts or localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setAllProducts(getAllProducts());
    };
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on mount in case products were added
    setAllProducts(getAllProducts());
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Premium
              <span className="block text-brand-gold">Men's Fashion</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Elevate your style with our curated collection of premium shirts, pants, t-shirts, and accessories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shirts">
                <Button 
                  size="lg" 
                  className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-semibold px-8"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/tshirts">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 border-white text-white hover:bg-white hover:text-primary"
                >
                  View Lookbook
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-brand-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free delivery on orders above ₹1999</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-brand-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">100% secure payment with Razorpay</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-brand-navy" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No returns</h3>
              <p className="text-muted-foreground">All sales are final - no returns or exchanges accepted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium fashion essentials
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/shirts">
              <Button variant="outline" size="lg" className="px-8">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: "Shirts", 
                href: "/shirts", 
                description: "Formal & Casual",
                image: "/src/assets/shirt-1.jpg",
                gradient: "from-blue-500/20 to-blue-600/20"
              },
              { 
                name: "Pants", 
                href: "/pants", 
                description: "Chinos & Trousers",
                image: "/src/assets/pants-1.jpg",
                gradient: "from-gray-500/20 to-gray-600/20"
              },
              { 
                name: "T-Shirts", 
                href: "/tshirts", 
                description: "Comfortable Wear",
                image: "/src/assets/tshirt-1.jpg",
                gradient: "from-green-500/20 to-green-600/20"
              },
              { 
                name: "Accessories", 
                href: "/accessories", 
                description: "Complete Your Look",
                image: "/src/assets/watch-1.jpg",
                gradient: "from-purple-500/20 to-purple-600/20"
              }
            ].map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Background Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-brand-gold transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-white/90 mb-4 text-sm font-medium">
                        {category.description}
                      </p>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-brand-gold hover:text-brand-navy hover:border-brand-gold transition-all duration-300"
                      >
                        Shop Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-gold/50 transition-colors duration-300 rounded-2xl"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ravi Kumar",
                rating: 5,
                comment: "Excellent quality shirts! The fit is perfect and the fabric feels premium. Highly recommended!"
              },
              {
                name: "Suresh Reddy", 
                rating: 5,
                comment: "Great collection and fast delivery. The customer service is also very responsive."
              },
              {
                name: "Mohan Das",
                rating: 5,
                comment: "Love the variety of products. The pants fit perfectly and look very professional."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-card text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                <h4 className="font-semibold">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;