import { useState } from "react";
import { initializeRazorpay, openRazorpayCheckout, RAZORPAY_CONFIG } from "@/utils/razorpay";
import { toast } from "sonner";

export interface CheckoutData {
  amount: number;
  productName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (checkoutData: CheckoutData) => {
    try {
      setLoading(true);
      
      // Initialize Razorpay
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      // Configure Razorpay options
      const options = {
        key: RAZORPAY_CONFIG.key_id,
        amount: checkoutData.amount * 100, // Convert to paise
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.name,
        description: `Purchase: ${checkoutData.productName}`,
        handler: (response: any) => {
          toast.success("Payment successful!");
          console.log("Payment response:", response);
          // Here you would typically send the payment details to your backend
          // to verify the payment and complete the order
        },
        prefill: {
          name: checkoutData.customerName || "",
          email: checkoutData.customerEmail || "",
          contact: checkoutData.customerPhone || "",
        },
        theme: {
          color: RAZORPAY_CONFIG.theme_color,
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
          }
        }
      };

      // Open Razorpay checkout
      openRazorpayCheckout(options);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading
  };
};