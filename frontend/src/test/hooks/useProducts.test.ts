import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts } from '@/hooks/useProducts';

// Mock the API functions
vi.mock('@/lib/api', () => ({
  getProducts: vi.fn(),
  getProduct: vi.fn(),
}));

const { getProducts, getProduct } = await import('@/lib/api');

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useProducts hook', () => {
    it('should be defined', () => {
      expect(useProducts).toBeDefined();
    });

    it('should be a function', () => {
      expect(typeof useProducts).toBe('function');
    });

    // Note: Full integration tests would require proper React Query setup
    // This is a basic test to ensure the hook exists and is importable
  });
});
