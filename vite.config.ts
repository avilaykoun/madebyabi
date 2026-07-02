import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Set base to './' so the build works whether hosted at a domain root
// (Netlify/Vercel) or in a subpath (GitHub Pages project page).
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.jpg'],
      manifest: {
        name: 'Made by Abi',
        short_name: 'Made by Abi',
        description: 'Brown butter cookie recipes to follow hands-free while you bake.',
        theme_color: '#7b4a2d',
        background_color: '#fff8f0',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: 'icons/icon-512.jpg', sizes: '512x512', type: 'image/jpeg' },
          {
            src: 'icons/icon-512-maskable.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,woff2}'],
      },
    }),
  ],
})
