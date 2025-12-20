import { defineStore } from 'pinia'
import type { User } from '~/types/api'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    isAuthenticated: false
  }),

  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    // 로그인
    login(token: string, user: User) {
      this.token = token
      this.user = user
      this.isAuthenticated = true
      
      // 로컬 스토리지에 저장
      if (import.meta.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    // 로그아웃
    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      
      // 로컬 스토리지 삭제
      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    // 토큰 및 사용자 정보 복원
    restoreAuth() {
      if (import.meta.client) {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            this.token = token
            this.user = user
            this.isAuthenticated = true
          } catch (error) {
            console.error('Failed to restore auth:', error)
            this.logout()
          }
        }
      }
    },

    // 임시 로그인 (개발용 - JWT 모듈 연동 전까지)
    tempLogin(userId: string, username: string) {
      const tempToken = 'temp-token-' + Date.now()
      const tempUser: User = {
        userId,
        username,
        email: `${username}@example.com`
      }
      this.login(tempToken, tempUser)
    }
  }
})
