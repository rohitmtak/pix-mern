import { describe, it, expect } from '@jest/globals';

describe('Basic Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings', () => {
    expect('hello').toBe('hello');
  });

  it('should handle arrays', () => {
    expect([1, 2, 3]).toHaveLength(3);
  });
});
