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
        refreshPromise: null as Promise<boolean> | null,
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
                try { this.currentUser = JSON.parse(userRaw) } catch { }
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

            try {
                const response = await $fetch<any>(`${baseURL}/api/v1/auth/authenticate`, {
                    method: 'POST',
                    credentials: 'include',
                    body: {
                        identifier,
                        credentialType: 'PASSWORD',
                        credentialData: password,
                    },
                })

                console.log('Login Response:', response) // 디버깅용 로그

                // 백엔드 응답 필드 확인 (authenticated 또는 isAuthenticated 둘 다 체크)
                const isAuthenticated = response.authenticated === true || response.isAuthenticated === true || response.success === true
                const tokenObj = response.token

                console.log('Is Authenticated:', isAuthenticated)
                console.log('Token object:', tokenObj)

                if (isAuthenticated && tokenObj?.accessToken) {
                    console.log('Login successful, setting token...')
                    this.setToken(tokenObj.accessToken)

                    // 유저 정보 파싱 (JWT payload에서 추출)
                    const user = parseUserFromToken(tokenObj.accessToken)
                    console.log('Parsed User:', user)
                    if (user) {
                        this.setUser(user)
                    }

                    return { success: true }
                }

                console.warn('Authentication failed criteria not met')
                if (response.requiresMfa) {
                    return { success: false, requiresMfa: true, mfaSessionId: response.mfaSessionId }
                }

                const failReason = response.failureReason || response.message || '인증 정보는 올바르나 토큰을 받지 못했습니다.'
                return { success: false, reason: failReason }
            } catch (err: any) {
                console.error('Login error:', err)
                return {
                    success: false,
                    reason: err.data?.failureReason || err.data?.message || err.message || '인증 실패'
                }
            }
        },

        /** 토큰 갱신 (refresh_token 쿠키 사용) */
        async refreshToken(): Promise<boolean> {
            // 이미 진행 중인 갱신 요청이 있으면 그 Promise를 반환하여 결과를 공유
            if (this.refreshPromise) {
                console.log('[Auth Store] refreshToken already in progress, sharing promise...')
                return this.refreshPromise
            }

            this.refreshPromise = (async () => {
                this.isRefreshing = true
                console.log('--- Auth Store: Starting refreshToken (with cookies) ---')

                try {
                    const config = useRuntimeConfig()
                    const baseURL = config.public.apiBase

                    const response = await $fetch<any>(`${baseURL}/api/v1/auth/refresh`, {
                        method: 'POST',
                        credentials: 'include',
                    })

                    console.log('Refresh Response:', response)

                    const isAuthenticated = response.authenticated === true || response.isAuthenticated === true || response.success === true
                    const tokenObj = response.token

                    if (isAuthenticated && tokenObj?.accessToken) {
                        console.log('Refresh successful! Updating token...')
                        this.setToken(tokenObj.accessToken)

                        // 유저 정보 파싱
                        const user = parseUserFromToken(tokenObj.accessToken)
                        if (user) {
                            this.setUser(user)
                        }
                        return true
                    }

                    console.warn('Refresh response received but authenticated is false or token missing')
                    this.logout()
                    return false
                } catch (err: any) {
                    console.error('RefreshToken error:', err)
                    // 401 등은 정상적인 세션 만료이므로 로그아웃 처리
                    if (err.status === 401) {
                        this.logout()
                    }
                    return false
                } finally {
                    this.isRefreshing = false
                    this.refreshPromise = null
                    console.log('--- Auth Store: Finished refreshToken ---')
                }
            })()

            return this.refreshPromise
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
            } catch { }

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
