// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-16',
  devServer: {
    port: 3000
  },
  modules: [
    '@vite-pwa/nuxt'
  ],
  // @ts-ignore
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'My Nuxt PWA',
      short_name: 'NuxtPWA',
      description: 'My awesome Nuxt PWA application',
      theme_color: '#00dc82',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          purpose: 'any',
          sizes: '192x192',
          src: '/icons/icon-192x192.png',
          type: 'image/png'
        },
        {
          purpose: 'maskable',
          sizes: '192x192',
          src: '/icons/icon-192x192.png',
          type: 'image/png'
        },
        {
          purpose: 'any',
          sizes: '512x512',
          src: '/icons/icon-512x512.png',
          type: 'image/png'
        },
        {
          purpose: 'maskable',
          sizes: '512x512',
          src: '/icons/icon-512x512.png',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
