/**
 * 인증 제공자 타입
 */
export type AuthProviderType = 'password' | 'oauth2' | 'mfa'

/**
 * OAuth2 제공자
 */
export type OAuth2Provider = 'google' | 'github' | 'kakao' | 'naver'

/**
 * MFA 방법
 */
export type MFAMethod = 'totp' | 'sms' | 'email'

/**
 * 인증 결과
 */
export interface AuthResult {
  success: boolean
  token?: string
  refreshToken?: string
  user?: User
  mfaRequired?: boolean
  mfaMethod?: MFAMethod[]
  error?: string
}

/**
 * 사용자 정보
 */
export interface User {
  userId: string
  username: string
  email: string
  avatar?: string
  status?: 'online' | 'away' | 'busy' | 'offline'
  mfaEnabled?: boolean
  mfaMethods?: MFAMethod[]
}

/**
 * 로그인 자격증명
 */
export interface LoginCredentials {
  userId: string
  password: string
}

/**
 * 회원가입 데이터
 */
export interface RegisterData {
  userId: string
  username: string
  email: string
  password: string
}

/**
 * MFA 검증 데이터
 */
export interface MFAVerifyData {
  code: string
  method: MFAMethod
}

/**
 * MFA 설정 결과
 */
export interface MFASetupResult {
  success: boolean
  qrCode?: string // TOTP용 QR 코드
  secret?: string // TOTP용 시크릿
  backupCodes?: string[] // 백업 코드
}

/**
 * OAuth2 설정
 */
export interface OAuth2Config {
  provider: OAuth2Provider
  clientId: string
  redirectUri: string
  scope?: string[]
}

/**
 * 인증 제공자 인터페이스
 */
export interface IAuthProvider {
  /** 제공자 이름 */
  name: string

  /** 제공자 타입 */
  type: AuthProviderType

  /**
   * 인증 수행
   */
  authenticate(params: any): Promise<AuthResult>

  /**
   * 토큰 검증
   */
  validate(token: string): Promise<boolean>
}

/**
 * Password 인증 제공자 인터페이스
 */
export interface IPasswordAuthProvider extends IAuthProvider {
  /**
   * 로그인
   */
  login(credentials: LoginCredentials): Promise<AuthResult>

  /**
   * 회원가입
   */
  register(data: RegisterData): Promise<User>
}

/**
 * OAuth2 인증 제공자 인터페이스
 */
export interface IOAuth2AuthProvider extends IAuthProvider {
  /**
   * OAuth2 로그인 URL 생성
   */
  getAuthUrl(): string

  /**
   * OAuth2 콜백 처리
   */
  handleCallback(code: string): Promise<AuthResult>
}

/**
 * MFA 제공자 인터페이스
 */
export interface IMFAProvider extends IAuthProvider {
  /**
   * MFA 설정
   */
  setup(userId: string, method: MFAMethod): Promise<MFASetupResult>

  /**
   * MFA 검증
   */
  verify(userId: string, code: string, method: MFAMethod): Promise<AuthResult>

  /**
   * MFA 비활성화
   */
  disable(userId: string): Promise<boolean>
}

