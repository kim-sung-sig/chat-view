// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt',
        '@vite-pwa/nuxt'
    ],
    devtools: { enabled: true },
    typescript: {
        strict: true
    },
    css: [
        '~/assets/css/main.css'
    ],
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
            wsBase: process.env.NUXT_PUBLIC_WS_BASE || 'ws://localhost:8082'
        }
    },
    app: {
        head: {
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
            title: 'Chat Platform',
            meta: [
                { name: 'description', content: 'A modern chat platform built with Nuxt 3' },
                { name: 'theme-color', content: '#5865F2' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'manifest', href: '/manifest.webmanifest' },
                { rel: 'apple-touch-icon', href: '/pwa-192x192.png' },
                { rel: 'mask-icon', href: '/icon.svg', color: '#5865F2' }
            ]
        }
    },
    pwa: {
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'favicon.png', 'icon.svg'],
        manifest: {
<<<<<<< HEAD
            name: 'Chat Platform',
            short_name: 'Chat',
            description: 'A modern chat platform built with Nuxt 3',
=======
            id: '/',
            name: 'Discode',
            short_name: 'Discode',
            description: 'A modern Discord clone built with Nuxt 3',
>>>>>>> ba466b48be5d5ff0e5590d0f68d79212d248765f
            theme_color: '#5865F2',
            background_color: '#202225',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
            icons: [
                {
                    src: '/pwa-64x64.png',
                    sizes: '64x64',
                    type: 'image/png'
                },
                {
                    src: '/pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: '/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/maskable-icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable'
                }
            ]
        },
        workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
            cleanupOutdatedCaches: true,
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-cache',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'gstatic-fonts-cache',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }
            ]
        },
        client: {
            installPrompt: true,
            periodicSyncForUpdates: 3600 // 1 hour
        },
        devOptions: {
            enabled: true,
            suppressWarnings: true,
            navigateFallbackAllowlist: [/^\/$/],
            type: 'module'
        }
    } as any
})
