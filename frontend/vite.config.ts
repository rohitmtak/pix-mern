import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        configure: (proxy, _options) => {
          // Only log errors - keep console clean during normal operation
          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy error:', err.message);
            console.error('💡 Make sure the backend server is running on http://localhost:3000');
            if (res && !res.headersSent) {
              res.writeHead(503, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({
                success: false,
                message: 'Backend server is not running. Please start the backend server on port 3000.',
                error: 'ECONNREFUSED'
              }));
            }
          });
        },
      },
    },
  },
  // @ts-ignore - Vitest config (test property is added by vitest plugin)
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
