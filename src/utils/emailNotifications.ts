// Simple email notification utilities
// In a real application, you would integrate with an email service like SendGrid, AWS SES, etc.

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendOrderConfirmationEmail = async (orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}) => {
  const emailTemplate: EmailTemplate = {
    to: orderData.customerEmail,
    subject: `Order Confirmation - ${orderData.orderNumber} | Rayalaseema Fashions`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Rayalaseema Fashions</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order Confirmation</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Thank you for your order!</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin-bottom: 15px;">Order Details</h3>
            <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            <p><strong>Total Amount:</strong> ₹${orderData.totalAmount.toLocaleString()}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin-bottom: 15px;">Items Ordered</h3>
            ${orderData.items.map(item => `
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <div>
                  <strong>${item.name}</strong><br>
                  <span style="color: #64748b;">Qty: ${item.quantity}</span>
                </div>
                <div style="text-align: right;">
                  ₹${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin-bottom: 15px;">Shipping Address</h3>
            <p>
              ${orderData.shippingAddress.name}<br>
              ${orderData.shippingAddress.address}<br>
              ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}<br>
              Phone: ${orderData.shippingAddress.phone}
            </p>
          </div>
          
          <div style="background: #d4af37; color: #1e293b; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">What's Next?</h3>
            <p style="margin: 0;">We'll send you another email when your order ships. You can track your order status in your account.</p>
          </div>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; opacity: 0.8;">© 2024 Rayalaseema Fashions. All rights reserved.</p>
          <p style="margin: 10px 0 0 0; opacity: 0.6; font-size: 14px;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
    text: `
      Order Confirmation - ${orderData.orderNumber}
      
      Thank you for your order!
      
      Order Details:
      - Order Number: ${orderData.orderNumber}
      - Order Date: ${new Date().toLocaleDateString('en-IN')}
      - Total Amount: ₹${orderData.totalAmount.toLocaleString()}
      
      Items Ordered:
      ${orderData.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString()}`).join('\n')}
      
      Shipping Address:
      ${orderData.shippingAddress.name}
      ${orderData.shippingAddress.address}
      ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}
      Phone: ${orderData.shippingAddress.phone}
      
      We'll send you another email when your order ships.
      
      © 2024 Rayalaseema Fashions. All rights reserved.
    `
  };

  // In a real application, you would send this email using an email service
  console.log('Email notification would be sent:', emailTemplate);
  
  // For demo purposes, we'll just log the email
  // In production, integrate with SendGrid, AWS SES, or similar service
  return { success: true, messageId: `demo-${Date.now()}` };
};

export const sendOrderShippedEmail = async (orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  estimatedDelivery: string;
}) => {
  const emailTemplate: EmailTemplate = {
    to: orderData.customerEmail,
    subject: `Your Order Has Shipped - ${orderData.orderNumber} | Rayalaseema Fashions`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Rayalaseema Fashions</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order Shipped</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Great news! Your order has shipped!</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin-bottom: 15px;">Shipping Details</h3>
            <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
            <p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>
            <p><strong>Estimated Delivery:</strong> ${orderData.estimatedDelivery}</p>
          </div>
          
          <div style="background: #d4af37; color: #1e293b; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">Track Your Package</h3>
            <p style="margin: 0;">Use the tracking number above to track your package on the courier's website.</p>
          </div>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; opacity: 0.8;">© 2024 Rayalaseema Fashions. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Your Order Has Shipped - ${orderData.orderNumber}
      
      Great news! Your order has shipped!
      
      Shipping Details:
      - Order Number: ${orderData.orderNumber}
      - Tracking Number: ${orderData.trackingNumber}
      - Estimated Delivery: ${orderData.estimatedDelivery}
      
      Use the tracking number above to track your package on the courier's website.
      
      © 2024 Rayalaseema Fashions. All rights reserved.
    `
  };

  console.log('Shipping notification would be sent:', emailTemplate);
  return { success: true, messageId: `demo-${Date.now()}` };
};

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const emailTemplate: EmailTemplate = {
    to: email,
    subject: 'Reset Your Password - Rayalaseema Fashions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Rayalaseema Fashions</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Reset Your Password</h2>
          
          <p style="color: #64748b; margin-bottom: 20px;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #d4af37; color: #1e293b; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            If you didn't request this password reset, please ignore this email. This link will expire in 24 hours.
          </p>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; opacity: 0.8;">© 2024 Rayalaseema Fashions. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Reset Your Password - Rayalaseema Fashions
      
      We received a request to reset your password.
      
      Click the link below to create a new password:
      ${resetLink}
      
      If you didn't request this password reset, please ignore this email. This link will expire in 24 hours.
      
      © 2024 Rayalaseema Fashions. All rights reserved.
    `
  };

  console.log('Password reset email would be sent:', emailTemplate);
  return { success: true, messageId: `demo-${Date.now()}` };
};
