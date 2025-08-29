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

import { showToast, toastMessages } from "@/config/toastConfig";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const cartItems = cartState.items;
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
    console.log('CheckoutPage - Cart items:', cartItems);
    console.log('CheckoutPage - Cart state:', cartState);
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
          
          console.log('🔍 Raw addresses from backend:', userAddresses);
          console.log('🔍 Address IDs from backend:', userAddresses.map(addr => ({ id: addr.id, isDefault: addr.isDefault, name: addr.fullName })));
          
          // Sort addresses: default first, then others, and remove duplicates
          const uniqueAddresses = userAddresses.filter((address, index, self) => 
            index === self.findIndex(addr => addr.id === address.id)
          );
          
          console.log('🔍 After deduplication:', uniqueAddresses.length, 'addresses');
          console.log('🔍 Unique address IDs:', uniqueAddresses.map(addr => ({ id: addr.id, isDefault: addr.isDefault, name: addr.fullName })));
          
          const sortedAddresses = uniqueAddresses.sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;
            return 0;
          });
          
          console.log('🔍 After sorting:', sortedAddresses.length, 'addresses');
          console.log('🔍 Final address order:', sortedAddresses.map(addr => ({ id: addr.id, isDefault: addr.isDefault, name: addr.fullName })));
          
          setAddresses(sortedAddresses);
          
          // If user has addresses, don't show the form by default
          if (sortedAddresses.length > 0) {
            console.log('🏠 User has addresses, setting showAddressForm to false');
            setShowAddressForm(false);
            // Set the default address as selected
            const defaultAddr = sortedAddresses.find(addr => addr.isDefault) || sortedAddresses[0];
            if (defaultAddr) {
              console.log('📍 Setting default address as selected:', defaultAddr.id);
              setSelectedAddressId(defaultAddr.id);
            }
          } else {
            console.log('🏠 No addresses found, setting showAddressForm to true');
            setShowAddressForm(true);
          }
        } else {
          setShowAddressForm(true);
        }
      } catch (error) {
        console.error('Failed to load user addresses:', error);
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
    console.log('🚀 Form submission started');
    console.log('📝 Form data received:', formData);
    console.log('🏠 Addresses:', addresses);
    console.log('🔘 Selected address ID:', selectedAddressId);
    console.log('📋 Show address form:', showAddressForm);
    
    try {
      setIsSubmitting(true);

      // If user has saved addresses and didn't fill the form, use the selected address
      if (addresses.length > 0 && !showAddressForm && selectedAddressId) {
        console.log('🔍 Using saved address logic');
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        console.log('📍 Selected address found:', selectedAddress);
        
        if (selectedAddress) {
          const originalFormData = { ...formData };
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
          console.log('🔄 Form data transformed from saved address:', { original: originalFormData, transformed: formData });
        } else {
          console.warn('⚠️ Selected address not found for ID:', selectedAddressId);
        }
      } else if (addresses.length > 0 && selectedAddressId) {
        // User has saved addresses and one is selected, but form is showing
        // This means they want to use the selected address, not fill the form
        console.log('🔍 Using selected saved address (form was showing but address is selected)');
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        console.log('📍 Selected address found:', selectedAddress);
        
        if (selectedAddress) {
          const originalFormData = { ...formData };
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
          console.log('🔄 Form data transformed from selected saved address:', { original: originalFormData, transformed: formData });
        } else {
          console.warn('⚠️ Selected address not found for ID:', selectedAddressId);
        }
      } else {
        console.log('🔍 Using form input logic (no saved addresses or form is shown)');
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
      console.log('🔍 Validating address fields:', address);
      if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.postalCode) {
        console.error('❌ Address validation failed:', {
          fullName: !!address.fullName,
          phone: !!address.phone,
          line1: !!address.line1,
          city: !!address.city,
          state: !!address.state,
          postalCode: !!address.postalCode
        });
        showToast.error('Please fill in all required address fields.');
        return;
      }
      console.log('✅ Address validation passed');

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
          console.log('User email fetched successfully:', userEmail);
        } else {
          console.warn('User profile response missing email:', userResponse.data);
          // Keep the default fallback
        }
      } catch (error) {
        console.error('Failed to fetch user email from profile:', error);
        // Keep the default fallback
      }
      
      console.log('Final user email for order:', userEmail);

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

      console.log('Sending order payload:', orderPayload);
      console.log('Cart items:', cartItems);
      console.log('Total value:', totalValue);

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
      console.log('🔑 Razorpay key check:', { key: key ? 'Present' : 'Missing' });
      console.log('🌍 Environment variables:', import.meta.env);
      
      if (!key) {
        showToast.error('Razorpay key missing');
        console.error('❌ Razorpay key is missing. Please check VITE_RAZORPAY_KEY_ID in .env file');
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

      console.log('Razorpay Configuration:', razorpayConfig);

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
            showToast.success(toastMessages.cart.cleared);
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
    console.log('🔧 handleAddNewAddress called - setting showAddressForm to true');
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
