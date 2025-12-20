/**
 * 인증 상태 관리 Store
 */

import { defineStore } from 'pinia'
import { getAuthService } from '~/services/auth/AuthService'
import type {
  AuthState,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  OAuth2Provider,
  OAuth2LoginRequest,
  MFAVerifyRequest,
  MFAMethod,
} from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  // ============================================
  // State
  // ============================================
  state: (): AuthState => ({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    user: null,
    expiresAt: null,
    requireMFA: false,
    mfaMethods: [],
  }),

  // ============================================
  // Getters
  // ============================================
  getters: {
    /**
     * 현재 사용자
     */
    currentUser: (state): AuthUser | null => state.user,

    /**
     * 로그인 여부
     */
    isLoggedIn: (state): boolean => state.isAuthenticated,

    /**
     * 토큰 만료 여부
     */
    isTokenExpired: (state): boolean => {
      if (!state.expiresAt) return true
      return Date.now() >= state.expiresAt
    },

    /**
     * MFA 필요 여부
     */
    needsMFA: (state): boolean => state.requireMFA,
  },

  // ============================================
  // Actions
  // ============================================
  actions: {
    /**
     * ID/Password 로그인
     */
    async loginWithPassword(credentials: LoginRequest): Promise<void> {
      try {
        const authService = getAuthService()
        const response = await authService.loginWithPassword(credentials)

        // MFA 필요 여부 확인
        if (response.requireMFA) {
          this.requireMFA = true
          this.mfaMethods = response.mfaMethods || []
          this.user = response.user as AuthUser
          return
        }

        // 인증 성공
        this.setAuthData(response)
      } catch (error: any) {
        this.clearAuth()
        throw error
      }
    },

    /**
     * 회원가입
     */
    async register(data: RegisterRequest): Promise<void> {
      try {
        const authService = getAuthService()
        const response = await authService.register(data)
        this.setAuthData(response)
      } catch (error: any) {
        throw error
      }
    },

    /**
     * OAuth2 로그인
     */
    async loginWithOAuth2(credentials: OAuth2LoginRequest): Promise<void> {
      try {
        const authService = getAuthService()
        const response = await authService.loginWithOAuth2(credentials)
        this.setAuthData(response)
      } catch (error: any) {
        this.clearAuth()
        throw error
      }
    },

    /**
     * OAuth2 로그인 URL 가져오기
     */
    getOAuth2Url(provider: OAuth2Provider): string {
      const authService = getAuthService()
      const redirectUri = `${window.location.origin}/auth/callback/${provider}`
      return authService.getOAuth2Url(provider, redirectUri)
    },

    /**
     * MFA 검증
     */
    async verifyMFA(request: MFAVerifyRequest): Promise<void> {
      try {
        const authService = getAuthService()
        const response = await authService.verifyMFA(request)
        this.setAuthData(response)
        this.requireMFA = false
        this.mfaMethods = []
      } catch (error: any) {
        throw error
      }
    },

    /**
     * MFA 설정
     */
    async setupMFA(method: MFAMethod): Promise<{ secret: string; qrCode?: string }> {
      if (!this.user) throw new Error('User not authenticated')

      const authService = getAuthService()
      return authService.setupMFA(this.user.userId, method)
    },

    /**
     * MFA 비활성화
     */
    async disableMFA(method: MFAMethod): Promise<void> {
      if (!this.user) throw new Error('User not authenticated')

      const authService = getAuthService()
      await authService.disableMFA(this.user.userId, method)
    },

    /**
     * 로그아웃
     */
    async logout(): Promise<void> {
      try {
        const authService = getAuthService()
        await authService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    /**
     * 토큰 갱신
     */
    async refreshAccessToken(): Promise<void> {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      try {
        const authService = getAuthService()
        const response = await authService.refreshToken(this.refreshToken)

        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.expiresAt = Date.now() + response.expiresIn * 1000

        // 로컬 스토리지 업데이트
        if (import.meta.client) {
          localStorage.setItem('accessToken', response.accessToken)
          localStorage.setItem('refreshToken', response.refreshToken)
          localStorage.setItem('expiresAt', this.expiresAt.toString())
        }
      } catch (error: any) {
        this.clearAuth()
        throw error
      }
    },

    /**
     * 현재 사용자 정보 조회
     */
    async fetchCurrentUser(): Promise<void> {
      try {
        const authService = getAuthService()
        const user = await authService.getCurrentUser()
        this.user = user as AuthUser
      } catch (error: any) {
        console.error('Failed to fetch current user:', error)
        this.clearAuth()
        throw error
      }
    },

    /**
     * 인증 정보 복원 (로컬 스토리지에서)
     */
    restoreAuth(): void {
      if (import.meta.client) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const userStr = localStorage.getItem('user')
        const expiresAt = localStorage.getItem('expiresAt')

        if (accessToken && refreshToken && userStr) {
          try {
            this.accessToken = accessToken
            this.refreshToken = refreshToken
            this.user = JSON.parse(userStr)
            this.expiresAt = expiresAt ? parseInt(expiresAt) : null
            this.isAuthenticated = true

            // 토큰 만료 확인 및 갱신
            if (this.isTokenExpired) {
              this.refreshAccessToken().catch(() => {
                this.clearAuth()
              })
            }
          } catch (error) {
            console.error('Failed to restore auth:', error)
            this.clearAuth()
          }
        }
      }
    },

    /**
     * 인증 데이터 설정
     */
    setAuthData(response: any): void {
      this.accessToken = response.accessToken
      this.refreshToken = response.refreshToken
      this.user = response.user as AuthUser
      this.expiresAt = Date.now() + response.expiresIn * 1000
      this.isAuthenticated = true

      // 로컬 스토리지에 저장
      if (import.meta.client) {
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('expiresAt', this.expiresAt.toString())
      }
    },

    /**
     * 인증 정보 제거
     */
    clearAuth(): void {
      this.isAuthenticated = false
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.expiresAt = null
      this.requireMFA = false
      this.mfaMethods = []

      // 로컬 스토리지 제거
      if (import.meta.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        localStorage.removeItem('expiresAt')
      }
    },

    /**
     * 임시 로그인 (개발용 - JWT 서버 연동 전까지)
     */
    tempLogin(userId: string, username: string): void {
      const tempUser: AuthUser = {
        userId,
        username,
        email: `${username}@example.com`,
        status: 'online',
      }

      this.user = tempUser
      this.isAuthenticated = true
      this.accessToken = 'temp-token-' + Date.now()
      this.refreshToken = 'temp-refresh-' + Date.now()
      this.expiresAt = Date.now() + 3600000 // 1시간

      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(tempUser))
        localStorage.setItem('accessToken', this.accessToken)
        localStorage.setItem('refreshToken', this.refreshToken)
        localStorage.setItem('expiresAt', this.expiresAt.toString())
      }
    },
  },
})


