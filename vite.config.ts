import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Using '.' instead of process.cwd() to avoid TypeScript errors if Node types are not fully loaded.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    base: '/', 
    define: {
      // Maps process.env.API_KEY to the environment variable present at runtime
      // Ensure 'API_KEY' is set in your Vercel Project Settings
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});