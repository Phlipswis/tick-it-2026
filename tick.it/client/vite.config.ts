import { defineConfig } from 'vite';

export default defineConfig({
    base: process.env.NODE_ENV === 'production' 
    ? '/tick-it' 
    : '/',

  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    
    // Alle HTML-Dateien als Entry-Points
    rollupOptions: {
      input: {
        main: 'index.html',
        impressum: 'impressum.html',
      },
    },
  },
  
  // Public-Ordner für statische Assets
  publicDir: 'public',
});