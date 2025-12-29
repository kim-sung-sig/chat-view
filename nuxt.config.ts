// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt'
    ],
    devtools: { enabled: true },
    typescript: {
        strict: true
    },
    css: [
        '~/assets/css/main.css'
    ]
})
