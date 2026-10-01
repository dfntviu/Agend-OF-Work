import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

// https://vite.dev/config/  [no mover la configuracion, esta perfecta]
export default defineConfig({
  root: './',
  plugins: [react()],
  resolve:{
     alias:{
      '@': path.resolve(__dirname,'./src'),  //bajarlo al nivel raiz
      /** '@/components': path.resolve(__dirname,'src/components/*'),
      '@/context': path.resolve(__dirname,'src/context/*'),
      '@/lib': path.resolve(__dirname,'src/lib/*'),
      '@/hooks': path.resolve(__dirname,'src/hooks*') **/
     }
  },
  server:{
    port: 5173,
  }
})
