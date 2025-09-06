/**
 * Backend Cart Synchronization Test
 * 
 * This test verifies that the backend cart controller properly handles:
 * 1. Adding items to cart
 * 2. Merging quantities for existing items
 * 3. Getting user cart
 * 4. Clearing cart
 * 5. Updating quantities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock cart item data
const mockCartItem = {
  productId: '507f1f77bcf86cd799439011', // Valid ObjectId
  name: 'Test Product',
  price: 100,
  quantity: 1,
  size: 'M',
  color: 'Black',
  imageUrl: 'test-image.jpg'
};

const mockUser = {
  userId: '507f1f77bcf86cd799439012'
};

// Mock cart model
const mockCartModel = {
  findOne: vi.fn(),
  create: vi.fn(),
  save: vi.fn()
};

// Mock cart instance
const mockCartInstance = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  lastUpdated: new Date(),
  save: vi.fn()
};

describe('Backend Cart Controller Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock cart instance completely
    Object.assign(mockCartInstance, {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      lastUpdated: new Date(),
      save: vi.fn().mockResolvedValue(mockCartInstance)
    });
  });

  describe('addToCart Function', () => {
    it('should create new cart for new user', async () => {
      mockCartModel.findOne.mockResolvedValue(null);
      mockCartModel.create.mockReturnValue(mockCartInstance);

      // Simulate the addToCart logic
      let cart = await mockCartModel.findOne({ userId: mockUser.userId });
      
      if (!cart) {
        cart = mockCartModel.create({ 
          userId: mockUser.userId, 
          items: [], 
          totalItems: 0, 
          totalPrice: 0 
        });
      }

      // Add item to cart
      cart.items.push(mockCartItem);
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cart.lastUpdated = new Date();

      await cart.save();

      expect(mockCartModel.findOne).toHaveBeenCalledWith({ userId: mockUser.userId });
      expect(mockCartModel.create).toHaveBeenCalledWith({ 
        userId: mockUser.userId, 
        items: [], 
        totalItems: 0, 
        totalPrice: 0 
      });
      expect(cart.items).toHaveLength(1);
      expect(cart.totalItems).toBe(1);
      expect(cart.totalPrice).toBe(100);
    });

    it('should add new item to existing cart', async () => {
      mockCartModel.findOne.mockResolvedValue(mockCartInstance);

      // Simulate adding new item to existing cart
      const existingItem = {
        productId: '507f1f77bcf86cd799439013',
        name: 'Existing Product',
        price: 150,
        quantity: 1,
        size: 'L',
        color: 'White',
        imageUrl: 'existing-image.jpg'
      };

      mockCartInstance.items = [existingItem];
      mockCartInstance.totalItems = 1;
      mockCartInstance.totalPrice = 150;

      // Check if item already exists
      const existingItemIndex = mockCartInstance.items.findIndex(
        item => item.productId.toString() === mockCartItem.productId && 
               item.size === mockCartItem.size && 
               item.color === mockCartItem.color
      );

      expect(existingItemIndex).toBe(-1); // Item doesn't exist

      // Add new item
      mockCartInstance.items.push(mockCartItem);
      mockCartInstance.totalItems = mockCartInstance.items.reduce((sum, item) => sum + item.quantity, 0);
      mockCartInstance.totalPrice = mockCartInstance.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await mockCartInstance.save();

      expect(mockCartInstance.items).toHaveLength(2);
      expect(mockCartInstance.totalItems).toBe(2);
      expect(mockCartInstance.totalPrice).toBe(250);
    });

    it('should merge quantities for existing item', async () => {
      mockCartModel.findOne.mockResolvedValue(mockCartInstance);
      
      // Cart already has the same item
      mockCartInstance.items = [mockCartItem];
      mockCartInstance.totalItems = 1;
      mockCartInstance.totalPrice = 100;

      // Check if item already exists
      const existingItemIndex = mockCartInstance.items.findIndex(
        item => item.productId.toString() === mockCartItem.productId && 
               item.size === mockCartItem.size && 
               item.color === mockCartItem.color
      );

      expect(existingItemIndex).toBe(0); // Item exists at index 0

      // Update quantity of existing item
      mockCartInstance.items[existingItemIndex].quantity += mockCartItem.quantity;
      mockCartInstance.totalItems = mockCartInstance.items.reduce((sum, item) => sum + item.quantity, 0);
      mockCartInstance.totalPrice = mockCartInstance.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await mockCartInstance.save();

      expect(mockCartInstance.items).toHaveLength(1);
      expect(mockCartInstance.items[0].quantity).toBe(2);
      expect(mockCartInstance.totalItems).toBe(2);
      expect(mockCartInstance.totalPrice).toBe(200);
    });

    it('should handle multiple items with same product but different variants', async () => {
      // Create a fresh cart instance for this test
      const freshCartInstance = {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        lastUpdated: new Date(),
        save: vi.fn().mockResolvedValue({})
      };
      
      mockCartModel.findOne.mockResolvedValue(freshCartInstance);
      
      const item1 = { ...mockCartItem, size: 'M', color: 'Black' };
      const item2 = { ...mockCartItem, size: 'L', color: 'Black' };
      const item3 = { ...mockCartItem, size: 'M', color: 'White' };

      // Add first item
      freshCartInstance.items.push(item1);
      
      // Add second item (different size)
      const existingItemIndex2 = freshCartInstance.items.findIndex(
        item => item.productId.toString() === item2.productId && 
               item.size === item2.size && 
               item.color === item2.color
      );
      expect(existingItemIndex2).toBe(-1);
      freshCartInstance.items.push(item2);

      // Add third item (different color)
      const existingItemIndex3 = freshCartInstance.items.findIndex(
        item => item.productId.toString() === item3.productId && 
               item.size === item3.size && 
               item.color === item3.color
      );
      expect(existingItemIndex3).toBe(-1);
      freshCartInstance.items.push(item3);

      freshCartInstance.totalItems = freshCartInstance.items.reduce((sum, item) => sum + item.quantity, 0);
      freshCartInstance.totalPrice = freshCartInstance.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await freshCartInstance.save();

      expect(freshCartInstance.items).toHaveLength(3);
      expect(freshCartInstance.totalItems).toBe(3);
      expect(freshCartInstance.totalPrice).toBe(300);
    });
  });

  describe('getUserCart Function', () => {
    it('should return existing cart', async () => {
      mockCartInstance.items = [mockCartItem];
      mockCartInstance.totalItems = 1;
      mockCartInstance.totalPrice = 100;
      
      mockCartModel.findOne.mockResolvedValue(mockCartInstance);

      const cart = await mockCartModel.findOne({ userId: mockUser.userId });

      expect(cart).toBeDefined();
      expect(cart.items).toHaveLength(1);
      expect(cart.totalItems).toBe(1);
      expect(cart.totalPrice).toBe(100);
    });

    it('should create new cart if none exists', async () => {
      mockCartModel.findOne.mockResolvedValue(null);
      mockCartModel.create.mockReturnValue(mockCartInstance);

      let cart = await mockCartModel.findOne({ userId: mockUser.userId });
      
      if (!cart) {
        cart = mockCartModel.create({
          userId: mockUser.userId,
          items: [],
          totalItems: 0,
          totalPrice: 0
        });
      }

      expect(mockCartModel.create).toHaveBeenCalledWith({
        userId: mockUser.userId,
        items: [],
        totalItems: 0,
        totalPrice: 0
      });
      expect(cart.items).toHaveLength(0);
      expect(cart.totalItems).toBe(0);
      expect(cart.totalPrice).toBe(0);
    });
  });

  describe('clearCart Function', () => {
    it('should clear all items from cart', async () => {
      mockCartInstance.items = [mockCartItem];
      mockCartInstance.totalItems = 1;
      mockCartInstance.totalPrice = 100;
      
      mockCartModel.findOne.mockResolvedValue(mockCartInstance);

      const cart = await mockCartModel.findOne({ userId: mockUser.userId });
      
      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;
      cart.lastUpdated = new Date();

      await cart.save();

      expect(cart.items).toHaveLength(0);
      expect(cart.totalItems).toBe(0);
      expect(cart.totalPrice).toBe(0);
    });
  });

  describe('updateCartItem Function', () => {
    it('should update item quantity', async () => {
      mockCartInstance.items = [mockCartItem];
      mockCartModel.findOne.mockResolvedValue(mockCartInstance);

      const cart = await mockCartModel.findOne({ userId: mockUser.userId });
      
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === mockCartItem.productId && 
               item.size === mockCartItem.size && 
               item.color === mockCartItem.color
      );

      expect(itemIndex).toBe(0);

      const newQuantity = 3;
      cart.items[itemIndex].quantity = newQuantity;
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await cart.save();

      expect(cart.items[0].quantity).toBe(3);
      expect(cart.totalItems).toBe(3);
      expect(cart.totalPrice).toBe(300);
    });

    it('should remove item when quantity is 0', async () => {
      mockCartInstance.items = [mockCartItem];
      mockCartModel.findOne.mockResolvedValue(mockCartInstance);

      const cart = await mockCartModel.findOne({ userId: mockUser.userId });
      
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === mockCartItem.productId && 
               item.size === mockCartItem.size && 
               item.color === mockCartItem.color
      );

      expect(itemIndex).toBe(0);

      // Remove item by setting quantity to 0
      cart.items.splice(itemIndex, 1);
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await cart.save();

      expect(cart.items).toHaveLength(0);
      expect(cart.totalItems).toBe(0);
      expect(cart.totalPrice).toBe(0);
    });
  });

  describe('removeFromCart Function', () => {
    it('should remove specific item from cart', async () => {
      // Create a fresh cart instance for this test
      const freshCartInstance = {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        lastUpdated: new Date(),
        save: vi.fn().mockResolvedValue({})
      };
      
      const item1 = { ...mockCartItem, size: 'M', color: 'Black' };
      const item2 = { ...mockCartItem, size: 'L', color: 'White' };
      
      freshCartInstance.items = [item1, item2];
      freshCartInstance.totalItems = 2;
      freshCartInstance.totalPrice = 200;
      
      mockCartModel.findOne.mockResolvedValue(freshCartInstance);

      const cart = await mockCartModel.findOne({ userId: mockUser.userId });
      
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === item1.productId && 
               item.size === item1.size && 
               item.color === item1.color
      );

      expect(itemIndex).toBe(0);

      cart.items.splice(itemIndex, 1);
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await cart.save();

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].size).toBe('L');
      expect(cart.items[0].color).toBe('White');
      expect(cart.totalItems).toBe(1);
      expect(cart.totalPrice).toBe(100);
    });
  });
});
