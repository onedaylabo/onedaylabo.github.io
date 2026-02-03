
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 指定されたサブディレクトリ・パスを設定
  base: '/web-app/today-canvas/',
  define: {
    // ビルド時に環境変数を埋め込む
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
