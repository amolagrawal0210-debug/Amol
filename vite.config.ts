import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // This allows access to system environment variables (like configured in HF Spaces)
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    base: './', 
    server: {
      host: '0.0.0.0', // Required for Docker/Hugging Face
      port: 7860,      // Standard Hugging Face Space port
      strictPort: true,
      allowedHosts: true, // Allow incoming connections from HF domains
    },
    preview: {
      host: '0.0.0.0',
      port: 7860,
      allowedHosts: true,
    },
    define: {
      // Maps process.env.API_KEY to the environment variable present at runtime/build-time
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});