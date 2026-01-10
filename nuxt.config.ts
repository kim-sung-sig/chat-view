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
    ],
    app: {
        head: {
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        }
    }
})

