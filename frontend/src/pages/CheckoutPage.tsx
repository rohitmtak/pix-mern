import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import axios from "axios";
import { config } from "@/config/env";

import { showToast, toastMessages } from "@/config/toastConfig";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: cartState, clearCart, removeFromCart } = useCart();
  const cartItems = cartState.items;
  
  // Get selected items from navigation state, or use all items if none specified
  const selectedItemIds = location.state?.selectedItemIds || [];
  const selectedCartItems = selectedItemIds.length > 0 
    ? cartItems.filter(item => selectedItemIds.includes(`${item.productId}-${item.size}-${item.color}`))
    : cartItems;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Load Razorpay Checkout script once
  useEffect(() => {
    // Suppress OTP-credentials console messages from Razorpay
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('otp-credentials')) {
        return; // Suppress OTP-credentials messages
      }
      originalConsoleError.apply(console, args);
    };

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
      // Restore original console.error
      console.error = originalConsoleError;
    };
  }, []);

  // Debug cart items
  useEffect(() => {
    // Removed debug console logs
  }, [cartItems, cartState]);

  // Load user addresses on component mount
  useEffect(() => {
    const loadUserAddresses = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setLoadingAddresses(true);
        const response = await axios.get(`${config.api.baseUrl}/user/me`, { headers: { token } });
        if (response.data?.success && response.data?.user?.addresses) {
          const userAddresses = response.data.user.addresses;
          
          // Sort addresses: default first, then others, and remove duplicates
          const uniqueAddresses = userAddresses.filter((address, index, self) => 
            index === self.findIndex(addr => addr.id === address.id)
          );
          
          const sortedAddresses = uniqueAddresses.sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;
            return 0;
          });
          
          setAddresses(sortedAddresses);
          
          // If user has addresses, don't show the form by default
          if (sortedAddresses.length > 0) {
            setShowAddressForm(false);
            // Set the default address as selected
            const defaultAddr = sortedAddresses.find(addr => addr.isDefault) || sortedAddresses[0];
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr.id);
            }
          } else {
            setShowAddressForm(true);
          }
        } else {
          setShowAddressForm(true);
        }
      } catch (error) {
        setShowAddressForm(true);
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadUserAddresses();
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

      // If user has saved addresses and didn't fill the form, use the selected address
      if (addresses.length > 0 && !showAddressForm && selectedAddressId) {
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        
        if (selectedAddress) {
          formData = {
            firstName: selectedAddress.fullName.split(' ')[0] || '',
            lastName: selectedAddress.fullName.split(' ').slice(1).join(' ') || '',
            phone: selectedAddress.phone,
            address: selectedAddress.line1,
            apartment: selectedAddress.line2 || '',
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.postalCode,
            country: selectedAddress.country,
            payment: { method: 'card' as const }
          };
        }
      } else if (addresses.length > 0 && selectedAddressId) {
        // User has saved addresses and one is selected, but form is showing
        // This means they want to use the selected address, not fill the form
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        
        if (selectedAddress) {
          formData = {
            firstName: selectedAddress.fullName.split(' ')[0] || '',
            lastName: selectedAddress.fullName.split(' ').slice(1).join(' ') || '',
            phone: selectedAddress.phone,
            address: selectedAddress.line1,
            apartment: selectedAddress.line2 || '',
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.postalCode,
            country: selectedAddress.country,
            payment: { method: 'card' as const }
          };
        }
      }

      // Validate cart has items
      if (!cartItems || cartItems.length === 0) {
        showToast.error('Your cart is empty. Please add items before checkout.');
        return;
      }

      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        showToast.error('Authentication required. Please log in.');
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

      // Validate address fields
      if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.postalCode) {
        showToast.error('Please fill in all required address fields.');
        return;
      }

      const items = selectedCartItems.map(item => ({
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

      // Calculate totals (use the existing calculated values)
      const subtotal = subtotalValue;
      const shipping = 0; // Free shipping
      const total = totalValue; // Use the pre-calculated total

      // Get user email from user profile - this ensures we have the most up-to-date email
      // We fetch it here instead of storing in localStorage for security and accuracy
      // 
      // ISSUE FIXED: Previously, the system was using localStorage.getItem('userEmail') which 
      // always returned null because the login process only stored the token, not the user's email.
      // This caused all orders to show 'user@example.com' as the customer email.
      // 
      // SOLUTION: Fetch the user's actual email from their profile using the /user/me endpoint.
      // This ensures we always have the correct, up-to-date email for the order.
      let userEmail = 'user@example.com'; // Default fallback
      try {
        const userResponse = await axios.get(`${config.api.baseUrl}/user/me`, { headers: { token } });
        if (userResponse.data?.success && userResponse.data?.user?.email) {
          userEmail = userResponse.data.user.email;
        }
      } catch (error) {
        // Keep the default fallback
      }

      // Create Razorpay order on backend with enhanced data
      const orderPayload = { 
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
      };



      const res = await axios.post(
        `${config.api.baseUrl}/order/razorpay`,
        orderPayload,
        { headers: { token } }
      );

      if (!res.data?.success || !res.data?.order?.id) {
        showToast.error(res.data?.message || 'Failed to initiate payment');
        return;
      }

      const key = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string | undefined;
      
      if (!key) {
        showToast.error('Razorpay key missing');
        return;
      }

      const { id: order_id, amount, currency } = res.data.order;

      const razorpayConfig = {
        key,
        order_id,
        amount,
        currency,
        name: 'PIX',
        description: 'Order Payment',
        prefill: { name: address.fullName, email: userEmail, contact: address.phone },
        notes: { address: `${address.line1}, ${address.city}` },
        theme: { color: '#000000' },
        upi: {
          flow: "collect"
        }
      };



      const rzp = new (window as any).Razorpay({
        ...razorpayConfig,
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
              // Check if this address already exists to prevent duplicates
              const existingAddresses = addresses || [];
              const isDuplicate = existingAddresses.some(existingAddr => 
                existingAddr.fullName === address.fullName &&
                existingAddr.phone === address.phone &&
                existingAddr.line1 === address.line1 &&
                existingAddr.line2 === address.line2 &&
                existingAddr.city === address.city &&
                existingAddr.state === address.state &&
                existingAddr.postalCode === address.postalCode &&
                existingAddr.country === address.country
              );

              // Only save if it's not a duplicate
              if (!isDuplicate) {
                const addressPayload = {
                  address: {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
                    fullName: address.fullName,
                    phone: address.phone,
                    line1: address.line1,
                    line2: address.line2,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country,
                    isDefault: addresses.length === 0, // Only set as default if no addresses exist
                  },
                };
                await axios.post(`${config.api.baseUrl}/user/addresses`, addressPayload, { headers: { token } });
              } else {
                console.log('Address not saved - already exists in address book');
              }
            } catch (_) {
              // non-blocking
            }

            // Don't remove items from frontend cart - let backend handle it
            // The backend will clear the cart after successful payment verification
            
            navigate('/order-success', { 
              state: { orderId: res.data.orderId } 
            });
          } catch (e) {
            showToast.error('Payment verification failed');
          }
        },
        modal: { ondismiss: () => showToast.warning('Payment cancelled') }
      });

      rzp.open();
    } catch (error: any) {
      showToast.error(error?.response?.data?.message || 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for adding a new address
  const handleAddNewAddress = () => {
    setShowAddressForm(true);
  };

  // Listen for address selection event
  useEffect(() => {
    const handleAddressSelected = (event: CustomEvent) => {
      const { addressId } = event.detail;
      setSelectedAddressId(addressId);
    };

    window.addEventListener('address-selected', handleAddressSelected as EventListener);
    
    return () => {
      window.removeEventListener('address-selected', handleAddressSelected as EventListener);
    };
  }, []);

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
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16">
              
              {/* Checkout Form */}
              <div>
                {loadingAddresses ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading addresses...</p>
                  </div>
                ) : (
                  <CheckoutForm 
                    onSubmit={handleFormSubmit}
                    addresses={addresses}
                    onAddNewAddress={handleAddNewAddress}
                    showAddressForm={showAddressForm}
                    onToggleAddressForm={() => setShowAddressForm(!showAddressForm)}
                    selectedAddressId={selectedAddressId}
                  />
                )}
                
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
                  items={selectedCartItems.map(item => ({
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
                  <Button 
                    form="checkout-form" 
                    type="submit" 
                    disabled={!selectedAddressId && addresses.length > 0}
                    className={`w-full h-12 text-lg font-normal ${
                      selectedAddressId || addresses.length === 0 
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {!selectedAddressId && addresses.length > 0 ? 'SELECT ADDRESS TO CONTINUE' : 'COMPLETE PURCHASE'}
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
