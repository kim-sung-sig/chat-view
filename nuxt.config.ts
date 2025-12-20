// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    // Private keys (server-side only)
    public: {
      // Public keys (client-side)
      apiBaseUrl: 'http://localhost:8080',
      messageApiUrl: 'http://localhost:8081',
      systemApiUrl: 'http://localhost:8082',
      websocketUrl: 'ws://localhost:8083/ws/chat'
    }
  },

  app: {
    head: {
      title: 'Chat Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Real-time Chat Platform' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],
})
