export default defineNuxtConfig({
  compatibilityDate: '2026-01-12',
  devtools: { enabled: true },
  css: [
    "~/assets/css/index.css",
    "~/assets/css/PaymentModal.css",
    "~/assets/css/nutrition.css",
    "~/assets/css/premium-done.css",
    "~/assets/css/profile.css",
    "~/assets/css/exercises-category.css",
    "~/assets/css/exercises-detail.css",
    "~/assets/css/exercises-type.css",
    "~/assets/css/premium.css",
    "~/assets/css/programs.css",
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Sector-O' },
      ],
      link: [
        {
          rel: 'preload',
          href: '/fonts/Gropled-Bold.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-180x180.png' },
        // Production only: with the PWA dev service worker disabled (see
        // `pwa.devOptions` below), nothing serves /manifest.webmanifest under
        // `npm run dev`, so a hardcoded link there just 404s and spams a Vue
        // Router "no match" warning on every page load.
        ...(process.env.NODE_ENV === 'production'
          ? [{ rel: 'manifest', href: '/manifest.webmanifest' }]
          : []),
      ],
    }
  },
  modules: ['@nuxt/image', '@nuxtjs/i18n', '@vite-pwa/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:7000'
    }
  },
  i18n: {
    locales: [
      { code: 'uz', name: "O'zbekcha", file: 'uz.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' }
    ],
    defaultLocale: 'uz',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },
  image: {
    presets: {
      desktop: {
        modifiers: {
          format: 'webp',
          quality: 80,
        },
      },
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Sector-O',
      short_name: 'Sector-O',
      description: "Sector-O — mashqlar, dasturlar va ovqatlanishni kuzatish uchun sport ilovasi",
      theme_color: '#222222',
      background_color: '#222222',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/icons/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
        { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      // Disabled: @vite-pwa/nuxt's dev service worker intermittently fails
      // to emit `.nuxt/dev-sw-dist/sw.js` (notably after a `nuxt build`
      // touches `.nuxt`), and every request for it then throws ENOENT onto
      // the HMR overlay. The SW isn't needed for normal dev work, and an
      // active SW in dev mostly just causes stale-cache confusion. The full
      // PWA still builds for production and is testable with
      // `npm run build && npm run preview`. Set back to `true` only when you
      // specifically need to test install/offline under `npm run dev`.
      enabled: false,
      suppressWarnings: true,
      type: 'module',
    },
  },
})