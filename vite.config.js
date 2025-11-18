import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 메인 페이지
        index: 'index.html',

        // 기능별 페이지
        'bord/main': '/src/pages/main/main.html',
        'bord/post': '/src/pages/post/post.html',
        'bord/search': '/src/pages/search/search.html',
        'bord/writer': '/src/pages/writer/writer.html',
        'bord/login': '/src/pages/login/login.html',
        'bord/signup': '/src/pages/signup/signup.html',
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
});
