import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const Accessories = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const { products } = useProducts();
  const [accessories, setAccessories] = useState<any[]>([]);

  // Refresh products when localStorage changes
  useEffect(() => {
    setAccessories(products.filter((p: any) => p.category === "accessories"));
  }, [products]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" }
  ];

  const getSortedProducts = () => {
    const products = [...accessories];
    
    switch (sortBy) {
      case "price-low":
        return products.sort((a, b) => a.price - b.price);
      case "price-high":
        return products.sort((a, b) => b.price - a.price);
      case "newest":
        return products.reverse();
      default:
        return products;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Home</span>
          <span>/</span>
          <span className="text-foreground">Accessories</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Premium Accessories</h1>
            <p className="text-muted-foreground">
              Complete your look with our collection of {accessories.length} premium accessories
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <Card className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Filters</h3>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Category</h4>
              <div className="space-y-2">
                {["Watches", "Belts", "Sunglasses", "Wallets", "Ties", "Cufflinks"].map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Color</h4>
              <div className="flex flex-wrap gap-2">
                {["Black", "Brown", "Tan", "Silver", "Gold", "Blue"].map((color) => (
                  <Badge 
                    key={color} 
                    variant="outline"
                    className="cursor-pointer hover:bg-brand-gold hover:text-brand-navy"
                  >
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Brand</h4>
              <div className="space-y-2">
                {["Rayalaseema", "Premium", "Classic", "Modern"].map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-2">
                {[
                  { label: "Under ₹1,000", value: "0-1000" },
                  { label: "₹1,000 - ₹2,000", value: "1000-2000" },
                  { label: "₹2,000 - ₹4,000", value: "2000-4000" },
                  { label: "Above ₹4,000", value: "4000+" }
                ].map((range) => (
                  <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedProducts().map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {accessories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No accessories found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accessories;