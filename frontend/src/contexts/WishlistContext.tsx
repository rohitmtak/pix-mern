import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
}

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
};

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  console.log('wishlistReducer called with action:', action.type, action);
  console.log('Current state:', state);
  
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      
      if (existingItem) {
        // Item already exists, don't add duplicate
        console.log('Item already exists in wishlist, not adding duplicate');
        return state;
      }

      const newItems = [...state.items, action.payload];
      const newState = {
        ...state,
        items: newItems,
        totalItems: newItems.length,
      };
      console.log('New state after adding:', newState);
      return newState;
    }

    case 'REMOVE_FROM_WISHLIST': {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      return {
        ...state,
        items: newItems,
        totalItems: newItems.length,
      };
    }

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
        totalItems: 0,
      };

    case 'LOAD_WISHLIST': {
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.length,
      };
    }

    default:
      return state;
  }
};

interface WishlistContextType {
  state: WishlistState;
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          console.log('Loading wishlist from localStorage:', parsedWishlist);
          dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
        }
      } else {
        console.log('No saved wishlist found in localStorage');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log('Saving wishlist to localStorage:', state.items);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [state.items]);

  const addToWishlist = (item: Omit<WishlistItem, 'id'>) => {
    console.log('addToWishlist called with:', item);
    const wishlistItem: WishlistItem = {
      ...item,
      id: item.productId,
    };
    console.log('Dispatching ADD_TO_WISHLIST with:', wishlistItem);
    dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
  };

  const removeFromWishlist = (productId: string) => {
    console.log('removeFromWishlist called with:', productId);
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId: string): boolean => {
    const result = state.items.some(item => item.productId === productId);
    console.log(`isInWishlist(${productId}): ${result}`, 'Current items:', state.items.map(item => item.productId));
    return result;
  };

  const value: WishlistContextType = {
    state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
