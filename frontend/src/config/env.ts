// Environment configuration
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
    timeout: 10000, // 10 seconds
  },
  app: {
    name: 'PIX',
    version: '1.0.0',
  },
} as const;

// Environment variables
export const env = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.DEV ? '/api' : config.api.baseUrl,
} as const;
