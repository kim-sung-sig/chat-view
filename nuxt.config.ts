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
    // SSR 전체 비활성화 (SPA 모드) - PWA와 호환
    ssr: false,
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
            wsBase: process.env.NUXT_PUBLIC_WS_BASE || 'ws://localhost:8082'
        }
    },
    app: {
        head: {
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
            title: 'Discode',
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
            id: '/',
            name: 'Discode',
            short_name: 'Discode',
            description: 'A modern Discord clone built with Nuxt 3',
            theme_color: '#5865F2',
            background_color: '#202225',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
            icons: [
                { src: '/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
                { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
            ]
        },
        workbox: {
            // SPA 모드: 모든 네비게이션을 index.html로 fallback
            navigateFallback: '/index.html',
            navigateFallbackDenylist: [
                /^\/api\//,       // API 요청 제외
                /\.(?:png|jpg|jpeg|svg|ico|webp|woff2?)$/  // 정적 파일 제외
            ],
            globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
            cleanupOutdatedCaches: true,
            skipWaiting: true,
            clientsClaim: true,
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/placehold\.co\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'avatar-cache',
                        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
                        cacheableResponse: { statuses: [0, 200] }
                    }
                },
                {
                    // API 요청은 캐시하지 않음 (NetworkOnly)
                    urlPattern: /\/api\/.*/i,
                    handler: 'NetworkOnly'
                }
            ]
        },
        client: {
            installPrompt: true,
            periodicSyncForUpdates: 3600
        },
        devOptions: {
            enabled: false,
            suppressWarnings: true,
            navigateFallbackAllowlist: [/^\//],
            type: 'module'
        }
    }
})
