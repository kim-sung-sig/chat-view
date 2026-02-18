/**
 * 인증 API 서비스
 * /api/v1/auth
 */


export interface AuthRequest {
  identifier: string;
  credentialType: 'PASSWORD';
  password: string;
}

export interface AuthResponse {
  authenticated: boolean;
  userId?: string;
  requiresMfa?: boolean;
  mfaSessionId?: string;
  token?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export class AuthService {
  private apiFetch: any;

  constructor() {
    const { apiFetch } = useApi();
    this.apiFetch = apiFetch;
  }

  /**
   * 로그인
   */
  async authenticate(request: AuthRequest): Promise<AuthResponse> {
    const response = await this.apiFetch<AuthResponse>(
      '/api/v1/auth/authenticate',
      {
        method: 'POST',
        body: request
      }
    );

    // 토큰 저장
    if (response.token?.accessToken) {
      localStorage.setItem('access_token', response.token.accessToken);
    }

    return response;
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await this.apiFetch<AuthResponse>(
      '/api/v1/auth/refresh',
      {
        method: 'POST'
      }
    );

    // 새 토큰 저장
    if (response.token?.accessToken) {
      localStorage.setItem('access_token', response.token.accessToken);
    }

    return response;
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    await this.apiFetch('/api/v1/auth/logout', {
      method: 'POST'
    });

    // 로컬 토큰 제거
    localStorage.removeItem('access_token');
  }
}
