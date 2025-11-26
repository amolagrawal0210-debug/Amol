import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  // CRITICAL: Vercel injects variables into process.env.
  // We must prioritize the system process.env.API_KEY over the loaded .env file
  // to ensure variables set in the Vercel Dashboard are picked up during build.
  const apiKey = process.env.API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    base: '/', 
    define: {
      // JSON.stringify is required to inject the value as a string literal into the client code
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});