import { isAuthenticated } from './auth';
import { config } from '@/config/env';

/**
 * Syncs the current cart with the backend if user is authenticated
 */
export const syncCartWithBackend = async (cartItems: any[]): Promise<void> => {
  if (!isAuthenticated() || cartItems.length === 0) return;
  
  try {
    // Convert cart items to backend format
    const cartData: Record<string, Record<string, number>> = {};
    
    cartItems.forEach(item => {
      const colorSizeKey = `${item.color}_${item.size}`;
      if (!cartData[item.productId]) {
        cartData[item.productId] = {};
      }
      cartData[item.productId][colorSizeKey] = item.quantity;
    });

    // Send to backend
    await fetch(`${config.api.baseUrl}/cart/update-entire`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ cartData })
    });
  } catch (error) {
    console.error('Failed to sync cart with backend:', error);
  }
};

/**
 * Loads user cart from backend and merges with local cart
 */
export const loadUserCartFromBackend = async (): Promise<any[]> => {
  if (!isAuthenticated()) return [];
  
  try {
    const response = await fetch(`${config.api.baseUrl}/cart/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        // Return the backend cart data
        // Note: This returns the raw backend format
        // The CartContext will handle the conversion
        return data.data;
      }
    }
  } catch (error) {
    console.error('Failed to load cart from backend:', error);
  }
  
  return [];
};

/**
 * Clears user cart on backend
 */
export const clearUserCartOnBackend = async (): Promise<void> => {
  if (!isAuthenticated()) return;
  
  try {
    await fetch(`${config.api.baseUrl}/cart/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
  } catch (error) {
    console.error('Failed to clear cart on backend:', error);
  }
};

/**
 * Migrates guest cart to authenticated user
 */
export const migrateGuestCartToUser = async (
  guestCart: any[], 
  userCart: any[]
): Promise<any[]> => {
  if (!isAuthenticated() || guestCart.length === 0) return userCart;
  
  try {
    // Merge guest cart with existing user cart
    const mergedCart = [...userCart];
    
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
    
    return mergedCart;
  } catch (error) {
    console.error('Failed to migrate guest cart:', error);
    return userCart;
  }
};
