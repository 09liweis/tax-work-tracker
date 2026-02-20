// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Tax Work Tracker',
      meta: [
        { name: 'description', content: 'Professional tax work tracking and client management system.' },
        { name: 'author', content: 'Tax Work Tracker Team' },
        { name: 'theme-color', content: '#4F46E5' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})