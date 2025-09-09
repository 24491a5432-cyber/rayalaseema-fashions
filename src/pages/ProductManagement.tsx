import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Upload, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products, Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const ProductManagement = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load all products (original + custom) on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('customProducts');
    const customProducts = savedProducts ? JSON.parse(savedProducts) : [];
    setProductList([...products, ...customProducts]);
  }, []);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    category: "shirts",
    price: 0,
    description: "",
    sizes: [],
    colors: [],
    inStock: true
  });

  // Custom sizes and colors management
  const [customSizes, setCustomSizes] = useState<string[]>(["S", "M", "L", "XL", "XXL"]);
  const [customColors, setCustomColors] = useState<string[]>(["Black", "White", "Navy", "Gray", "Brown"]);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  
  // Image management
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");

  const categories = [
    { value: "shirts", label: "Shirts" },
    { value: "tshirts", label: "T-Shirts" },
    { value: "pants", label: "Pants" },
    { value: "accessories", label: "Accessories" }
  ];

  const pantSizes = ["28", "30", "32", "34", "36", "38"];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: `${newProduct.category}-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category as Product['category'],
      price: newProduct.price,
      originalPrice: newProduct.originalPrice,
      image: imageUrl || "/placeholder.svg",
      description: newProduct.description || "",
      sizes: newProduct.sizes || [],
      colors: newProduct.colors || [],
      inStock: newProduct.inStock ?? true
    };

    const updatedList = [...productList, product];
    setProductList(updatedList);
    
    // Save custom products to localStorage
    const customProducts = updatedList.filter(p => !products.find(original => original.id === p.id));
    localStorage.setItem('customProducts', JSON.stringify(customProducts));
    
    setNewProduct({
      name: "",
      category: "shirts",
      price: 0,
      description: "",
      sizes: [],
      colors: [],
      inStock: true
    });
    setImageUrl("");
    setIsAddingProduct(false);

    toast({
      title: "Success",
      description: "Product added successfully!"
    });
  };

  const handleDeleteProduct = (id: string) => {
    const updatedList = productList.filter(p => p.id !== id);
    setProductList(updatedList);
    
    // Update localStorage
    const customProducts = updatedList.filter(p => !products.find(original => original.id === p.id));
    localStorage.setItem('customProducts', JSON.stringify(customProducts));
    
    toast({
      title: "Success",
      description: "Product deleted successfully!"
    });
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      sizes: product.sizes || [],
      colors: product.colors || [],
      inStock: product.inStock
    });
    setImageUrl(product.image);
    setEditingProduct(product.id);
    setIsAddingProduct(true);
    
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !newProduct.name || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const updatedProduct: Product = {
      id: editingProduct,
      name: newProduct.name,
      category: newProduct.category as Product['category'],
      price: newProduct.price,
      originalPrice: newProduct.originalPrice,
      image: imageUrl || "/placeholder.svg",
      description: newProduct.description || "",
      sizes: newProduct.sizes || [],
      colors: newProduct.colors || [],
      inStock: newProduct.inStock ?? true
    };

    const updatedList = productList.map(p => p.id === editingProduct ? updatedProduct : p);
    setProductList(updatedList);
    
    // Update localStorage
    const customProducts = updatedList.filter(p => !products.find(original => original.id === p.id));
    localStorage.setItem('customProducts', JSON.stringify(customProducts));
    
    setEditingProduct(null);
    setNewProduct({
      name: "",
      category: "shirts",
      price: 0,
      description: "",
      sizes: [],
      colors: [],
      inStock: true
    });
    setImageUrl("");
    setIsAddingProduct(false);

    toast({
      title: "Success",
      description: "Product updated successfully!"
    });
  };

  const toggleSize = (size: string) => {
    const sizes = newProduct.sizes || [];
    if (sizes.includes(size)) {
      setNewProduct({
        ...newProduct,
        sizes: sizes.filter(s => s !== size)
      });
    } else {
      setNewProduct({
        ...newProduct,
        sizes: [...sizes, size]
      });
    }
  };

  const toggleColor = (color: string) => {
    const colors = newProduct.colors || [];
    if (colors.includes(color)) {
      setNewProduct({
        ...newProduct,
        colors: colors.filter(c => c !== color)
      });
    } else {
      setNewProduct({
        ...newProduct,
        colors: [...colors, color]
      });
    }
  };

  const getSizesForCategory = (category: string) => {
    return category === "pants" ? pantSizes : customSizes;
  };

  const addCustomSize = () => {
    if (newSize && !customSizes.includes(newSize)) {
      setCustomSizes([...customSizes, newSize]);
      setNewSize("");
    }
  };

  const addCustomColor = () => {
    if (newColor && !customColors.includes(newColor)) {
      setCustomColors([...customColors, newColor]);
      setNewColor("");
    }
  };

  const removeCustomSize = (size: string) => {
    setCustomSizes(customSizes.filter(s => s !== size));
  };

  const removeCustomColor = (color: string) => {
    setCustomColors(customColors.filter(c => c !== color));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Product Management</h1>
            <Button 
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Add Product Form */}
        {isAddingProduct && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingProduct(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-muted border-border"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({...newProduct, category: value as Product['category']})}
                  >
                    <SelectTrigger className="bg-muted border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value) || 0})}
                    className="bg-muted border-border"
                    placeholder="Enter price"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={newProduct.originalPrice || ""}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: parseInt(e.target.value) || undefined})}
                    className="bg-muted border-border"
                    placeholder="Enter original price (optional)"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Product Image</Label>
                <Tabs value={imageMode} onValueChange={(value) => setImageMode(value as "url" | "upload")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      External URL
                    </TabsTrigger>
                    <TabsTrigger value="upload">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url" className="space-y-2">
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-muted border-border"
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    />
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-muted border-border"
                    />
                  </TabsContent>
                </Tabs>
                
                {imageUrl && (
                  <div className="mt-2">
                    <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="bg-muted border-border"
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              {/* Custom Sizes Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Available Sizes</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Add custom size"
                      className="w-32"
                    />
                    <Button size="sm" onClick={addCustomSize}>Add</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Custom Sizes:</div>
                  <div className="flex flex-wrap gap-2">
                    {customSizes.map((size) => (
                      <Badge
                        key={size}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => removeCustomSize(size)}
                      >
                        {size} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getSizesForCategory(newProduct.category || "shirts").map((size) => (
                    <Badge
                      key={size}
                      variant={newProduct.sizes?.includes(size) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Custom Colors Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Available Colors</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Add custom color"
                      className="w-32"
                    />
                    <Button size="sm" onClick={addCustomColor}>Add</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Custom Colors:</div>
                  <div className="flex flex-wrap gap-2">
                    {customColors.map((color) => (
                      <Badge
                        key={color}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => removeCustomColor(color)}
                      >
                        {color} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {customColors.map((color) => (
                    <Badge
                      key={color}
                      variant={newProduct.colors?.includes(color) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingProduct(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList.map((product) => (
            <Card key={product.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{product.category}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-brand-gold font-bold">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-muted-foreground line-through text-sm">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs text-muted-foreground">Sizes: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.sizes.map((size) => (
                            <Badge key={size} variant="outline" className="text-xs">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs text-muted-foreground">Colors: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.colors.map((color) => (
                            <Badge key={color} variant="outline" className="text-xs">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;