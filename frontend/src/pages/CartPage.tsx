import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";

// Mock cart data
const mockCartItems = [
  {
    id: "1",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/6714f073aacab712b21f60fbf4e61031c285fc0d?width=841",
    title: "BLUSH PINK EMBROIDERED BANDHGALA SET",
    price: "165000/-",
    size: "S",
    color: "Blush Pink",
    quantity: 2
  }
];

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(mockCartItems);

  // Calculate totals based on cart items
  const calculateTotals = () => {
    const subtotalValue = cartItems.reduce((sum, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      return sum + (price * item.quantity);
    }, 0);
    
    const subtotal = `${subtotalValue.toLocaleString()}/-`;
    const shipping = "Free";
    const tax = `${Math.round(subtotalValue * 0.15).toLocaleString()}/-`;
    const total = `${(subtotalValue + Math.round(subtotalValue * 0.15)).toLocaleString()}/-`;
    
    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/collection");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-36">
        <div className="container mx-auto px-16 py-16">
          
          {/* Page Header */}
          <div className="text-center mb-16">
                         <h1 
               className="text-black font-normal uppercase"
               style={{
                 fontSize: '50px',
                 fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                 fontWeight: 400,
                 lineHeight: '60px',
                 color: 'rgba(0,0,0,1)'
               }}
             >
               CART
             </h1>
            
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
                Add some items to your cart to get started.
              </p>
              <Button 
                onClick={handleContinueShopping}
                className="bg-black text-white hover:bg-gray-800 px-8 py-3"
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          ) : (
            /* Cart Content */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Cart Items */}
              <div>
                                 <div className="space-y-6">
                   {cartItems.map((item) => (
                     <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-6 p-6 bg-gray-50 border border-gray-100">
                       {/* Product Image */}
                       <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-200 rounded">
                         <img
                           src={item.imageUrl}
                           alt={item.title}
                           className="w-full h-full object-cover"
                         />
                       </div>
                       
                       {/* Product Details */}
                       <div className="flex-1 min-w-0">
                         <h3 
                           className="text-black font-normal text-base mb-2"
                           style={{
                             fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                             fontWeight: 400
                           }}
                         >
                           {item.title}
                         </h3>
                         <p className="text-gray-600 text-sm mb-2">
                           Size: {item.size} | Color: {item.color}
                         </p>
                         <p 
                           className="text-black font-normal text-base mb-4"
                           style={{
                             fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                             fontWeight: 400
                           }}
                         >
                           {item.price}
                         </p>
                         
                         {/* Quantity Controls */}
                         <div className="flex items-center gap-4">
                           <div className="flex items-center border border-gray-300 rounded-md">
                             <button
                               onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                               className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
                             >
                               -
                             </button>
                             <span className="px-3 py-1 border-x border-gray-300 bg-white min-w-[2rem] text-center">
                               {item.quantity}
                             </span>
                             <button
                               onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                               className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
                             >
                               +
                             </button>
                           </div>
                           
                           <button
                             onClick={() => handleRemoveItem(item.id)}
                             className="text-red-600 hover:text-red-800 text-sm underline transition-colors"
                           >
                             Remove
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>

                {/* Continue Shopping Button */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleContinueShopping}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    ← Continue Shopping
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-8 lg:self-start">
                                 <OrderSummary
                   items={cartItems}
                   subtotal={subtotal}
                   shipping={shipping}
                   tax={tax}
                   total={total}
                   variant="cart"
                 />
                
                {/* Checkout Button */}
                <div className="mt-6">
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg"
                    style={{
                      fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                      fontWeight: 500
                    }}
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
