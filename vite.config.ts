import {defineConfig} from "vite";
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        // Creating separate chunk for locales so they
        // can be cached at runtime and not merged with
        // app precache
        manualChunks(id) {
          if (id.includes("src/locales")) {
            const index = id.indexOf("locales/");
            // Taking the substring after "locales/"
            return `locales/${id.substring(index + 8)}`;
          }
        },
      },
    },
    sourcemap: true,
  },
  plugins: [VitePWA({
    devOptions: {
      /* set this flag to true to enable in Development mode */
      enabled: false,
    },
    mode: 'development',
    includeManifestIcons: false,
    workbox: {
      globPatterns: ["**/*.{js,html,png,ico}"],
      // Don't push fonts and locales to app precache
      globIgnores: ["fonts.css", "assets/locales/**", "*.{ttf,woff2,otf}"],
      //navigateFallbackDenylist: [/\.(ttf|woff2|otf)$/, /^\/fonts\.css$/, /^\/assets\/locales\//],
      runtimeCaching: [
        {
          urlPattern: /\.(ttf|woff2|otf)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "fonts",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 90, // <== 90 days
            },
            cacheableResponse: {
              statuses: [200],
            }
          },
        },
        {
          urlPattern: ({ sameOrigin, url }) => {
            console.log(sameOrigin, url)
            return sameOrigin && url.pathname === "/fonts.css"
          },
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "fonts-css",
            expiration: {
              maxEntries: 50,
            },
            cacheableResponse: {
              statuses: [200],
            },
          },
        },
        {
          urlPattern: ({ sameOrigin, url }) => {
            console.log(sameOrigin, url)
            return sameOrigin && url.pathname.startsWith("/assets/locales/")
          },
          handler: "CacheFirst",
          options: {
            cacheName: "locales",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30, // <== 30 days
            },
            cacheableResponse: {
              statuses: [200],
            },
          },
        },
      ],
    },
    manifest: {
      short_name: "Excalidraw",
      name: "Excalidraw",
      description:
          "Excalidraw is a whiteboard tool that lets you easily sketch diagrams that have a hand-drawn feel to them.",
      icons: [
        {
          src: "logo-180x180.png",
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: "apple-touch-icon.png",
          type: "image/png",
          sizes: "256x256",
        },
      ],
      start_url: "/",
      display: "standalone",
      theme_color: "#121212",
      background_color: "#ffffff",
      file_handlers: [
        {
          action: "/",
          accept: {
            "application/vnd.excalidraw+json": [".excalidraw"],
          },
        },
      ],
      share_target: {
        action: "/web-share-target",
        method: "POST",
        enctype: "multipart/form-data",
        params: {
          files: [
            {
              name: "file",
              accept: [
                "application/vnd.excalidraw+json",
                "application/json",
                ".excalidraw",
              ],
            },
          ],
        },
      },
      screenshots: [
        {
          src: "/screenshots/virtual-whiteboard.png",
          type: "image/png",
          sizes: "462x945",
        },
        {
          src: "/screenshots/wireframe.png",
          type: "image/png",
          sizes: "462x945",
        },
        {
          src: "/screenshots/illustration.png",
          type: "image/png",
          sizes: "462x945",
        },
        {
          src: "/screenshots/shapes.png",
          type: "image/png",
          sizes: "462x945",
        },
        {
          src: "/screenshots/collaboration.png",
          type: "image/png",
          sizes: "462x945",
        },
        {
          src: "/screenshots/export.png",
          type: "image/png",
          sizes: "462x945",
        },
      ],
    },
  })]
})
