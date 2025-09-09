import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRazorpay, CheckoutData } from "@/hooks/useRazorpay";
import { useGstSettings } from "@/hooks/useGstSettings";
import { indianStates, countries } from "@/utils/addressUtils";

const customerInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  state: z.string().min(1, "Please select a state"),
  country: z.string().min(1, "Please select a country"),
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;

interface CustomerInfoFormProps {
  checkoutData: Omit<CheckoutData, 'customerName' | 'customerEmail' | 'customerPhone'>;
  onCancel: () => void;
}

const CustomerInfoForm = ({ checkoutData, onCancel }: CustomerInfoFormProps) => {
  const { initiatePayment, loading } = useRazorpay();
  const { calculateGst } = useGstSettings();
  const [gstCalculation, setGstCalculation] = useState({
    gstRate: 0,
    gstAmount: 0,
    gstType: '',
    totalWithGst: checkoutData.amount
  });
  
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      state: "",
      country: "India",
    },
  });

  const watchedState = form.watch("state");
  const watchedCountry = form.watch("country");

  useEffect(() => {
    if (watchedState && watchedCountry) {
      const calculation = calculateGst(checkoutData.amount, watchedState, watchedCountry);
      setGstCalculation(calculation);
    }
  }, [watchedState, watchedCountry, checkoutData.amount, calculateGst]);

  const onSubmit = async (data: CustomerInfo) => {
    await initiatePayment({
      ...checkoutData,
      customerName: data.name,
      customerEmail: data.email,
      customerPhone: data.phone,
      amount: gstCalculation.totalWithGst, // Use total with GST
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please provide your details to complete the purchase
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your complete address with pincode" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {watchedCountry === "India" ? (
                            indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="Other">Other</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* GST Calculation Display */}
              {gstCalculation.gstAmount > 0 && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-2">Tax Calculation</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{checkoutData.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{gstCalculation.gstType} ({gstCalculation.gstRate}%):</span>
                      <span>₹{gstCalculation.gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{gstCalculation.totalWithGst.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay ₹${gstCalculation.totalWithGst.toFixed(2)}`}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInfoForm;