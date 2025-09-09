import { useState } from "react";
import { Plus, Edit, Trash2, Save, X, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useProducts, ProductRecord } from "@/hooks/useProducts";

const ProductManagement = () => {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [imageMode] = useState<"url">("url");

  const [form, setForm] = useState<Partial<ProductRecord>>({
    title: "",
    category: "shirts",
    price: 0,
    description: "",
    image_url: "",
    stock: 0,
  });

  const categories = [
    { value: "shirts", label: "Shirts" },
    { value: "tshirts", label: "T-Shirts" },
    { value: "pants", label: "Pants" },
    { value: "accessories", label: "Accessories" }
  ];

  const resetForm = () => {
    setForm({ title: "", category: "shirts", price: 0, description: "", image_url: "", stock: 0 });
    setEditingId(null);
    setIsAddingProduct(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.category) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      if (editingId) {
        await updateProduct({ id: editingId, ...form });
        toast({ title: "Updated", description: "Product updated successfully" });
      } else {
        await addProduct({
          title: form.title!,
          price: Number(form.price),
          category: form.category!,
          image_url: form.image_url || "/placeholder.svg",
          description: form.description || "",
          stock: Number(form.stock || 0),
        });
        toast({ title: "Added", description: "Product added successfully" });
      }
      resetForm();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not save product", variant: "destructive" });
    }
  };

  const handleEdit = (p: ProductRecord) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category,
      price: p.price,
      description: p.description,
      image_url: p.image_url,
      stock: p.stock,
    });
    setIsAddingProduct(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({ title: "Deleted", description: "Product deleted" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not delete", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Product Management</h1>
            <Button 
              onClick={() => { setIsAddingProduct(!isAddingProduct); if (!isAddingProduct) resetForm(); }}
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAddingProduct ? "Close" : "Add New Product"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {isAddingProduct && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingId ? 'Edit Product' : 'Add New Product'}
                <Button variant="ghost" size="sm" onClick={() => setIsAddingProduct(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input id="title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-muted border-border" placeholder="Enter product title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                    <SelectTrigger className="bg-muted border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input id="price" type="number" value={form.price as number | undefined} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="bg-muted border-border" placeholder="Enter price" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" value={form.stock as number | undefined} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="bg-muted border-border" placeholder="Available quantity" />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Product Image URL</Label>
                <Tabs value={imageMode}>
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="url">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      External URL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-2">
                    <Input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="bg-muted border-border" placeholder="https://..." />
                  </TabsContent>
                </Tabs>
                {form.image_url && (
                  <div className="mt-2">
                    <img src={form.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted border-border" placeholder="Enter product description" rows={3} />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsAddingProduct(false)}>Cancel</Button>
                <Button onClick={handleSave} className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <Card key={p.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-4" />}
                      <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{p.category}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-brand-gold font-bold">₹{p.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={p.stock && p.stock > 0 ? "default" : "destructive"} className="text-xs">
                          {p.stock && p.stock > 0 ? `In Stock: ${p.stock}` : "Out of Stock"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(p)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;