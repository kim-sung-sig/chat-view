/**
 * OAuth2 인증 전략
 */

import type {
  AuthResponse,
  OAuth2LoginRequest,
  OAuth2Provider,
  RefreshTokenResponse,
  OAuth2AuthStrategy,
} from '~/types/auth'
import { getAuthApiClient } from '~/utils/apiClient'

export class OAuth2Auth implements OAuth2AuthStrategy {
  private apiClient = getAuthApiClient()

  // OAuth2 제공자별 설정
  private providerConfigs: Record<OAuth2Provider, { authUrl: string; clientId: string }> = {
    google: {
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      clientId: '', // 환경변수에서 로드
    },
    github: {
      authUrl: 'https://github.com/login/oauth/authorize',
      clientId: '', // 환경변수에서 로드
    },
    kakao: {
      authUrl: 'https://kauth.kakao.com/oauth/authorize',
      clientId: '', // 환경변수에서 로드
    },
    naver: {
      authUrl: 'https://nid.naver.com/oauth2.0/authorize',
      clientId: '', // 환경변수에서 로드
    },
  }

  constructor() {
    // 환경변수에서 클라이언트 ID 로드
    if (import.meta.client) {
      const config = useRuntimeConfig()
      this.providerConfigs.google.clientId = config.public.googleClientId as string || ''
      this.providerConfigs.github.clientId = config.public.githubClientId as string || ''
      this.providerConfigs.kakao.clientId = config.public.kakaoClientId as string || ''
      this.providerConfigs.naver.clientId = config.public.naverClientId as string || ''
    }
  }

  /**
   * OAuth2 로그인 URL 생성
   */
  getAuthUrl(provider: OAuth2Provider, redirectUri: string): string {
    const config = this.providerConfigs[provider]

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: this.getScope(provider),
      state: this.generateState(),
    })

    return `${config.authUrl}?${params.toString()}`
  }

  /**
   * OAuth2 로그인 (인증 코드로)
   */
  async login(credentials: OAuth2LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/auth/oauth2/callback',
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
   * 제공자별 스코프 반환
   */
  private getScope(provider: OAuth2Provider): string {
    const scopes: Record<OAuth2Provider, string> = {
      google: 'openid profile email',
      github: 'read:user user:email',
      kakao: 'profile_nickname profile_image account_email',
      naver: 'name email profile_image',
    }
    return scopes[provider]
  }

  /**
   * CSRF 방지용 state 생성
   */
  private generateState(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  /**
   * 에러 처리
   */
  private handleError(error: any): Error {
    if (error.code) {
      return new Error(error.message || 'OAuth2 인증 중 오류가 발생했습니다.')
    }
    return new Error('네트워크 오류가 발생했습니다.')
  }
}

