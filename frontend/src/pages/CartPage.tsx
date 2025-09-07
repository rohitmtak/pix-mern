import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { showToast, toastMessages } from "@/config/toastConfig";
import { formatCartPrice } from '@/utils/priceUtils';

const CartPage = () => {
  const navigate = useNavigate();
  const { state: cartState, updateQuantity, removeFromCart, clearCart } = useCart();
  const cartItems = cartState.items;

  // Item selection state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Initialize with no items selected by default - user has full control
  useEffect(() => {
    const allItemIds = cartItems.map(item => `${item.productId}-${item.size}-${item.color}`);
    setSelectedItems(new Set(allItemIds));
  }, [cartItems]);

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  // Select all items
  const selectAllItems = () => {
    const allItemIds = cartItems.map(item => `${item.productId}-${item.size}-${item.color}`);
    setSelectedItems(new Set(allItemIds));
  };

  // Deselect all items
  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  // Get selected cart items
  const selectedCartItems = cartItems.filter(item => 
    selectedItems.has(`${item.productId}-${item.size}-${item.color}`)
  );

  // Calculate totals based on selected items only
  const calculateTotals = (items: any[]) => {
    const subtotalValue = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const subtotal = formatCartPrice(subtotalValue);
    const shipping = "Free";
    const total = formatCartPrice(subtotalValue);

    return { subtotal, shipping, total };
  };

  // Recalculate totals whenever selectedCartItems changes
  const { subtotal, shipping, total } = calculateTotals(selectedCartItems);

  const handleQuantityChange = (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Find the item to get its name for the toast message
    const item = cartItems.find(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    );
    
    updateQuantity(productId, size, color, newQuantity);
    
    // Show toast notification for quantity update
    if (item) {
      showToast.success(toastMessages.cart.updated);
    }
  };

  const handleRemoveItem = (productId: string, size: string, color: string) => {
    // Find the item to get its name for the toast message
    const item = cartItems.find(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    );
    
    removeFromCart(productId, size, color);
    
    // Show toast notification
    if (item) {
      showToast.success(toastMessages.cart.removed);
    }
  };

  const handleProceedToCheckout = () => {
    // Check if any items are selected
    if (selectedItems.size === 0) {
      showToast.error('Please select at least one item to checkout');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    
    if (!token) {
      // User is not logged in, redirect to login page
      showToast.error(toastMessages.cart.loginRequired);
      navigate("/login");
      return;
    }
    
    // User is authenticated, proceed to checkout with selected items
    navigate("/checkout", { 
      state: { selectedItemIds: Array.from(selectedItems) }
    });
  };

  const handleContinueShopping = () => {
    navigate("/collection");
  };



  const handleClearAllItems = () => {
    clearCart();
    setSelectedItems(new Set());
    showToast.success(toastMessages.cart.cleared);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-24 pb-24 sm:pb-0">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">

          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1
              className="text-black font-normal uppercase text-xl sm:text-2xl"
            >
              CART
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
              <button
                onClick={() => navigate('/collection')}
                className="hover:text-black transition-colors"
              >
                Collection
              </button>
              <span>›</span>
              <span className="text-black">Cart</span>
            </div>
          </div>

          {/* Empty Cart Check */}
          {cartItems.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <h2
                className="text-black font-normal mb-8 sm:mb-12"
                style={{
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 400
                }}
              >
                Your Shopping Cart Is Empty
              </h2>
              <Button
                onClick={handleContinueShopping}
                className="bg-black text-white hover:bg-gray-800 px-6 sm:px-8 py-3 text-sm sm:text-base"
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          ) : (
            /* Cart Content */
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 sm:gap-12 lg:gap-16">

              {/* Cart Items */}
              <div>
                {/* Selection Controls - Desktop Only */}
                <div className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6 p-3 sm:p-4 bg-[#f2f2f2] border border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                      onChange={() => selectedItems.size === cartItems.length ? deselectAllItems() : selectAllItems()}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black cursor-pointer accent-black scale-75"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">
                      {selectedItems.size === cartItems.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {selectedItems.size} of {cartItems.length} items selected
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {cartItems.map((item) => {
                    const itemId = `${item.productId}-${item.size}-${item.color}`;
                    const isSelected = selectedItems.has(itemId);
                    
                    return (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        {/* Mobile Layout */}
                        <div className="block sm:hidden p-4">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 min-w-0">
                                  <h3
                                    className="text-black font-medium text-sm mb-1 truncate"
                                    style={{
                                      fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                                      fontWeight: 500
                                    }}
                                  >
                                    {item.name}
                                  </h3>
                                  <p className="text-gray-600 text-xs">
                                    Color: {item.color}
                                  </p>
                                  <p className="text-gray-600 text-xs">
                                    Size: {item.size}
                                  </p>
                                </div>
                                
                                {/* Price */}
                                <div className="text-right">
                                  <p
                                    className="text-black font-medium text-sm"
                                    style={{
                                      fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                                      fontWeight: 500
                                    }}
                                  >
                                    {formatCartPrice(item.price)}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Controls Row */}
                              <div className="flex items-center justify-between">
                                {/* Quantity Controls */}
                                <div className="flex items-center border border-gray-300">
                                  <button
                                    onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity - 1)}
                                    className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black text-sm"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 border-x border-gray-300 bg-white min-w-[2rem] text-center text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity + 1)}
                                    className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black text-sm"
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Delete Button */}
                                <button
                                  onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center justify-between p-4 lg:p-6">
                          <div className="flex items-center gap-4 lg:gap-6 flex-1">
                            {/* Selection Checkbox */}
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleItemSelection(itemId)}
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer accent-black"
                              />
                            </div>
                            
                            {/* Product Image */}
                            <div className="w-20 h-24 lg:w-24 lg:h-28 flex-shrink-0 overflow-hidden bg-gray-100">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3
                                className="text-black font-medium text-sm lg:text-base mb-1"
                                style={{
                                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                                  fontWeight: 500
                                }}
                              >
                                {item.name}
                              </h3>
                              <p className="text-gray-600 text-xs lg:text-sm mb-1">
                                Color: {item.color}
                              </p>
                              <p className="text-gray-600 text-xs lg:text-sm">
                                Size: {item.size}
                              </p>
                            </div>
                          </div>
                          
                          {/* Right Side - Quantity, Price, Delete */}
                          <div className="flex items-center gap-4 lg:gap-6">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300">
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity - 1)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black text-sm"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 border-x border-gray-300 bg-white min-w-[2rem] text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black text-sm"
                              >
                                +
                              </button>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right min-w-[80px]">
                              <p
                                className="text-black font-medium text-sm lg:text-base"
                                style={{
                                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                                  fontWeight: 500
                                }}
                              >
                                {formatCartPrice(item.price)}
                              </p>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cart Actions - Desktop Only */}
                <div className="hidden sm:flex mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={handleContinueShopping}
                    className="border-gray-300 hover:bg-gray-50 text-sm sm:text-base py-2 sm:py-3"
                  >
                    ← Continue Shopping
                  </Button>
                  
                  {cartItems.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleClearAllItems}
                      className="border-gray-300 hover:bg-gray-50 text-sm sm:text-base py-2 sm:py-3"
                    >
                      Clear All Items
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <OrderSummary
                  key={`order-summary-${selectedItems.size}-${selectedCartItems.length}`}
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
                  variant="cart"
                />

                {/* Checkout Button - Desktop */}
                <div className="hidden sm:block mt-4 sm:mt-6">
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-black text-white hover:bg-gray-800 py-3 sm:py-4 text-base sm:text-lg font-normal"
                  >
                    CHECKOUT
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Checkout Button - Mobile Only */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden z-50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-lg font-medium text-black">
                {formatCartPrice(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
              </div>
            </div>
          </div>
          <Button
            onClick={handleProceedToCheckout}
            className="w-full bg-black text-white hover:bg-gray-800 py-4 text-base font-normal"
          >
            CHECKOUT
          </Button>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CartPage;
