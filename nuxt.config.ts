// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  runtimeConfig: {
    // Private keys (server-side only)
    public: {
      // API URLs
      apiBaseUrl: 'http://localhost:8080',
      messageApiUrl: 'http://localhost:8081',
      systemApiUrl: 'http://localhost:8082',
      websocketUrl: 'ws://localhost:8083/ws/chat',

      // Auth API
      authApiUrl: process.env.NUXT_PUBLIC_AUTH_API_URL || 'http://localhost:8084',

      // OAuth2 Client IDs
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      githubClientId: process.env.NUXT_PUBLIC_GITHUB_CLIENT_ID || '',
      kakaoClientId: process.env.NUXT_PUBLIC_KAKAO_CLIENT_ID || '',
      naverClientId: process.env.NUXT_PUBLIC_NAVER_CLIENT_ID || '',
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

  typescript: {
    strict: true,
    typeCheck: false, // 개발 중에는 false로 설정
  },
})
