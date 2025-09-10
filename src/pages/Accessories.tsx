import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const Accessories = () => {
  const [sortBy, setSortBy] = useState("featured");
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

      {/* Products Grid */}
      <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedProducts().map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {accessories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No accessories found matching your criteria.</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Accessories;