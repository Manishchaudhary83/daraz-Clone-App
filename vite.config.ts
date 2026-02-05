
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the use of process.env in the client-side code 
    // It maps them from the host's (Vercel/Netlify) environment variables
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.WEB3FORMS_KEY': JSON.stringify(process.env.WEB3FORMS_KEY || "1a71b1ec-b87b-41d3-8299-d5ef870fe108"),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
