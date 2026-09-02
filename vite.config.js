import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Explicitly tell Vite only to use index.html as the entry point
  // (prevents it from scanning broken backup HTML files in the root)
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  optimizeDeps: {
    // Force-include the new packages so they are pre-bundled correctly
    include: ['motion/react', 'clsx', 'tailwind-merge', '@react-three/fiber'],
  },
  server: {
    port: 5500,
    host: true,
  },
});
