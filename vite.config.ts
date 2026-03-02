
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_KEY': JSON.stringify('AIzaSyBneHcG4xasVY8RXgTQa6vRHX5EQZoUc2c')
  }
});
