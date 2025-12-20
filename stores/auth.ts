import { defineStore } from 'pinia'

export interface User {
  userId: string
  username: string
  email: string
  avatar?: string
  status?: 'online' | 'away' | 'busy' | 'offline'
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null,
  }),

  getters: {
    currentUser: (state): User | null => state.user,
    isLoggedIn: (state): boolean => state.isAuthenticated,
  },

  actions: {
    /**
     * 로그인 (임시 - API 없이)
     */
    async login(credentials: { userId: string; password: string }): Promise<void> {
      // 임시 사용자 데이터 (최고 권한)
      const mockUsers: Record<string, User> = {
        admin: {
          userId: 'admin',
          username: '관리자',
          email: 'admin@example.com',
          avatar: '',
          status: 'online',
        },
        user1: {
          userId: 'user1',
          username: '사용자1',
          email: 'user1@example.com',
          avatar: '',
          status: 'online',
        },
        user2: {
          userId: 'user2',
          username: '사용자2',
          email: 'user2@example.com',
          avatar: '',
          status: 'online',
        },
      }

      // 사용자 찾기 또는 새로 생성
      const user = mockUsers[credentials.userId] || {
        userId: credentials.userId,
        username: credentials.userId,
        email: `${credentials.userId}@example.com`,
        avatar: '',
        status: 'online' as const,
      }

      this.user = user
      this.isAuthenticated = true
      this.saveToStorage()

      // 약간의 딜레이 (실제 API 호출처럼)
      await new Promise(resolve => setTimeout(resolve, 500))
    },

    /**
     * 회원가입 (임시)
     */
    async register(data: any): Promise<void> {
      await this.login({ userId: data.userId, password: data.password })
    },

    /**
     * OAuth2 로그인 (임시)
     */
    async loginWithOAuth2(provider: string): Promise<void> {
      const user: User = {
        userId: `${provider}_user`,
        username: `${provider} 사용자`,
        email: `${provider}@example.com`,
        avatar: '',
        status: 'online',
      }

      this.user = user
      this.isAuthenticated = true
      this.saveToStorage()

      await new Promise(resolve => setTimeout(resolve, 500))
    },

    /**
     * MFA 검증 (임시)
     */
    async verifyMFA(data: any): Promise<void> {
      // MFA는 항상 성공
      await new Promise(resolve => setTimeout(resolve, 500))
    },

    /**
     * 로그아웃
     */
    async logout(): Promise<void> {
      this.user = null
      this.isAuthenticated = false
      this.clearStorage()
    },

    /**
     * 인증 정보 복원
     */
    restoreAuth(): void {
      if (typeof window === 'undefined') return

      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
        } catch (error) {
          console.error('Failed to restore auth:', error)
          this.clearStorage()
        }
      }
    },

    /**
     * 로컬 스토리지에 저장
     */
    saveToStorage(): void {
      if (typeof window === 'undefined') return

      if (this.user) {
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('isAuthenticated', 'true')
      }
    },

    /**
     * 로컬 스토리지 정리
     */
    clearStorage(): void {
      if (typeof window === 'undefined') return

      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    },
  },
})

