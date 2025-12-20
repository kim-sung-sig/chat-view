import type {
  IOAuth2AuthProvider,
  OAuth2Config,
  OAuth2Provider,
  AuthResult,
} from '../types'

/**
 * OAuth2 인증 제공자
 */
export class OAuth2AuthProvider implements IOAuth2AuthProvider {
  name: string
  type = 'oauth2' as const
  private config: OAuth2Config
  private apiUrl: string

  constructor(config: OAuth2Config, apiUrl: string) {
    this.name = `oauth2-${config.provider}`
    this.config = config
    this.apiUrl = apiUrl
  }

  /**
   * OAuth2 인증 URL 생성
   */
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope?.join(' ') || this.getDefaultScope(),
    })

    const baseUrls: Record<OAuth2Provider, string> = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      github: 'https://github.com/login/oauth/authorize',
      kakao: 'https://kauth.kakao.com/oauth/authorize',
      naver: 'https://nid.naver.com/oauth2.0/authorize',
    }

    return `${baseUrls[this.config.provider]}?${params.toString()}`
  }

  /**
   * OAuth2 콜백 처리
   */
  async handleCallback(code: string): Promise<AuthResult> {
    try {
      const response = await $fetch<{
        token: string
        refreshToken: string
        user: any
      }>(`${this.apiUrl}/auth/oauth2/callback`, {
        method: 'POST',
        body: {
          provider: this.config.provider,
          code,
          redirectUri: this.config.redirectUri,
        },
      })

      return {
        success: true,
        token: response.token,
        refreshToken: response.refreshToken,
        user: response.user,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'OAuth2 authentication failed',
      }
    }
  }

  /**
   * 인증 (OAuth2 플로우 시작)
   */
  async authenticate(): Promise<AuthResult> {
    // OAuth2는 리다이렉트 기반이므로 여기서는 URL만 반환
    const authUrl = this.getAuthUrl()

    // 브라우저에서 OAuth2 페이지로 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.href = authUrl
    }

    return {
      success: false,
      error: 'OAuth2 redirect initiated',
    }
  }

  /**
   * 토큰 검증
   */
  async validate(token: string): Promise<boolean> {
    try {
      await $fetch(`${this.apiUrl}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * 제공자별 기본 스코프
   */
  private getDefaultScope(): string {
    const scopes: Record<OAuth2Provider, string> = {
      google: 'openid email profile',
      github: 'user:email',
      kakao: 'profile_nickname account_email',
      naver: 'name email',
    }

    return scopes[this.config.provider]
  }
}

