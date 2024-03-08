import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'



// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.REACT_APP_API_KEY': JSON.stringify(process.env.REACT_APP_API_KEY),
    'process.env.REACT_APP_WS_URL': JSON.stringify(process.env.REACT_APP_WS_URL),
  },
  root: ".",
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

