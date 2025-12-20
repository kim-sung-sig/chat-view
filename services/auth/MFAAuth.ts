/**
 * MFA (Multi-Factor Authentication) 인증 전략
 */

import type {
  AuthResponse,
  MFAVerifyRequest,
  MFAMethod,
  RefreshTokenResponse,
  MFAAuthStrategy,
} from '~/types/auth'
import { getAuthApiClient } from '~/utils/apiClient'

export class MFAAuth implements MFAAuthStrategy {
  private apiClient = getAuthApiClient()

  /**
   * MFA 설정 (TOTP, SMS, Email)
   */
  async setupMFA(userId: string, method: MFAMethod): Promise<{ secret: string; qrCode?: string }> {
    try {
      const response = await this.apiClient.post<{ secret: string; qrCode?: string }>(
        '/auth/mfa/setup',
        { userId, method }
      )
      return response
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * MFA 검증
   */
  async verify(request: MFAVerifyRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/auth/mfa/verify',
        request,
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
   * MFA 비활성화
   */
  async disableMFA(userId: string, method: MFAMethod): Promise<void> {
    try {
      await this.apiClient.post('/auth/mfa/disable', { userId, method })
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * MFA 코드 전송 (SMS, Email)
   */
  async sendCode(userId: string, method: MFAMethod): Promise<void> {
    try {
      await this.apiClient.post('/auth/mfa/send-code', { userId, method })
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * 로그인 (MFA는 별도 verify 필요)
   */
  async login(): Promise<AuthResponse> {
    throw new Error('MFA requires separate verification. Use verify() method.')
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

      this.apiClient.setTokens(response.accessToken, response.refreshToken)
      return response
    } catch (error: any) {
      this.apiClient.clearTokens()
      throw this.handleError(error)
    }
  }

  /**
   * 에러 처리
   */
  private handleError(error: any): Error {
    if (error.code) {
      return new Error(error.message || 'MFA 인증 중 오류가 발생했습니다.')
    }
    return new Error('네트워크 오류가 발생했습니다.')
  }
}

