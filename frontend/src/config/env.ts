// Environment configuration
export const config = {
  api: {
    // Use proxy path in development, full URL in production
    baseUrl: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'https://pix-mern.onrender.com/api'),
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
