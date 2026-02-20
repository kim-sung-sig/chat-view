/**
 * 인증 API 서비스
 * auth-server: POST /api/v1/auth/authenticate
 * 요청: { identifier, credentialType: "PASSWORD", credentialData: "비밀번호" }
 */

export interface AuthRequest {
  identifier: string
  credentialType: 'PASSWORD' | 'TOTP' | 'WEBAUTHN'
  credentialData: string   // 백엔드 필드명 (password 아님)
}

export interface TokenResponse {
  accessToken: string
  refreshToken?: string
  tokenType: string
  expiresIn: number
}

export interface AuthResponse {
  isAuthenticated: boolean
  authLevel?: string
  requiresMfa?: boolean
  mfaSessionId?: string
  remainingMfaMethods?: string[]
  failureReason?: string
  token?: TokenResponse
}

export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

export class AuthService {
  private apiFetch: any

  constructor() {
    const { apiFetch } = useApi()
    this.apiFetch = apiFetch
  }

  /** 로그인 */
  async authenticate(request: AuthRequest): Promise<AuthResponse> {
    const response = await this.apiFetch<AuthResponse>(
      '/api/v1/auth/authenticate',
      { method: 'POST', body: request }
    )
    if (response.token?.accessToken) {
      localStorage.setItem('access_token', response.token.accessToken)
    }
    return response
  }

  /** 회원가입 */
  async signup(request: SignupRequest): Promise<void> {
    await this.apiFetch('/api/v1/auth/signup', {
      method: 'POST',
      body: request,
    })
  }

  /** 토큰 갱신 */
  async refreshToken(): Promise<AuthResponse> {
    const response = await this.apiFetch<AuthResponse>(
      '/api/v1/auth/refresh',
      { method: 'POST' }
    )
    if (response.token?.accessToken) {
      localStorage.setItem('access_token', response.token.accessToken)
    }
    return response
  }

  /** 로그아웃 */
  async logout(): Promise<void> {
    try {
      await this.apiFetch('/api/v1/auth/logout', { method: 'POST' })
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_user')
    }
  }
}
