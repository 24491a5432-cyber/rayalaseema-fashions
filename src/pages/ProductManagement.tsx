import { useState } from "react";
import { Plus, Edit, Trash2, Save, X, Link as LinkIcon, Upload } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

const ProductManagement = () => {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [imageMode, setImageMode] = useState<"upload" | "url">("url");
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState<Partial<ProductRecord>>({
    name: "",
    category: "shirts",
    price: 0,
    description: "",
    image: "",
    in_stock: true,
  });

  const categories = [
    { value: "shirts", label: "Shirts" },
    { value: "tshirts", label: "T-Shirts" },
    { value: "pants", label: "Pants" },
    { value: "accessories", label: "Accessories" }
  ];

  const resetForm = () => {
    setForm({ name: "", category: "shirts", price: 0, description: "", image: "", in_stock: true });
    setEditingId(null);
    setFile(null);
    setImageMode("url");
  };

  const uploadImageIfNeeded = async (): Promise<string> => {
    if (imageMode === "url") {
      return form.image || "";
    }
    if (!file) return form.image || "";
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
    return publicUrl;
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      const imageUrl = await uploadImageIfNeeded();
      if (editingId) {
        await updateProduct({ id: editingId, ...form, image: imageUrl });
        toast({ title: "Updated", description: "Product updated successfully" });
      } else {
        await addProduct({
          name: form.name!,
          price: Number(form.price),
          category: form.category!,
          image: imageUrl || "/placeholder.svg",
          description: form.description || "",
          original_price: form.original_price ?? null,
          in_stock: form.in_stock ?? true,
        } as any);
        toast({ title: "Added", description: "Product added successfully" });
      }
      resetForm();
      setIsAddingProduct(false);
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Could not save product", variant: "destructive" });
    }
  };

  const handleEdit = (p: ProductRecord) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description,
      image: p.image,
      original_price: p.original_price,
      in_stock: p.in_stock,
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
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-muted border-border" placeholder="Enter product name" />
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
                <Label>Product Image</Label>
                <Tabs value={imageMode} onValueChange={(v) => setImageMode(v as any)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="url">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      URL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="space-y-2">
                    <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="bg-muted border-border" />
                  </TabsContent>
                  <TabsContent value="url" className="space-y-2">
                    <Input value={form.image || ""} onChange={(e) => setForm({ ...form, image: e.target.value })} className="bg-muted border-border" placeholder="https://..." />
                  </TabsContent>
                </Tabs>
                {(form.image || file) && (
                  <div className="mt-2">
                    <img src={file ? URL.createObjectURL(file) : (form.image as string)} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
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
                      {p.image && <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-4" />}
                      <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{p.category}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-brand-gold font-bold">₹{p.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={p.in_stock ? "default" : "destructive"} className="text-xs">
                          {p.in_stock ? "In Stock" : "Out of Stock"}
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