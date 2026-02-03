
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 相対パスをベースにすることで、どのディレクトリでも動作するように設定
  base: './',
  define: {
    'process.env': process.env
  }
});
