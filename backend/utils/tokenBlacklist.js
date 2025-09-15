// Simple in-memory token blacklist for basic store
// This is sufficient for small-scale applications

class TokenBlacklist {
  constructor() {
    this.blacklistedTokens = new Set();
  }

  // Add token to blacklist
  addToken(token) {
    this.blacklistedTokens.add(token);
  }

  // Check if token is blacklisted
  isBlacklisted(token) {
    return this.blacklistedTokens.has(token);
  }

  // Remove token from blacklist (for cleanup if needed)
  removeToken(token) {
    this.blacklistedTokens.delete(token);
  }

  // Get blacklist size (for monitoring)
  getSize() {
    return this.blacklistedTokens.size;
  }

  // Clear all blacklisted tokens (for cleanup)
  clear() {
    this.blacklistedTokens.clear();
  }
}

// Create singleton instance
const tokenBlacklist = new TokenBlacklist();

export default tokenBlacklist;
