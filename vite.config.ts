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
      host: '0.0.0.0', // CRITICAL: Must bind to 0.0.0.0 for Docker networking to work
      port: 7860,      // CRITICAL: Standard Hugging Face Space port
      strictPort: true, 
      // Removed 'allowedHosts' as it can cause issues on older Vite versions; 
      // host: 0.0.0.0 is sufficient for this setup.
      cors: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 7860,
    },
    define: {
      // Maps process.env.API_KEY to the environment variable present at runtime
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});