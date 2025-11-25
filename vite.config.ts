// vite.config.ts (Modified)

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    server: {
      // CRITICAL: Must bind to 0.0.0.0 for Docker container networking to work
      // You already have this set correctly.
      host: '0.0.0.0', 
      port: 7860, // Ensure the port is 7860 for Hugging Face Spaces

      // FIX: Add the specific Hugging Face Space host to allowedHosts
      // This resolves the "Blocked request" error shown in the browser.
      allowedHosts: [
        'amol7896-vocalvibe-india.hf.space'
      ],

      // This is often not strictly needed if 'host' is 0.0.0.0 but is good practice.
      strictPort: true 
    },
    
    // ... rest of your configuration (build, define, etc.)
  };
});
