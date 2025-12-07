// Helper function to ensure HTTPS for production URLs
// This prevents mixed content errors when frontend is served over HTTPS
const ensureHttps = (url: string | undefined): string => {
  if (!url) {
    // If no URL provided, check if we're in production and use HTTPS by default
    if (import.meta.env.PROD) {
      // In production, require explicit backend URL via environment variable
      console.warn('⚠️ VITE_API_BASE_URL not set in production. Please set it in your environment variables.');
      return '/api'; // Fallback to relative path (requires reverse proxy)
    }
    return '/api'; // Development uses Vite proxy
  }
  
  if (url.startsWith('/')) return url; // Already a relative path, use as-is
  
  // In production, always use HTTPS to avoid mixed content errors
  if (import.meta.env.PROD) {
    if (url.startsWith('http://')) {
      // Replace http:// with https:// for production
      return url.replace('http://', 'https://');
    }
    if (!url.startsWith('https://')) {
      // If no protocol, assume HTTPS in production
      return `https://${url}`;
    }
  }
  
  return url;
};

// Environment configuration
// Note: Vite automatically loads:
//   - .env for all environments (local development)
//   - .env.production when building for production (npm run build)
// Environment variables must be prefixed with VITE_ to be exposed to the client
export const config = {
  api: {
    // Development: Uses Vite proxy (/api -> http://localhost:3000)
    // Production: Uses VITE_API_BASE_URL from .env.production (e.g., https://13.204.195.106:4000/api)
    baseUrl: import.meta.env.DEV
      ? '/api'
      : ensureHttps(import.meta.env.VITE_API_BASE_URL),
    timeout: 10000, // 10 seconds
  },
  app: {
    name: 'PIX',
    version: '1.0.0',
  },
  features: {
    // Feature flags for checkout functionality
    billingAddress: {
      enabled: import.meta.env.VITE_ENABLE_BILLING_ADDRESS === 'true' || false,
      description: 'Enable billing address collection for international customers'
    },
    internationalPayments: {
      enabled: import.meta.env.VITE_ENABLE_INTERNATIONAL_PAYMENTS === 'true' || false,
      description: 'Enable international payment processing'
    }
  }
} as const;

// Environment variables
export const env = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: config.api.baseUrl,
} as const;
