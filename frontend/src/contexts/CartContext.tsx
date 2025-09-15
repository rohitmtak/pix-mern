import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useState } from 'react';
import { getToken } from '@/utils/auth';
import { useAuth } from './AuthContext';
import { config } from '@/config/env';
import apiClient from '@/utils/apiClient';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  lastModified: number; // Added for debouncing
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; size: string; color: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; color: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  lastModified: 0, // Initialize lastModified
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
        lastModified: Date.now(), // Update lastModified
      };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(
        item =>
          !(item.productId === action.payload.productId &&
            item.size === action.payload.size &&
            item.color === action.payload.color)
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
        lastModified: Date.now(), // Update lastModified
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.productId === action.payload.productId &&
        item.size === action.payload.size &&
        item.color === action.payload.color
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0); // Remove items with quantity 0

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
        lastModified: Date.now(), // Update lastModified
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        lastModified: Date.now(), // Update lastModified
      };

    case 'LOAD_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        lastModified: Date.now(), // Update lastModified
      };
    }

    default:
      return state;
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (productId: string, size: string, color: string) => Promise<void>;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string, size: string, color: string) => boolean;
  getItemQuantity: (productId: string, size: string, color: string) => number;
  syncCartWithBackend: () => Promise<void>;
  loadUserCartFromBackend: (forceLoad?: boolean) => Promise<void>;
  migrateGuestCartToUser: (guestCart: CartItem[]) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [lastLoadTime, setLastLoadTime] = useState(0);
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Handle both old format (just items array) and new format (with lastModified)
        if (Array.isArray(parsedCart)) {
          // Old format - just items array
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        } else if (parsedCart.items && Array.isArray(parsedCart.items)) {
          // New format - with lastModified timestamp
          dispatch({ type: 'LOAD_CART', payload: parsedCart.items });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      lastModified: state.lastModified
    }));
  }, [state.items, state.lastModified]);

  // Note: Removed automatic sync to prevent infinite loops
  // Cart is now synced only when explicitly calling syncCartWithBackend

  // Function to sync cart with backend
  const syncCartWithBackend = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      // Clear the backend cart first to avoid duplicates
      await apiClient.delete(`${config.api.baseUrl}/cart/clear`);

      // Send each cart item to backend
      for (const item of state.items) {
        await apiClient.post(`${config.api.baseUrl}/cart/add`, {
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          imageUrl: item.imageUrl
        });
      }
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
    }
  }, [state.items]);

  // Function to load user cart from backend
  const loadUserCartFromBackend = useCallback(async (forceLoad = false) => {
    if (!isAuthenticated) return;
    
    // Debounce: prevent loading from backend too frequently (unless forced)
    const now = Date.now();
    const timeSinceLastLoad = now - lastLoadTime;
    const minLoadInterval = 2 * 1000; // 2 seconds minimum between loads
    
    if (!forceLoad && timeSinceLastLoad < minLoadInterval) {
      return;
    }
    
    try {
      const response = await apiClient.get(`${config.api.baseUrl}/cart/get`);

      if (response.status === 200) {
        const data = response.data;
        if (data.success && data.cart && data.cart.items) {
          // Convert backend cart format to frontend format
          const cartItems: CartItem[] = data.cart.items.map((item: any) => ({
            id: `${item.productId}_${item.size}_${item.color}`,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            imageUrl: item.imageUrl
          }));
          
          // Only load backend cart if frontend cart is empty, if frontend hasn't been modified recently,
          // or if this is a forced load (e.g., after order completion)
          const timeSinceLastModification = now - state.lastModified;
          const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
          
          if (forceLoad || state.items.length === 0 || timeSinceLastModification > fiveMinutes) {
            dispatch({ type: 'LOAD_CART', payload: cartItems });
            setLastLoadTime(now);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load cart from backend:', error);
    }
  }, [isAuthenticated, state.items.length, state.lastModified, lastLoadTime]);

  // Function to migrate guest cart to authenticated user
  const migrateGuestCartToUser = useCallback(async (guestCart: CartItem[]) => {
    if (!isAuthenticated || guestCart.length === 0) return;
    
    try {
      // First, get the user's existing backend cart
      const response = await apiClient.get(`${config.api.baseUrl}/cart/get`);

      let backendCart: CartItem[] = [];
      if (response.status === 200) {
        const data = response.data;
        if (data.success && data.cart && data.cart.items) {
          // Convert backend cart format to frontend format
          backendCart = data.cart.items.map((item: any) => ({
            id: `${item.productId}_${item.size}_${item.color}`,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            imageUrl: item.imageUrl
          }));
        }
      }

      // Merge guest cart with backend cart (not frontend state)
      const mergedCart = [...backendCart];
      
      guestCart.forEach(guestItem => {
        const existingIndex = mergedCart.findIndex(item =>
          item.productId === guestItem.productId &&
          item.size === guestItem.size &&
          item.color === guestItem.color
        );
        
        if (existingIndex >= 0) {
          // Merge quantities
          mergedCart[existingIndex].quantity += guestItem.quantity;
        } else {
          // Add new item
          mergedCart.push(guestItem);
        }
      });
      
      // Update frontend state with merged cart
      dispatch({ type: 'LOAD_CART', payload: mergedCart });
      
      // Sync merged cart to backend
      await syncCartWithBackend();
      
    } catch (error) {
      console.error('Failed to migrate guest cart:', error);
    }
  }, [isAuthenticated]);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    const cartItem: CartItem = {
      ...item,
      id: `${item.productId}_${item.size}_${item.color}`,
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    
    // If user is authenticated, sync with backend
    if (isAuthenticated) {
      try {
        await apiClient.post(`${config.api.baseUrl}/cart/add`, {
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          imageUrl: item.imageUrl
        });
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
      }
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, size, color } });
    
    // If user is authenticated, sync with backend
    if (isAuthenticated) {
      try {
        const response = await apiClient.delete(`${config.api.baseUrl}/cart/remove`, {
          data: { productId, size, color }
        });

        // Check if the response indicates success
        if (!response.data.success) {
          // Item not found in backend cart - this is expected when frontend removes an item
          // that wasn't in the backend or was already removed
          console.log('Item not found in backend cart (expected for frontend removals)');
        }
      } catch (error) {
        console.error('Backend cart removal failed:', error);
        // Don't revert frontend change - let it stay removed locally
      }
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, color, quantity } });
    
    // If user is authenticated, sync with backend
    if (isAuthenticated) {
      try {
        await apiClient.put(`${config.api.baseUrl}/cart/update`, {
          productId,
          size,
          color,
          quantity
        });
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    
    // If user is authenticated, sync with backend
    if (isAuthenticated) {
      try {
        await apiClient.delete(`${config.api.baseUrl}/cart/clear`);
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
        // Don't revert frontend change - let it stay cleared locally
      }
    }
  };

  const isInCart = (productId: string, size: string, color: string): boolean => {
    return state.items.some(
      item =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );
  };

  const getItemQuantity = (productId: string, size: string, color: string): number => {
    const item = state.items.find(
      item =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    syncCartWithBackend,
    loadUserCartFromBackend,
    migrateGuestCartToUser,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
