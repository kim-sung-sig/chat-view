import type {
  IPasswordAuthProvider,
  LoginCredentials,
  RegisterData,
  AuthResult,
  User,
} from '../types'

/**
 * Password 기반 인증 제공자
 */
export class PasswordAuthProvider implements IPasswordAuthProvider {
  name = 'password'
  type = 'password' as const
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  /**
   * 로그인
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await $fetch<{
        token: string
        refreshToken: string
        user: User
        mfaRequired?: boolean
        mfaMethods?: string[]
      }>(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        body: credentials,
      })

      if (response.mfaRequired) {
        return {
          success: false,
          mfaRequired: true,
          mfaMethod: response.mfaMethods as any[],
        }
      }

      return {
        success: true,
        token: response.token,
        refreshToken: response.refreshToken,
        user: response.user,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      }
    }
  }

  /**
   * 회원가입
   */
  async register(data: RegisterData): Promise<User> {
    const response = await $fetch<User>(`${this.apiUrl}/auth/register`, {
      method: 'POST',
      body: data,
    })

    return response
  }

  /**
   * 인증 (로그인과 동일)
   */
  async authenticate(params: LoginCredentials): Promise<AuthResult> {
    return this.login(params)
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
}

