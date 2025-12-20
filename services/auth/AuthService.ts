/**
 * 통합 인증 서비스
 * 여러 인증 전략을 조합하여 사용
 */

import { PasswordAuth } from './PasswordAuth'
import { OAuth2Auth } from './OAuth2Auth'
import { MFAAuth } from './MFAAuth'
import type {
  AuthResponse,
  LoginRequest,
  OAuth2LoginRequest,
  OAuth2Provider,
  MFAVerifyRequest,
  MFAMethod,
  RegisterRequest,
  RefreshTokenResponse,
} from '~/types/auth'

/**
 * 통합 인증 서비스 클래스
 */
export class AuthService {
  private passwordAuth: PasswordAuth
  private oauth2Auth: OAuth2Auth
  private mfaAuth: MFAAuth

  constructor() {
    this.passwordAuth = new PasswordAuth()
    this.oauth2Auth = new OAuth2Auth()
    this.mfaAuth = new MFAAuth()
  }

  // ============================================
  // Password 인증
  // ============================================

  /**
   * ID/Password 로그인
   */
  async loginWithPassword(credentials: LoginRequest): Promise<AuthResponse> {
    return this.passwordAuth.login(credentials)
  }

  /**
   * 회원가입
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.passwordAuth.register(data)
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<AuthResponse['user']> {
    return this.passwordAuth.getCurrentUser()
  }

  // ============================================
  // OAuth2 인증
  // ============================================

  /**
   * OAuth2 로그인 URL 생성
   */
  getOAuth2Url(provider: OAuth2Provider, redirectUri: string): string {
    return this.oauth2Auth.getAuthUrl(provider, redirectUri)
  }

  /**
   * OAuth2 로그인 (인증 코드로)
   */
  async loginWithOAuth2(credentials: OAuth2LoginRequest): Promise<AuthResponse> {
    return this.oauth2Auth.login(credentials)
  }

  // ============================================
  // MFA 인증
  // ============================================

  /**
   * MFA 설정
   */
  async setupMFA(userId: string, method: MFAMethod): Promise<{ secret: string; qrCode?: string }> {
    return this.mfaAuth.setupMFA(userId, method)
  }

  /**
   * MFA 검증
   */
  async verifyMFA(request: MFAVerifyRequest): Promise<AuthResponse> {
    return this.mfaAuth.verify(request)
  }

  /**
   * MFA 비활성화
   */
  async disableMFA(userId: string, method: MFAMethod): Promise<void> {
    return this.mfaAuth.disableMFA(userId, method)
  }

  /**
   * MFA 코드 전송
   */
  async sendMFACode(userId: string, method: MFAMethod): Promise<void> {
    return this.mfaAuth.sendCode(userId, method)
  }

  // ============================================
  // 공통 기능
  // ============================================

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    // 모든 전략에서 로그아웃 수행
    await Promise.all([
      this.passwordAuth.logout(),
      this.oauth2Auth.logout(),
      this.mfaAuth.logout(),
    ])
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    // 어느 전략이든 토큰 갱신 가능
    return this.passwordAuth.refreshToken(refreshToken)
  }

  /**
   * 토큰 유효성 검증
   */
  isTokenValid(token: string): boolean {
    try {
      // JWT 토큰 디코딩
      const payload = this.decodeJWT(token)

      // 만료 시간 확인
      const now = Math.floor(Date.now() / 1000)
      return payload.exp > now
    } catch {
      return false
    }
  }

  /**
   * JWT 디코딩 (검증 없이)
   */
  private decodeJWT(token: string): any {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token')
    }

    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  }

  /**
   * Access Token 가져오기
   */
  getAccessToken(): string | null {
    if (import.meta.client) {
      return localStorage.getItem('accessToken')
    }
    return null
  }

  /**
   * Refresh Token 가져오기
   */
  getRefreshToken(): string | null {
    if (import.meta.client) {
      return localStorage.getItem('refreshToken')
    }
    return null
  }
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let authServiceInstance: AuthService | null = null

export const getAuthService = (): AuthService => {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService()
  }
  return authServiceInstance
}

// 기본 export
export default AuthService

