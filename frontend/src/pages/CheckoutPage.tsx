import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const cartItems = cartState.items;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals based on actual cart items
  const calculateTotals = () => {
    const subtotalValue = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const subtotal = `${subtotalValue.toLocaleString()}/-`;
    const shipping = "Free";
    const tax = `${Math.round(subtotalValue * 0.15).toLocaleString()}/-`;
    const total = `${(subtotalValue + Math.round(subtotalValue * 0.15)).toLocaleString()}/-`;
    
    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would send this data to your backend
    console.log("Order data:", { formData, items: cartItems });
    
    // Redirect to success page
    navigate("/order-success");
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
                  tax={tax}
                  total={total}
                />
                
                {/* Security Info */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
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
