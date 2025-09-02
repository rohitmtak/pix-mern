import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { showToast, toastMessages } from "@/config/toastConfig";

const CartPage = () => {
  const navigate = useNavigate();
  const { state: cartState, updateQuantity, removeFromCart, clearCart } = useCart();
  const cartItems = cartState.items;
  // const isSyncing = cartState.isSyncing;

  // Item selection state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Initialize all items as selected by default when cart changes
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

    const subtotal = `${subtotalValue.toLocaleString()}/-`;
    const shipping = "Free";
    const total = `${subtotalValue.toLocaleString()}/-`;

    return { subtotal, shipping, total };
  };

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
      <main className="pt-24">
        <div className="container mx-auto px-16 py-16">

          {/* Page Header */}
          <div className="text-center mb-16">
            <h1
              className="text-black font-normal uppercase text-2xl"
            >
              CART
            </h1>
            
            {/* Cart Sync Status */}
            {/* {isSyncing && (
              <div className="mt-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                  Syncing cart...
                </span>
              </div>
            )} */}

            {/* Breadcrumb */}
            <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-600">
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
            <div className="text-center py-12">
              <h2
                className="text-black font-normal mb-12"
                style={{
                  fontSize: '32px',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 400
                }}
              >
                Your Shopping Cart Is Empty
              </h2>
              <Button
                onClick={handleContinueShopping}
                className="bg-black text-white hover:bg-gray-800 px-8 py-3"
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          ) : (
            /* Cart Content */
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">

              {/* Cart Items */}
              <div>
                {/* Selection Controls */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
                  <div className="flex items-center gap-4">
                                         <input
                       type="checkbox"
                       checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                       onChange={() => selectedItems.size === cartItems.length ? deselectAllItems() : selectAllItems()}
                       className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer accent-black scale-75"
                     />
                    <span className="text-sm text-gray-700">
                      {selectedItems.size === cartItems.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedItems.size} of {cartItems.length} items selected
                  </div>
                </div>
                
                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const itemId = `${item.productId}-${item.size}-${item.color}`;
                    const isSelected = selectedItems.has(itemId);
                    
                    return (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between p-6 bg-gray-50 border border-gray-100">
                        <div className="flex gap-6">
                          {/* Selection Checkbox */}
                            <div className="flex items-center">
                             <input
                               type="checkbox"
                               checked={isSelected}
                               onChange={() => toggleItemSelection(itemId)}
                               className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer accent-black scale-75"
                             />
                           </div>
                          
                          {/* Product Image */}
                          <div className="w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-200">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-black font-normal text-base mb-1"
                            style={{
                              fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                              fontWeight: 400
                            }}
                          >
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-1">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          {/* <p
                            className="text-black font-normal text-base mb-4"
                            style={{
                              fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                              fontWeight: 400
                            }}
                          >
                            Rs.{item.price}
                          </p> */}

                          {/* Quantity Controls */}
                          <div className="flex flex-col-reverse items-start gap-3">
                            <div className="flex items-center border border-gray-300">
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity - 1)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 border-x border-gray-300 bg-white min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                              className="text-red-600 hover:text-red-800 text-sm underline transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <p
                        className="text-black font-normal text-base mb-4"
                        style={{
                          fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                          fontWeight: 400
                        }}
                      >
                        Rs.{item.price}
                      </p>
                    </div>
                  );
                })}
                </div>

                {/* Cart Actions */}
                <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handleContinueShopping}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    ← Continue Shopping
                  </Button>
                  
                  {cartItems.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleClearAllItems}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Clear All Items
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 lg:self-start">
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
                  variant="cart"
                />

                {/* Checkout Button */}
                <div className="mt-6">
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg font-normal"
                  >
                    CHECKOUT
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CartPage;
