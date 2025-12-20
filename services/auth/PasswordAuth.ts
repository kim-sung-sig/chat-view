/**
 * Password 인증 전략
 */

import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenResponse,
  PasswordAuthStrategy,
  RegisterRequest,
} from '~/types/auth'
import { getAuthApiClient } from '~/utils/apiClient'

export class PasswordAuth implements PasswordAuthStrategy {
  private apiClient = getAuthApiClient()

  /**
   * 로그인
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/auth/login',
        credentials,
        { skipAuth: true }
      )

      // 토큰 저장
      this.apiClient.setTokens(response.accessToken, response.refreshToken)

      return response
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * 회원가입
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/auth/register',
        data,
        { skipAuth: true }
      )

      // 토큰 저장
      this.apiClient.setTokens(response.accessToken, response.refreshToken)

      return response
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    try {
      await this.apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // 로컬 토큰 제거
      this.apiClient.clearTokens()
    }
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await this.apiClient.post<RefreshTokenResponse>(
        '/auth/refresh',
        { refreshToken },
        { skipAuth: true }
      )

      // 새 토큰 저장
      this.apiClient.setTokens(response.accessToken, response.refreshToken)

      return response
    } catch (error: any) {
      // 갱신 실패 시 토큰 제거
      this.apiClient.clearTokens()
      throw this.handleError(error)
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      return await this.apiClient.get<AuthResponse['user']>('/auth/me')
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * 에러 처리
   */
  private handleError(error: any): Error {
    if (error.code) {
      return new Error(error.message || '인증 중 오류가 발생했습니다.')
    }
    return new Error('네트워크 오류가 발생했습니다.')
  }
}

