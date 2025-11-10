import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 메인 페이지
        index: 'index.html'
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
});