// TypeScript 타입 정의

// API 공통 응답
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
}

// 에러 응답
export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}

// 페이징 응답
export interface CursorPageResponse<T> {
  content: T[]
  nextCursor: string | null
  hasNext: boolean
  pageSize: number
}

// JWT 토큰
export interface JwtToken {
  accessToken: string
  refreshToken?: string
  expiresIn: number
}

// 사용자 정보
export interface User {
  userId: string
  username: string
  name?: string
  email?: string
  profileImage?: string
  avatar?: string
  status?: 'online' | 'away' | 'busy' | 'offline'
}
