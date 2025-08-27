import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import axios from "axios";
import { config } from "@/config/env";
import { toast } from "sonner";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const cartItems = cartState.items;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Razorpay Checkout script once
  useEffect(() => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]') as HTMLScriptElement | null;
    if (existing) return;
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
    return () => {
      if (s && s.parentElement) {
        s.parentElement.removeChild(s);
      }
    };
  }, []);

  // Calculate totals based on actual cart items
  const calculateTotals = () => {
    const subtotalValue = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const subtotal = `${subtotalValue.toLocaleString()}/-`;
    const shipping = "Free";
    const total = `${subtotalValue.toLocaleString()}/-`;
    
    return { subtotal, shipping, total };
  };

  const { subtotal, shipping, total } = calculateTotals();

  // Numeric totals for backend amount field
  const subtotalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalValue = subtotalValue; // Shipping is Free

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to complete your order');
        navigate('/login');
        return;
      }

      const address = {
        fullName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        phone: formData.phone,
        line1: formData.address,
        line2: formData.apartment || '',
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country || 'IN',
      };

      const items = cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.imageUrl,
      }));

      // Prepare billing address (if different from shipping)
      const billingAddress = !formData.payment?.sameAsShipping
        ? formData.payment.billingAddress 
        : address;

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = 0; // Free shipping
      const total = subtotal + shipping;

      // Get user email from token or user profile
      const userEmail = localStorage.getItem('userEmail') || 'user@example.com'; // Fallback, but this should be available from auth
      
      // Create Razorpay order on backend with enhanced data
      const res = await axios.post(
        `${config.api.baseUrl}/order/razorpay`,
        { 
          items, 
          amount: totalValue, // Keep for backward compatibility
          subtotal,
          shipping,
          total,
          address,
          billingAddress,
          customerEmail: userEmail,
          customerPhone: formData.phone,
          paymentMethod: formData.payment?.method || 'card'
        },
        { headers: { token } }
      );

      if (!res.data?.success || !res.data?.order?.id) {
        toast.error(res.data?.message || 'Failed to initiate payment');
        return;
      }

      const key = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string | undefined;
      if (!key) {
        toast.error('Razorpay key missing');
        return;
      }

      const { id: order_id, amount, currency } = res.data.order;

      const rzp = new (window as any).Razorpay({
        key,
        order_id,
        amount,
        currency,
        name: 'PIX',
        description: 'Order Payment',
        prefill: { name: address.fullName, email: userEmail, contact: address.phone },
        notes: { address: `${address.line1}, ${address.city}` },
        theme: { color: '#000000' },
        handler: async (response) => {
          try {
            await axios.post(
              `${config.api.baseUrl}/order/verifyRazorpay`,
              { 
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id
              },
              { headers: { token } }
            );

            // Always update user profile with checkout information
            try {
              await axios.put(`${config.api.baseUrl}/user/me`, { name: address.fullName, phone: address.phone }, { headers: { token } });
            } catch (_) {
              // non-blocking
            }

            // Always save address to address book (like profile info)
            try {
              const addressPayload = {
                address: {
                  id: String(Date.now()),
                  fullName: address.fullName,
                  phone: address.phone,
                  line1: address.line1,
                  line2: address.line2,
                  city: address.city,
                  state: address.state,
                  postalCode: address.postalCode,
                  country: address.country,
                  isDefault: true,
                },
              };
              await axios.post(`${config.api.baseUrl}/user/addresses`, addressPayload, { headers: { token } });
            } catch (_) {
              // non-blocking
            }

            clearCart();
            navigate('/order-success', { 
              state: { orderId: res.data.orderId } 
            });
          } catch (e) {
            toast.error('Payment verification failed');
          }
        },
        modal: { ondismiss: () => toast.warning('Payment cancelled') }
      });

      rzp.open();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-24">
        <div className="container mx-auto px-16 py-16">
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 
              className="text-black font-normal uppercase text-2xl"
            >
              Checkout
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-600">
              <button 
                onClick={() => navigate('/cart')}
                className="hover:text-black transition-colors"
              >
                Cart
              </button>
              <span>›</span>
              <span className="text-black">Checkout</span>
            </div>
          </div>

          {/* Empty Cart Check */}
          {cartItems.length === 0 ? (
            <div className="text-center py-24">
              <h2 
                className="text-black font-normal mb-4"
                style={{
                  fontSize: '32px',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 400
                }}
              >
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Add some items to your cart before proceeding to checkout.
              </p>
              <Button 
                onClick={() => navigate('/collection')}
                className="bg-black text-white hover:bg-gray-800 px-8 py-3"
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          ) : (
            /* Checkout Content */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Checkout Form */}
              <div>
                <CheckoutForm onSubmit={handleFormSubmit} />
                
                {/* Back to Cart */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleBackToCart}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    ← Back to Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-8 lg:self-start">
                <OrderSummary
                  items={cartItems.map(item => ({
                    id: item.id,
                    imageUrl: item.imageUrl,
                    title: item.name,
                    price: `Rs.${item.price}`,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity
                  }))}
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                />
                
                {/* Submit button full width above security info */}
                <div className="mt-6">
                  <Button form="checkout-form" type="submit" className="w-full h-12 text-lg font-medium bg-black text-white hover:bg-gray-800">
                    COMPLETE PURCHASE
                  </Button>
                </div>

                {/* Security Info */}
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-green-600"
                    >
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg">Processing your order...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
