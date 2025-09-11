import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        register: 'register.html',
        home: 'home.html',
        recover: 'recover.html'
      }
    }
  },
  css: {
    postcss: './postcss.config.js'
  }
})
