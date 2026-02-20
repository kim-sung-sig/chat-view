/**
 * Auth Pinia Store
 * - 토큰 관리, 로그인/로그아웃, 자동 갱신
 */
import { defineStore } from 'pinia'
import type { User } from '~/types'

const ACCESS_TOKEN_KEY = 'access_token'
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null as string | null,
        currentUser: null as User | null,
        isRefreshing: false,
        initialized: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        userId: (state) => state.currentUser?.id ?? null,
    },

    actions: {
        /** 앱 시작 시 저장된 토큰/유저 복원 */
        init() {
            if (typeof localStorage === 'undefined') return
            const token = localStorage.getItem(ACCESS_TOKEN_KEY)
            const userRaw = localStorage.getItem(USER_KEY)
            if (token) this.accessToken = token
            if (userRaw) {
                try { this.currentUser = JSON.parse(userRaw) } catch {}
            }
            this.initialized = true
        },

        /** 토큰 저장 */
        setToken(accessToken: string) {
            this.accessToken = accessToken
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
            }
        },

        /** 유저 정보 저장 */
        setUser(user: User) {
            this.currentUser = user
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(USER_KEY, JSON.stringify(user))
            }
        },

        /** 로그인 처리 */
        async login(identifier: string, password: string) {
            const config = useRuntimeConfig()
            const baseURL = config.public.apiBase

            const response = await $fetch<{
                isAuthenticated: boolean
                token?: { accessToken: string; refreshToken?: string; expiresIn: number }
                requiresMfa?: boolean
                mfaSessionId?: string
                failureReason?: string
            }>(`${baseURL}/api/v1/auth/authenticate`, {
                method: 'POST',
                credentials: 'include',
                body: {
                    identifier,
                    credentialType: 'PASSWORD',
                    credentialData: password,
                },
            })

            if (response.isAuthenticated && response.token?.accessToken) {
                this.setToken(response.token.accessToken)

                // 유저 정보 파싱 (JWT payload에서 추출)
                const user = parseUserFromToken(response.token.accessToken)
                if (user) this.setUser(user)

                return { success: true }
            }

            if (response.requiresMfa) {
                return { success: false, requiresMfa: true, mfaSessionId: response.mfaSessionId }
            }

            return { success: false, reason: response.failureReason || '인증 실패' }
        },

        /** 토큰 갱신 (refresh_token 쿠키 사용) */
        async refreshToken(): Promise<boolean> {
            if (this.isRefreshing) return false
            this.isRefreshing = true

            try {
                const config = useRuntimeConfig()
                const baseURL = config.public.apiBase

                const response = await $fetch<{
                    isAuthenticated: boolean
                    token?: { accessToken: string; expiresIn: number }
                }>(`${baseURL}/api/v1/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                })

                if (response.isAuthenticated && response.token?.accessToken) {
                    this.setToken(response.token.accessToken)
                    return true
                }

                this.logout()
                return false
            } catch {
                this.logout()
                return false
            } finally {
                this.isRefreshing = false
            }
        },

        /** 로그아웃 */
        async logout() {
            try {
                const config = useRuntimeConfig()
                await $fetch(`${config.public.apiBase}/api/v1/auth/logout`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {},
                })
            } catch {}

            this.accessToken = null
            this.currentUser = null
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(ACCESS_TOKEN_KEY)
                localStorage.removeItem(USER_KEY)
            }

            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        },
    },
})

/** JWT payload에서 유저 정보 추출 */
function parseUserFromToken(token: string): User | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return {
            id: payload.sub || payload.userId || '',
            username: payload.nickname || payload.name || payload.preferred_username || payload.sub || '',
            discriminator: '0000',
            status: 'online',
            avatarUrl: payload.picture || payload.avatarUrl || undefined,
            customStatus: undefined,
        }
    } catch {
        return null
    }
}
