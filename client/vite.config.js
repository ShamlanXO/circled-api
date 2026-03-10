import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import { version } from './package.json'

// https://vitejs.dev/config/

import fs from 'fs/promises';

export default defineConfig(({ command }) => {
  const isDevelopment = command === 'serve';
  
  return {
    plugins: [
      react(),
      // Only enable PWA in production to avoid interference with hot reload
      !isDevelopment &&  VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          "name": "Your mobile Fitness tool",
          "short_name": "Circled beta",
          "display": "standalone",
          "start_url": "/",
          "theme_color": "#000000",
          "background_color": "#ffffff",
          "version": version,
          "id": `/circled-${version}`,
          icons: [
            {
              "src": "favicon/android-chrome-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "favicon/android-chrome-512x512.png",
              "sizes": "512x512",
              "type": "image/png"
            }
          ]
        },
        workbox: {
         
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            // API caching
            {
              urlPattern: /^https:\/\/api\./i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            // Static assets caching (images, fonts, icons, etc.)
            {
              urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico|bmp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-images',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(woff|woff2|eot|ttf|otf)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-fonts',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(css|js)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-media',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ].filter(Boolean),
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
      hmr: {
        overlay: true,
        port: 24678,
      },
      watch: {
        usePolling: false,
        interval: 100,
      },
    },
    resolve: {
      alias: {
        'src': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      loader: "tsx",
      include: /src\/.*\.[tj]sx?$/,
      exclude: [],
    },
    define: {
      // This is needed for crypto polyfill
      global: 'globalThis',
    },
    optimizeDeps: {
      esbuildOptions: {
      
        define: {
          global: 'globalThis',
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Core React runtime — always loads first, tiny and cacheable forever
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-core';
            }
            // MUI — large but stable, cache it separately
            if (id.includes('node_modules/@mui/')) {
              return 'mui';
            }
            // Redux ecosystem
            if (id.includes('node_modules/redux') || id.includes('node_modules/react-redux') ||
                id.includes('node_modules/@reduxjs/') || id.includes('node_modules/redux-persist')) {
              return 'redux';
            }
            // Charting libraries — only used on dashboard
            if (id.includes('node_modules/apexcharts') || id.includes('node_modules/react-apexcharts') ||
                id.includes('node_modules/recharts')) {
              return 'charts';
            }
            // Stripe — only used on payment pages
            if (id.includes('node_modules/@stripe/') || id.includes('node_modules/stripe')) {
              return 'stripe';
            }
            // Date/time utilities
            if (id.includes('node_modules/date-fns') || id.includes('node_modules/moment')) {
              return 'datetime';
            }
            // Lodash — tree-shakeable but still bundle together
            if (id.includes('node_modules/lodash')) {
              return 'lodash';
            }
            // Mapping / geo — only used on map pages
            if (id.includes('node_modules/mapbox') || id.includes('node_modules/deck.gl') ||
                id.includes('node_modules/react-map-gl') || id.includes('node_modules/@turf/')) {
              return 'maps';
            }
            // Media / player
            if (id.includes('node_modules/react-player') || id.includes('node_modules/react-audio-player')) {
              return 'media-player';
            }
            // Everything else from node_modules goes into a shared vendor chunk
            if (id.includes('node_modules/')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
