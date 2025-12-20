/**
 * 인증 관련 타입 정의
 */

// ============================================
// 인증 방식 (Auth Method)
// ============================================

/**
 * 인증 방식 타입
 */
export type AuthMethod = 'password' | 'oauth2' | 'mfa'

/**
 * OAuth2 제공자
 */
export type OAuth2Provider = 'google' | 'github' | 'kakao' | 'naver'

/**
 * MFA 방식
 */
export type MFAMethod = 'totp' | 'sms' | 'email'

// ============================================
// 인증 요청/응답
// ============================================

/**
 * 기본 로그인 요청 (ID/Password)
 */
export interface LoginRequest {
  userId: string
  password: string
}

/**
 * OAuth2 로그인 요청
 */
export interface OAuth2LoginRequest {
  provider: OAuth2Provider
  code: string
  redirectUri: string
}

/**
 * MFA 검증 요청
 */
export interface MFAVerifyRequest {
  userId: string
  code: string
  method: MFAMethod
}

/**
 * 회원가입 요청
 */
export interface RegisterRequest {
  userId: string
  username: string
  email: string
  password: string
}

/**
 * 인증 응답
 */
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    userId: string
    username: string
    email: string
    avatar?: string
  }
  requireMFA?: boolean
  mfaMethods?: MFAMethod[]
}

/**
 * 토큰 갱신 요청
 */
export interface RefreshTokenRequest {
  refreshToken: string
}

/**
 * 토큰 갱신 응답
 */
export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// ============================================
// 인증 상태
// ============================================

/**
 * 인증 상태
 */
export interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  expiresAt: number | null
  requireMFA: boolean
  mfaMethods: MFAMethod[]
}

/**
 * 인증된 사용자 정보
 */
export interface AuthUser {
  userId: string
  username: string
  email: string
  avatar?: string
  status?: 'online' | 'away' | 'busy' | 'offline'
  createdAt?: string
}

// ============================================
// JWT 페이로드
// ============================================

/**
 * JWT Access Token 페이로드
 */
export interface JWTAccessPayload {
  sub: string // userId
  username: string
  email: string
  iat: number
  exp: number
  type: 'access'
}

/**
 * JWT Refresh Token 페이로드
 */
export interface JWTRefreshPayload {
  sub: string // userId
  iat: number
  exp: number
  type: 'refresh'
}

// ============================================
// 인증 전략 인터페이스
// ============================================

/**
 * 인증 전략 기본 인터페이스
 */
export interface AuthStrategy {
  /**
   * 로그인 수행
   */
  login(credentials: unknown): Promise<AuthResponse>

  /**
   * 로그아웃 수행
   */
  logout(): Promise<void>

  /**
   * 토큰 갱신
   */
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>
}

/**
 * Password 인증 전략
 */
export interface PasswordAuthStrategy extends AuthStrategy {
  login(credentials: LoginRequest): Promise<AuthResponse>
}

/**
 * OAuth2 인증 전략
 */
export interface OAuth2AuthStrategy extends AuthStrategy {
  login(credentials: OAuth2LoginRequest): Promise<AuthResponse>
  getAuthUrl(provider: OAuth2Provider, redirectUri: string): string
}

/**
 * MFA 인증 전략
 */
export interface MFAAuthStrategy extends AuthStrategy {
  verify(request: MFAVerifyRequest): Promise<AuthResponse>
  setupMFA(userId: string, method: MFAMethod): Promise<{ secret: string; qrCode?: string }>
  disableMFA(userId: string, method: MFAMethod): Promise<void>
}

// ============================================
// 인증 에러
// ============================================

/**
 * 인증 에러 코드
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  MFA_REQUIRED = 'MFA_REQUIRED',
  MFA_INVALID = 'MFA_INVALID',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

/**
 * 인증 에러
 */
export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

