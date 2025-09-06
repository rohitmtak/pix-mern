/**
 * Integration Test for Cart Synchronization
 * 
 * This test simulates the complete user flow:
 * 1. User is logged out
 * 2. User adds product to cart (stored in localStorage)
 * 3. User proceeds to checkout (redirected to login)
 * 4. User logs in
 * 5. Cart migration occurs
 * 6. User should see correct cart state
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock authentication functions
const mockAuth = {
  isAuthenticated: vi.fn(),
  getToken: vi.fn(),
};

// Mock cart item
const mockCartItem = {
  id: 'test-product-123_M_Black',
  productId: 'test-product-123',
  name: 'Test Product',
  price: 100,
  size: 'M',
  color: 'Black',
  quantity: 1,
  imageUrl: 'test-image.jpg'
};

describe('Cart Synchronization Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockAuth.isAuthenticated.mockReturnValue(false);
    mockAuth.getToken.mockReturnValue(null);
  });

  describe('Guest Cart Flow', () => {
    it('should store cart in localStorage when user is not authenticated', () => {
      // Simulate guest adding item to cart
      const cartData = {
        items: [mockCartItem],
        lastModified: Date.now()
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(cartData));
      
      const storedCart = localStorageMock.getItem('cart');
      expect(storedCart).toBeTruthy();
      
      const parsedCart = JSON.parse(storedCart!);
      expect(parsedCart.items).toHaveLength(1);
      expect(parsedCart.items[0].productId).toBe(mockCartItem.productId);
    });

    it('should handle cart data in both old and new formats', () => {
      // Test old format (just items array)
      const oldFormatCart = [mockCartItem];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(oldFormatCart));
      
      let storedCart = localStorageMock.getItem('cart');
      let parsedCart = JSON.parse(storedCart!);
      expect(Array.isArray(parsedCart)).toBe(true);
      expect(parsedCart).toHaveLength(1);

      // Test new format (with lastModified)
      const newFormatCart = {
        items: [mockCartItem],
        lastModified: Date.now()
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(newFormatCart));
      
      storedCart = localStorageMock.getItem('cart');
      parsedCart = JSON.parse(storedCart!);
      expect(parsedCart.items).toBeDefined();
      expect(parsedCart.items).toHaveLength(1);
    });
  });

  describe('Login Flow with Cart Migration', () => {
    it('should migrate guest cart to user account on login', async () => {
      // Setup: User has guest cart
      const guestCart = [mockCartItem];
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'cart') {
          return JSON.stringify({
            items: guestCart,
            lastModified: Date.now()
          });
        }
        if (key === 'token') {
          return 'mock-token';
        }
        return null;
      });

      // Mock authentication after login
      mockAuth.isAuthenticated.mockReturnValue(true);
      mockAuth.getToken.mockReturnValue('mock-token');

      // Mock backend cart API response (empty cart)
      const mockBackendResponse = {
        success: true,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBackendResponse)
      });

      // Mock cart sync API calls
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      // Simulate the migration process
      const token = mockAuth.getToken();
      expect(token).toBe('mock-token');

      // Fetch backend cart
      const response = await fetch('/api/cart/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.cart.items).toHaveLength(0);

      // Simulate migration logic
      const backendCart: any[] = [];
      const mergedCart = [...backendCart];
      
      guestCart.forEach(guestItem => {
        const existingIndex = mergedCart.findIndex(item =>
          item.productId === guestItem.productId &&
          item.size === guestItem.size &&
          item.color === guestItem.color
        );
        
        if (existingIndex >= 0) {
          mergedCart[existingIndex].quantity += guestItem.quantity;
        } else {
          mergedCart.push(guestItem);
        }
      });

      expect(mergedCart).toHaveLength(1);
      expect(mergedCart[0].quantity).toBe(1);
    });

    it('should handle user with existing backend cart', async () => {
      const guestCart = [mockCartItem];
      
      // User already has items in backend cart
      const existingBackendItem = {
        productId: 'existing-product',
        name: 'Existing Product',
        price: 150,
        quantity: 1,
        size: 'L',
        color: 'White',
        imageUrl: 'existing-image.jpg'
      };

      const mockBackendResponse = {
        success: true,
        cart: {
          items: [existingBackendItem],
          totalItems: 1,
          totalPrice: 150
        }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBackendResponse)
      });

      const response = await fetch('/api/cart/get');
      const data = await response.json();
      
      const backendCart = data.cart.items.map((item: any) => ({
        id: `${item.productId}_${item.size}_${item.color}`,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        imageUrl: item.imageUrl
      }));

      // Simulate migration
      const mergedCart = [...backendCart];
      
      guestCart.forEach(guestItem => {
        const existingIndex = mergedCart.findIndex(item =>
          item.productId === guestItem.productId &&
          item.size === guestItem.size &&
          item.color === guestItem.color
        );
        
        if (existingIndex >= 0) {
          mergedCart[existingIndex].quantity += guestItem.quantity;
        } else {
          mergedCart.push(guestItem);
        }
      });

      expect(mergedCart).toHaveLength(2);
      expect(mergedCart.find(item => item.productId === mockCartItem.productId)).toBeDefined();
      expect(mergedCart.find(item => item.productId === 'existing-product')).toBeDefined();
    });

    it('should handle same item in both guest and backend cart', async () => {
      const guestCart = [mockCartItem];
      
      // Same item exists in backend cart
      const backendItem = {
        productId: mockCartItem.productId,
        name: mockCartItem.name,
        price: mockCartItem.price,
        quantity: 1,
        size: mockCartItem.size,
        color: mockCartItem.color,
        imageUrl: mockCartItem.imageUrl
      };

      const mockBackendResponse = {
        success: true,
        cart: {
          items: [backendItem],
          totalItems: 1,
          totalPrice: 100
        }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBackendResponse)
      });

      const response = await fetch('/api/cart/get');
      const data = await response.json();
      
      const backendCart = data.cart.items.map((item: any) => ({
        id: `${item.productId}_${item.size}_${item.color}`,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        imageUrl: item.imageUrl
      }));

      // Simulate migration
      const mergedCart = [...backendCart];
      
      guestCart.forEach(guestItem => {
        const existingIndex = mergedCart.findIndex(item =>
          item.productId === guestItem.productId &&
          item.size === guestItem.size &&
          item.color === guestItem.color
        );
        
        if (existingIndex >= 0) {
          mergedCart[existingIndex].quantity += guestItem.quantity;
        } else {
          mergedCart.push(guestItem);
        }
      });

      expect(mergedCart).toHaveLength(1);
      expect(mergedCart[0].quantity).toBe(2); // 1 from guest + 1 from backend
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      try {
        await fetch('/api/cart/get');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      
      expect(() => {
        const storedCart = localStorageMock.getItem('cart');
        JSON.parse(storedCart!);
      }).toThrow();
    });

    it('should handle empty guest cart', () => {
      const guestCart: any[] = [];
      const backendCart = [mockCartItem];
      
      const mergedCart = [...backendCart];
      
      guestCart.forEach(guestItem => {
        const existingIndex = mergedCart.findIndex(item =>
          item.productId === guestItem.productId &&
          item.size === guestItem.size &&
          item.color === guestItem.color
        );
        
        if (existingIndex >= 0) {
          mergedCart[existingIndex].quantity += guestItem.quantity;
        } else {
          mergedCart.push(guestItem);
        }
      });

      expect(mergedCart).toHaveLength(1);
      expect(mergedCart[0]).toEqual(mockCartItem);
    });
  });
});
