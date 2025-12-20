# 인증 시스템 설계 문서

## 개요
JWT 기반의 유연한 인증 시스템으로 다양한 인증 방법을 조합하여 사용할 수 있습니다.

## 인증 방법

### 1. ID/Password 인증
- 기본적인 사용자 ID와 비밀번호 기반 인증
- 비밀번호는 bcrypt로 해싱하여 저장

### 2. OAuth2 소셜 로그인
- Google
- GitHub  
- Kakao
- Naver

### 3. MFA (Multi-Factor Authentication)
- TOTP (Time-based One-Time Password) - Google Authenticator 등
- SMS 인증
- Email 인증

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Nuxt)                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Password   │  │   OAuth2     │  │     MFA      │  │
│  │   Provider   │  │   Provider   │  │   Provider   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                │           │
│           └────────────────┼────────────────┘           │
│                            │                            │
│                    ┌───────▼────────┐                   │
│                    │  AuthService   │                   │
│                    └───────┬────────┘                   │
└────────────────────────────┼─────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Auth API      │
                    │  (External)     │
                    └─────────────────┘
```

## 서비스 구조

### AuthService (services/auth/AuthService.ts)
메인 인증 서비스 - 모든 인증 방법을 통합 관리

```typescript
interface AuthService {
  // 기본 인증
  login(credentials: LoginCredentials): Promise<AuthResponse>
  logout(): Promise<void>
  refresh(): Promise<AuthResponse>
  
  // 인증 제공자 등록
  registerProvider(provider: AuthProvider): void
  
  // 현재 세션
  getCurrentUser(): User | null
  isAuthenticated(): boolean
}
```

### AuthProvider (인터페이스)
모든 인증 제공자가 구현해야 하는 인터페이스

```typescript
interface AuthProvider {
  name: string
  type: 'password' | 'oauth2' | 'mfa'
  
  authenticate(params: any): Promise<AuthResult>
  validate(token: string): Promise<boolean>
}
```

### 구체적인 Provider 구현

#### PasswordAuthProvider
```typescript
class PasswordAuthProvider implements AuthProvider {
  async authenticate({ userId, password }): Promise<AuthResult>
  async register(userData): Promise<User>
}
```

#### OAuth2AuthProvider
```typescript
class OAuth2AuthProvider implements AuthProvider {
  constructor(config: OAuth2Config)
  async authenticate({ provider }): Promise<AuthResult>
  async callback(code: string): Promise<AuthResult>
}
```

#### MFAProvider
```typescript
class MFAProvider implements AuthProvider {
  async authenticate({ code, method }): Promise<AuthResult>
  async setup(userId: string, method: MFAMethod): Promise<MFASetupResult>
  async verify(userId: string, code: string): Promise<boolean>
}
```

## 인증 흐름

### 1. Password 로그인
```
User → PasswordProvider → Auth API → JWT Token → Store
```

### 2. OAuth2 로그인
```
User → OAuth2Provider → OAuth2 Redirect → 
Callback → Auth API → JWT Token → Store
```

### 3. MFA 활성화 시
```
User → PasswordProvider → MFA Required → 
MFAProvider → Verify Code → JWT Token → Store
```

## Store 구조 (stores/auth.ts)

```typescript
interface AuthStore {
  // State
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoggedIn: boolean
  mfaRequired: boolean
  
  // Actions
  login(credentials): Promise<void>
  loginWithOAuth2(provider): Promise<void>
  verifyMFA(code): Promise<void>
  logout(): Promise<void>
  refresh(): Promise<void>
  
  // Getters
  currentUser: User | null
  isAuthenticated: boolean
}
```

## 환경 변수

```env
# Auth API
NUXT_PUBLIC_AUTH_API_URL=http://localhost:8084

# OAuth2 Client IDs
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NUXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
NUXT_PUBLIC_KAKAO_CLIENT_ID=your-kakao-client-id
NUXT_PUBLIC_NAVER_CLIENT_ID=your-naver-client-id

# OAuth2 Redirect URIs
NUXT_PUBLIC_OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
```

## 파일 구조

```
services/
  auth/
    AuthService.ts           # 메인 서비스
    providers/
      AuthProvider.ts        # 인터페이스
      PasswordAuthProvider.ts
      OAuth2AuthProvider.ts
      MFAProvider.ts
    types.ts                 # 타입 정의
    
stores/
  auth.ts                    # Pinia Store
  
middleware/
  auth.ts                    # 인증 미들웨어
  
pages/
  login.vue                  # 로그인 페이지
  auth/
    callback.vue             # OAuth2 콜백
    mfa-setup.vue            # MFA 설정
```

## 보안 고려사항

1. **Token 저장**: localStorage 대신 httpOnly 쿠키 사용 고려
2. **XSS 방지**: CSP 헤더 설정
3. **CSRF 방지**: CSRF 토큰 사용
4. **Token Refresh**: 자동 갱신 로직 구현
5. **MFA 백업 코드**: 복구용 백업 코드 생성

## 다음 단계

1. ✅ 로그인 페이지 UI 재디자인 (Discord/Slack 스타일)
2. 🔄 AuthService 및 Provider 구현
3. 🔄 OAuth2 연동
4. 🔄 MFA 시스템 구현
5. 🔄 Auth API 서버 구축 (Spring Boot)

