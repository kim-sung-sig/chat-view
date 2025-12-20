/**
 * API Client 유틸리티
 * JWT 토큰 관리, 요청/응답 인터셉터 포함
 */

import type { AuthErrorCode } from '~/types/auth'

// ============================================
// API Client 설정
// ============================================

export interface ApiClientConfig {
  baseURL: string
  timeout?: number
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
  skipAuth?: boolean
}

// ============================================
// API Client 클래스
// ============================================

export class ApiClient {
  private baseURL: string
  private timeout: number
  private tokenStorage: {
    getAccessToken: () => string | null
    getRefreshToken: () => string | null
    setTokens: (accessToken: string, refreshToken: string) => void
    clearTokens: () => void
  }

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout || 30000

    // 토큰 스토리지 초기화
    this.tokenStorage = {
      getAccessToken: () => {
        if (import.meta.client) {
          return localStorage.getItem('accessToken')
        }
        return null
      },
      getRefreshToken: () => {
        if (import.meta.client) {
          return localStorage.getItem('refreshToken')
        }
        return null
      },
      setTokens: (accessToken: string, refreshToken: string) => {
        if (import.meta.client) {
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
        }
      },
      clearTokens: () => {
        if (import.meta.client) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      },
    }
  }

  /**
   * GET 요청
   */
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  /**
   * POST 요청
   */
  async post<T>(url: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * PUT 요청
   */
  async put<T>(url: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * DELETE 요청
   */
  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }

  /**
   * 기본 요청 메서드
   */
  private async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { params, skipAuth, ...fetchOptions } = options

    // URL 생성
    let fullUrl = `${this.baseURL}${url}`
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = String(value)
          return acc
        }, {} as Record<string, string>)
      ).toString()
      fullUrl += `?${queryString}`
    }

    // 헤더 설정
    const headers = new Headers(fetchOptions.headers)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    // 인증 토큰 추가
    if (!skipAuth) {
      const accessToken = this.tokenStorage.getAccessToken()
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`)
      }
    }

    // 요청 수행
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // 응답 처리
      if (!response.ok) {
        await this.handleErrorResponse(response)
      }

      // JSON 파싱
      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다.')
      }
      throw error
    }
  }

  /**
   * 에러 응답 처리
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }

    const error: any = new Error(errorData.message || '요청 처리 중 오류가 발생했습니다.')
    error.status = response.status
    error.code = errorData.code
    error.details = errorData.details

    // 401 Unauthorized - 토큰 갱신 시도
    if (response.status === 401) {
      const refreshToken = this.tokenStorage.getRefreshToken()
      if (refreshToken) {
        try {
          await this.refreshAccessToken(refreshToken)
          // 토큰 갱신 성공 시 원래 요청 재시도는 호출자가 처리
          error.code = 'TOKEN_REFRESHED'
        } catch {
          // 토큰 갱신 실패
          this.tokenStorage.clearTokens()
          error.code = 'TOKEN_EXPIRED'
        }
      }
    }

    throw error
  }

  /**
   * Access Token 갱신
   */
  private async refreshAccessToken(refreshToken: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error('토큰 갱신에 실패했습니다.')
    }

    const data = await response.json()
    this.tokenStorage.setTokens(data.accessToken, data.refreshToken)
  }

  /**
   * 토큰 저장
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.tokenStorage.setTokens(accessToken, refreshToken)
  }

  /**
   * 토큰 제거
   */
  clearTokens(): void {
    this.tokenStorage.clearTokens()
  }
}

// ============================================
// API Client 인스턴스 생성
// ============================================

let authApiClient: ApiClient | null = null

export const getAuthApiClient = (): ApiClient => {
  if (!authApiClient) {
    const config = useRuntimeConfig()
    authApiClient = new ApiClient({
      baseURL: config.public.authApiUrl as string,
      timeout: 30000,
    })
  }
  return authApiClient
}

