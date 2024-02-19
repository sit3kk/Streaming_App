import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'



// https://vitejs.dev/config/
export default defineConfig({
  root: "./react-vite-app",
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
        secure: false,
      },
    },
  },
  plugins: [react()]
});
