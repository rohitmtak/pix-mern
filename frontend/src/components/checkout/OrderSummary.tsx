import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  imageUrl: string;
  title: string;
  price: string | number;
  size: string;
  color: string;
  quantity: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: string;
  shipping: string;
  total: string;
  className?: string;
  variant?: 'cart' | 'checkout'; // New prop to differentiate between cart and checkout
}

const OrderSummary = ({
  items,
  subtotal,
  shipping,
  total,
  className,
  variant = 'checkout' // Default to checkout view
}: OrderSummaryProps) => {
  // Helper function to format price consistently
  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return `Rs.${price.toLocaleString()}`;
    }
    // If price is already a string with Rs. or ₹ symbol, return as is
    if (typeof price === 'string' && (price.includes('Rs.') || price.includes('₹'))) {
      return price.replace('₹', 'Rs.');
    }
    // If price is a string without currency prefix, add Rs.
    return `Rs.${price}`;
  };

  // Cart view (simplified)
  if (variant === 'cart') {
    return (
      <div className={cn("p-8 border border-gray-200 bg-gray-50", className)}>
        {/* Cart Header */}
        <div className="text-center mb-6">
          <h2 
            className="text-black font-bold uppercase text-2xl mb-2 font-medium"
          >
            CART
          </h2>
          <p className="text-gray-600 text-xs">
            {items.length} PRODUCT{items.length !== 1 ? 'S' : ''} • {items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'ITEM' : 'ITEMS'}
          </p>
        </div>

        {/* Simple Order Totals */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">SUBTOTAL:</span>
            <span className="text-black font-medium">(INR) {subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">TOTAL:</span>
            <span className="text-black font-medium">(INR) {total}</span>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Apply coupon"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors">
              Apply
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-600 mb-6">
          *Please note: Final shipping charges will be calculated and displayed after you provide your delivery address during checkout.
        </div>
      </div>
    );
  }

  // Checkout view (original detailed design)
  return (
    <div className={cn("bg-gray-50 p-8 border border-gray-200 rounded-lg", className)}>
      <h2 
        className="text-black font-normal uppercase mb-6"
        style={{
          fontSize: '24px',
          fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
          fontWeight: 400,
          color: 'rgba(0,0,0,1)'
        }}
      >
        Order Summary
      </h2>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
            <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-gray-200 rounded">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 
                className="text-black font-normal text-sm truncate"
                style={{
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 400
                }}
              >
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">
                Size: {item.size} | Color: {item.color}
              </p>
              <p className="text-gray-600 text-sm">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p 
                className="text-black font-normal text-sm"
                style={{
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 400
                }}
              >
                {formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="space-y-3 pt-6 border-t border-gray-200">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-black">{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-black">{shipping}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span 
            className="text-black font-medium"
            style={{
              fontSize: '18px',
              fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
              fontWeight: 500
            }}
          >
            Total
          </span>
          <span 
            className="text-black font-medium"
            style={{
              fontSize: '18px',
              fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
              fontWeight: 500
            }}
          >
            {total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
