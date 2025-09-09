import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, MapPin, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { countries, indianStates } from "@/utils/addressUtils";

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  is_default: boolean;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const AddressSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: 'shipping' as 'shipping' | 'billing',
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses((data || []) as Address[]);
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('addresses')
          .update(formData)
          .eq('id', editingAddress.id);

        if (error) throw error;

        toast({
          title: "Address Updated",
          description: "Your address has been updated successfully."
        });
      } else {
        // Create new address
        const { error } = await supabase
          .from('addresses')
          .insert({
            ...formData,
            user_id: user.id
          });

        if (error) throw error;

        toast({
          title: "Address Added",
          description: "Your new address has been added successfully."
        });
      }

      fetchAddresses();
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      full_name: address.full_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Address Deleted",
        description: "The address has been removed from your account."
      });

      fetchAddresses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSetDefault = async (id: string, type: 'shipping' | 'billing') => {
    try {
      // First remove default from all addresses of this type
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id)
        .eq('type', type);

      // Then set this address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Default Address Set",
        description: `This address is now your default ${type} address.`
      });

      fetchAddresses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingAddress(null);
    setFormData({
      type: 'shipping',
      full_name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      is_default: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Saved Addresses</h3>
          <p className="text-sm text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for your {formData.type} address
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Address Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipping">Shipping Address</SelectItem>
                    <SelectItem value="billing">Billing Address</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line_1">Address Line 1</Label>
                <Input
                  id="address_line_1"
                  name="address_line_1"
                  value={formData.address_line_1}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                <Input
                  id="address_line_2"
                  name="address_line_2"
                  value={formData.address_line_2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => handleSelectChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.country === 'India' ? 
                        indianStates.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        )) :
                        <SelectItem value={formData.state}>{formData.state}</SelectItem>
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="rounded border-border"
                />
                <Label htmlFor="is_default" className="text-sm font-normal">
                  Set as default {formData.type} address
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className={`relative ${address.is_default ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {address.type === 'shipping' ? 'Shipping' : 'Billing'} Address
                  {address.is_default && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Default
                    </span>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{address.full_name}</p>
                <p>{address.phone}</p>
                <p>{address.address_line_1}</p>
                {address.address_line_2 && <p>{address.address_line_2}</p>}
                <p>{address.city}, {address.state} {address.postal_code}</p>
                <p>{address.country}</p>
              </div>
              
              {!address.is_default && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleSetDefault(address.id, address.type)}
                >
                  Set as Default
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {addresses.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No addresses saved yet</p>
              <p className="text-sm text-muted-foreground">Add your first address to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddressSettings;