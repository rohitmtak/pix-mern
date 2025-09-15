import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const CartLoader: React.FC = () => {
  const { loadUserCartFromBackend } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Load user's cart from backend if they're authenticated
    if (isAuthenticated) {
      loadUserCartFromBackend().catch(error => {
        console.error('Failed to load user cart on app start:', error);
      });
    }
  }, [isAuthenticated, loadUserCartFromBackend]);

  return null; // This component doesn't render anything
};

export default CartLoader;
