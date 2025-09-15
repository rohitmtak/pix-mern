import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { config } from "@/config/env";
import { showToast, toastMessages } from "@/config/toastConfig";
import { getStateName, getCountryName } from "@/utils/addressUtils";
import { formatCartPrice } from '@/utils/priceUtils';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: cartState, clearCart, removeFromCart } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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
    const originalConsoleWarn = console.warn;
    
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('otp-credentials')) {
        return; // Suppress OTP-credentials messages
      }
      originalConsoleError.apply(console, args);
    };
    
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('otp-credentials')) {
        return; // Suppress OTP-credentials messages
      }
      originalConsoleWarn.apply(console, args);
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
      // Restore original console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Debug cart items
  useEffect(() => {
    // Removed debug console logs
  }, [cartItems, cartState]);

  // Load user addresses on component mount
  useEffect(() => {
    const loadUserAddresses = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingAddresses(true);
        const response = await axios.get(`${config.api.baseUrl}/user/me`);
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
  }, [isAuthenticated]);

  // Calculate totals based on selected cart items
  const calculateTotals = () => {
    const subtotalValue = selectedCartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const subtotal = formatCartPrice(subtotalValue);
    const shipping = "Free";
    const total = formatCartPrice(subtotalValue);
    
    return { subtotal, shipping, total };
  };

  const { subtotal, shipping, total } = calculateTotals();

  // Numeric totals for backend amount field
  const subtotalValue = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalValue = subtotalValue; // Shipping is Free

  const handleFormSubmit = async (formData: any) => {
    
    try {
      setIsSubmitting(true);

      // Validate formData exists
      if (!formData) {
        showToast.error('Form data is missing. Please try again.');
        console.error('formData is undefined');
        return;
      }

      console.log('Form data received - processing checkout');

      // If user has saved addresses and one is selected, and the form is not showing,
      // use the selected address
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
      } else if (addresses.length > 0 && showAddressForm) {
        // User has saved addresses and the form is showing
        // Check if they want to use a selected address or the new form
        if (selectedAddressId && !formData.firstName) {
          // User selected a saved address but didn't fill the form
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
        // If formData.firstName exists, it means they filled the new address form
        // so we'll use that data
      }

      // Validate cart has items
      if (!cartItems || cartItems.length === 0) {
        showToast.error('Your cart is empty. Please add items before checkout.');
        return;
      }

      // Check if user is authenticated
      if (!isAuthenticated) {
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
        country: formData.country || 'India',
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

      // Prepare billing address - Uses feature flag for conditional logic
      let billingAddress = address; // Default to shipping address
      
      // Only process different billing address if feature is enabled
      if (config.features.billingAddress.enabled && 
          formData.payment?.method === 'card' && 
          !formData.payment?.sameAsShipping && 
          formData.payment?.billingAddress) {
        billingAddress = {
          fullName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
          phone: formData.phone,
          line1: formData.payment.billingAddress.address,
          line2: '',
          city: formData.payment.billingAddress.city,
          state: formData.payment.billingAddress.state,
          postalCode: formData.payment.billingAddress.postalCode,
          country: formData.payment.billingAddress.country || 'India',
        };
      }

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
        const userResponse = await axios.get(`${config.api.baseUrl}/user/me`, {
          withCredentials: true
        });
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
        { withCredentials: true }
      );

      if (!res.data?.success || !res.data?.order?.id) {
        showToast.error(res.data?.message || 'Failed to initiate payment');
        return;
      }

      const key = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string | undefined;
      
      if (!key) {
        showToast.error('Razorpay configuration missing. Please check your environment setup.');
        console.error('VITE_RAZORPAY_KEY_ID is not set in environment variables');
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
                razorpay_payment_id: response.razorpay_payment_id,
                orderData: orderPayload // Pass the order data to backend
              },
              { withCredentials: true }
            );

            // Always update user profile with checkout information
            try {
              await axios.put(`${config.api.baseUrl}/user/me`, { name: address.fullName, phone: address.phone }, {
                withCredentials: true
              });
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
                await axios.post(`${config.api.baseUrl}/user/addresses`, addressPayload, {});
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
      console.error('Order creation error:', error);
      
      // Provide more specific error messages
      if (error?.response?.data?.message) {
        showToast.error(error.response.data.message);
      } else if (error?.message) {
        showToast.error(error.message);
      } else {
        showToast.error('Order failed. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for adding a new address
  const handleAddNewAddress = () => {
    setShowAddressForm(true);
  };

  // Handler for saving a new address
  const handleSaveAddress = async (addressData: any) => {
    if (!isAuthenticated) {
      showToast.error('Authentication required. Please log in.');
      return;
    }

    try {
      // Save address to backend
      const response = await axios.post(
        `${config.api.baseUrl}/user/addresses`,
        { address: addressData },
        { withCredentials: true }
      );

      if (response.data?.success) {
        // Add the new address to the local state
        const newAddress = response.data.address || addressData;
        setAddresses(prev => [...prev, newAddress]);
        
        // Set the new address as selected
        setSelectedAddressId(newAddress.id);
        
        // Hide the address form
        setShowAddressForm(false);
        
        showToast.success('Address saved successfully!');
      } else {
        showToast.error('Failed to save address. Please try again.');
      }
    } catch (error: any) {
      console.error('Error saving address:', error);
      showToast.error(error.response?.data?.message || 'Failed to save address. Please try again.');
    }
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
      {/* Show loading screen while checking authentication */}
      {authLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to proceed with checkout.</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <Header />

      {/* Main Content */}
      <main className="pt-24">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
          
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 
              className="text-black font-normal uppercase text-xl sm:text-2xl"
            >
              Checkout
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
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
            <div className="text-center py-12 sm:py-16 lg:py-24">
              <h2 
                className="text-black font-normal mb-4 sm:mb-6"
                style={{
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 400
                }}
              >
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Add some items to your cart before proceeding to checkout.
              </p>
              <Button 
                onClick={() => navigate('/collection')}
                className="bg-black text-white hover:bg-gray-800 px-6 sm:px-8 py-3 text-sm sm:text-base"
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          ) : (
            /* Checkout Content */
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 sm:gap-12 lg:gap-16">
              
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
                    onSaveAddress={handleSaveAddress}
                  />
                )}
                
                {/* Back to Cart */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 hidden sm:block">
                  <Button
                    variant="outline"
                    onClick={handleBackToCart}
                    className="border-gray-300 hover:bg-gray-50 text-sm sm:text-base py-2 sm:py-3"
                  >
                    ← Back to Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <OrderSummary
                  items={selectedCartItems.map(item => ({
                    id: item.id,
                    imageUrl: item.imageUrl,
                    title: item.name,
                    price: formatCartPrice(item.price),
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity
                  }))}
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                />
                
                {/* Submit button full width above security info */}
                <div className="mt-4 sm:mt-6">
                  <Button 
                    onClick={() => {
                      console.log('Checkout button clicked');
                      
                      // Handle form submission based on current state
                      if (addresses.length > 0 && !showAddressForm && selectedAddressId) {
                        // User has saved addresses and one is selected - submit with saved address
                        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
                        if (selectedAddress) {
                                                  const formData = {
                          firstName: selectedAddress.fullName.split(' ')[0] || '',
                          lastName: selectedAddress.fullName.split(' ').slice(1).join(' ') || '',
                          phone: selectedAddress.phone,
                          address: selectedAddress.line1,
                          apartment: selectedAddress.line2 || '',
                          city: selectedAddress.city,
                          state: selectedAddress.state,
                          postalCode: selectedAddress.postalCode,
                          country: selectedAddress.country,
                          payment: { 
                            method: 'upi' as const,
                            sameAsShipping: true,
                            billingAddress: config.features.billingAddress.enabled ? {
                              address: "",
                              city: "",
                              state: "",
                              postalCode: "",
                              country: "India"
                            } : undefined
                          }
                        };
                          handleFormSubmit(formData);
                        }
                      } else {
                        // User is filling out the form - trigger form submission
                        const form = document.getElementById('checkout-form') as HTMLFormElement;
                        if (form) {
                          form.requestSubmit();
                        }
                      }
                    }}
                    disabled={!selectedAddressId && addresses.length > 0 && !showAddressForm}
                    className={`w-full h-10 sm:h-12 text-sm sm:text-lg font-normal ${
                      selectedAddressId || addresses.length === 0 || showAddressForm
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {!selectedAddressId && addresses.length > 0 && !showAddressForm ? 'SELECT ADDRESS TO CONTINUE' : 'COMPLETE PURCHASE'}
                  </Button>
                </div>

                {/* Security Info */}
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
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

      {/* Sticky Complete Purchase Button - Mobile Only */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden z-50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {selectedCartItems.length} {selectedCartItems.length === 1 ? 'item' : 'items'} selected
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-lg font-medium text-black">
                {total}
              </div>
            </div>
          </div>
          <Button 
            onClick={() => {
              console.log('Mobile sticky button clicked - current state:', {
                addressesLength: addresses.length,
                showAddressForm,
                selectedAddressId
              });
              
              // Handle form submission based on current state
              if (addresses.length > 0 && !showAddressForm && selectedAddressId) {
                // User has saved addresses and one is selected - submit with saved address
                const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
                if (selectedAddress) {
                  const formData = {
                    firstName: selectedAddress.fullName.split(' ')[0] || '',
                    lastName: selectedAddress.fullName.split(' ').slice(1).join(' ') || '',
                    phone: selectedAddress.phone,
                    address: selectedAddress.line1,
                    apartment: selectedAddress.line2 || '',
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    postalCode: selectedAddress.postalCode,
                    country: selectedAddress.country,
                    payment: { 
                      method: 'upi' as const,
                      sameAsShipping: true,
                      billingAddress: config.features.billingAddress.enabled ? {
                        address: "",
                        city: "",
                        state: "",
                        postalCode: "",
                        country: "India"
                      } : undefined
                    }
                  };
                  handleFormSubmit(formData);
                }
              } else {
                // User is filling out the form - trigger form submission
                const form = document.getElementById('checkout-form') as HTMLFormElement;
                if (form) {
                  form.requestSubmit();
                }
              }
            }}
            disabled={!selectedAddressId && addresses.length > 0 && !showAddressForm}
            className={`w-full py-4 text-base font-normal ${
              selectedAddressId || addresses.length === 0 || showAddressForm
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!selectedAddressId && addresses.length > 0 && !showAddressForm ? 'SELECT ADDRESS TO CONTINUE' : 'COMPLETE PURCHASE'}
          </Button>
        </div>
      )}

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
        </>
      )}
    </div>
  );
};

export default CheckoutPage;