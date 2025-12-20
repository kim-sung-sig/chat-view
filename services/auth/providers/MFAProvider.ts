import type {
  IMFAProvider,
  MFAMethod,
  MFASetupResult,
  AuthResult,
} from '../types'

/**
 * MFA (Multi-Factor Authentication) 제공자
 */
export class MFAProvider implements IMFAProvider {
  name = 'mfa'
  type = 'mfa' as const
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  /**
   * MFA 설정
   */
  async setup(userId: string, method: MFAMethod): Promise<MFASetupResult> {
    try {
      const response = await $fetch<MFASetupResult>(
        `${this.apiUrl}/auth/mfa/setup`,
        {
          method: 'POST',
          body: { userId, method },
        }
      )

      return response
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'MFA setup failed',
      } as any
    }
  }

  /**
   * MFA 검증
   */
  async verify(
    userId: string,
    code: string,
    method: MFAMethod
  ): Promise<AuthResult> {
    try {
      const response = await $fetch<{
        token: string
        refreshToken: string
        user: any
      }>(`${this.apiUrl}/auth/mfa/verify`, {
        method: 'POST',
        body: { userId, code, method },
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
        error: error.message || 'MFA verification failed',
      }
    }
  }

  /**
   * MFA 비활성화
   */
  async disable(userId: string): Promise<boolean> {
    try {
      await $fetch(`${this.apiUrl}/auth/mfa/disable`, {
        method: 'POST',
        body: { userId },
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * 인증 (MFA 검증)
   */
  async authenticate(params: {
    userId: string
    code: string
    method: MFAMethod
  }): Promise<AuthResult> {
    return this.verify(params.userId, params.code, params.method)
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

