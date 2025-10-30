import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// import fs from 'fs'
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // server: {
  //   host: true, // LAN IP erişimi
  //   https:{
  //           key: fs.readFileSync(path.resolve('C:/cert/localhost+1-key.pem')),
  //     cert: fs.readFileSync(path.resolve('C:/cert/localhost+1.pem')),
  //   }
  // }
});
