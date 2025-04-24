// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig( {
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  app: {
    head: {
      title: 'Play Nine Scorekeep',
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/golfball.svg',
        },
      ],
    },
  },
} );