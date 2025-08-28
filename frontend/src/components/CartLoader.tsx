import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { isAuthenticated } from '@/utils/auth';

const CartLoader: React.FC = () => {
  const { loadUserCartFromBackend } = useCart();

  useEffect(() => {
    // Load user's cart from backend if they're authenticated
    if (isAuthenticated()) {
      loadUserCartFromBackend().catch(error => {
        console.error('Failed to load user cart on app start:', error);
      });
    }
  }, []); // Empty dependency array since loadUserCartFromBackend is now memoized

  return null; // This component doesn't render anything
};

export default CartLoader;
