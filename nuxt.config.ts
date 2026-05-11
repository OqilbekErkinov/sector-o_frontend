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
      ],
      link: [
        {
          rel: 'preload',
          href: '/fonts/Gropled-Bold.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    }
  },
  modules: ['@nuxt/image', '@nuxtjs/i18n'],
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
})