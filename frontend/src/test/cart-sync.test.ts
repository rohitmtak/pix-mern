import { describe, it, expect, beforeEach } from 'vitest';

// Mock CartItem interface
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  imageUrl: string;
}

// Mock data for testing
const mockProduct: Omit<CartItem, 'id'> = {
  productId: 'test-product-123',
  name: 'Test Product',
  price: 100,
  size: 'M',
  color: 'Black',
  quantity: 1,
  imageUrl: 'test-image.jpg'
};

// Simulate the cart migration logic from CartContext
class CartMigrationTester {
  private mockBackendCart: CartItem[] = [];

  // Simulate fetching backend cart
  async fetchBackendCart(): Promise<CartItem[]> {
    return [...this.mockBackendCart];
  }

  // Simulate the migration logic (copied from CartContext.tsx)
  async migrateGuestCartToUser(guestCart: CartItem[]): Promise<CartItem[]> {
    if (guestCart.length === 0) return this.mockBackendCart;

    // Get backend cart (simulated)
    const backendCart = await this.fetchBackendCart();
    
    // Merge guest cart with backend cart
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
    
    return mergedCart;
  }

  // Set up test scenario
  setupScenario(backendCart: CartItem[]) {
    this.mockBackendCart = [...backendCart];
  }
}

describe('Cart Synchronization Tests', () => {
  let tester: CartMigrationTester;

  beforeEach(() => {
    tester = new CartMigrationTester();
  });

  describe('Basic Migration Scenarios', () => {
    it('should migrate guest cart with 1 item to empty backend cart', async () => {
      const guestCart: CartItem[] = [{
        ...mockProduct,
        id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
      }];
      
      tester.setupScenario([]); // Empty backend cart
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe(mockProduct.productId);
      expect(result[0].quantity).toBe(1);
    });

    it('should merge guest cart with existing backend cart', async () => {
      const guestCart: CartItem[] = [{
        ...mockProduct,
        id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
      }];
      
      const backendCart: CartItem[] = [{
        ...mockProduct,
        productId: 'different-product-456',
        name: 'Different Product',
        id: 'different-product-456_M_Black'
      }];
      
      tester.setupScenario(backendCart);
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      expect(result).toHaveLength(2);
      expect(result.find(item => item.productId === mockProduct.productId)).toBeDefined();
      expect(result.find(item => item.productId === 'different-product-456')).toBeDefined();
    });

    it('should merge quantities when same item exists in both carts', async () => {
      const guestCart: CartItem[] = [{
        ...mockProduct,
        id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
      }];
      
      const backendCart: CartItem[] = [{
        ...mockProduct,
        id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
      }];
      
      tester.setupScenario(backendCart);
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(2); // 1 from guest + 1 from backend
    });

    it('should handle empty guest cart', async () => {
      const guestCart: CartItem[] = [];
      
      const backendCart: CartItem[] = [{
        ...mockProduct,
        id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
      }];
      
      tester.setupScenario(backendCart);
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe(mockProduct.productId);
    });

    it('should handle multiple items in guest cart', async () => {
      const guestCart: CartItem[] = [
        {
          ...mockProduct,
          id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
        },
        {
          ...mockProduct,
          productId: 'product-2',
          name: 'Product 2',
          size: 'L',
          id: 'product-2_L_Black'
        }
      ];
      
      tester.setupScenario([]); // Empty backend cart
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      expect(result).toHaveLength(2);
      expect(result.find(item => item.productId === mockProduct.productId)).toBeDefined();
      expect(result.find(item => item.productId === 'product-2')).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle different sizes of same product', async () => {
      const guestCart: CartItem[] = [
        {
          ...mockProduct,
          id: `${mockProduct.productId}_M_${mockProduct.color}`
        },
        {
          ...mockProduct,
          size: 'L',
          id: `${mockProduct.productId}_L_${mockProduct.color}`
        }
      ];
      
      tester.setupScenario([]);
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      expect(result).toHaveLength(2);
      expect(result.find(item => item.size === 'M')).toBeDefined();
      expect(result.find(item => item.size === 'L')).toBeDefined();
    });

    it('should handle different colors of same product', async () => {
      const guestCart: CartItem[] = [
        {
          ...mockProduct,
          id: `${mockProduct.productId}_${mockProduct.size}_Black`
        },
        {
          ...mockProduct,
          color: 'White',
          id: `${mockProduct.productId}_${mockProduct.size}_White`
        }
      ];
      
      tester.setupScenario([]);
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      expect(result).toHaveLength(2);
      expect(result.find(item => item.color === 'Black')).toBeDefined();
      expect(result.find(item => item.color === 'White')).toBeDefined();
    });

    it('should handle duplicate items in guest cart', async () => {
      const guestCart: CartItem[] = [
        {
          ...mockProduct,
          id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
        },
        {
          ...mockProduct,
          id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
        }
      ];
      
      tester.setupScenario([]);
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(2); // Should merge duplicates
    });

    it('should handle complex merging scenario', async () => {
      const guestCart: CartItem[] = [
        {
          ...mockProduct,
          id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
        },
        {
          ...mockProduct,
          productId: 'product-2',
          name: 'Product 2',
          id: 'product-2_M_Black'
        }
      ];
      
      const backendCart: CartItem[] = [
        {
          ...mockProduct,
          id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
        },
        {
          ...mockProduct,
          productId: 'product-3',
          name: 'Product 3',
          id: 'product-3_M_Black'
        }
      ];
      
      tester.setupScenario(backendCart);
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      expect(result).toHaveLength(3);
      
      // Check that the same product has merged quantities
      const sameProduct = result.find(item => item.productId === mockProduct.productId);
      expect(sameProduct?.quantity).toBe(2);
      
      // Check that different products are preserved
      expect(result.find(item => item.productId === 'product-2')).toBeDefined();
      expect(result.find(item => item.productId === 'product-3')).toBeDefined();
    });
  });

  describe('Real-world Scenario', () => {
    it('should handle the exact bug scenario: guest adds 1 item, logs in, should have 1 item', async () => {
      // This is the exact scenario from the bug report
      const guestCart: CartItem[] = [{
        ...mockProduct,
        id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
      }];
      
      // User has no existing cart in backend (new user or empty cart)
      tester.setupScenario([]);
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      // Should have exactly 1 item, not 2
      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(1);
      expect(result[0].productId).toBe(mockProduct.productId);
    });

    it('should handle existing user with items in backend cart', async () => {
      const guestCart: CartItem[] = [{
        ...mockProduct,
        id: `${mockProduct.productId}_${mockProduct.size}_${mockProduct.color}`
      }];
      
      // User already has items in backend cart
      const backendCart: CartItem[] = [{
        ...mockProduct,
        productId: 'existing-product',
        name: 'Existing Product',
        id: 'existing-product_M_Black'
      }];
      
      tester.setupScenario(backendCart);
      
      const result = await tester.migrateGuestCartToUser(guestCart);
      
      // Should have 2 different items
      expect(result).toHaveLength(2);
      expect(result.find(item => item.productId === mockProduct.productId)).toBeDefined();
      expect(result.find(item => item.productId === 'existing-product')).toBeDefined();
    });
  });
});
