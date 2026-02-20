/**
 * API 호출을 위한 Composable
 * - Bearer 토큰 자동 주입
 * - 401 시 토큰 갱신 후 재시도
 */

interface ApiConfig {
  baseURL: string
  timeout: number
}

export const useApi = () => {
  const config = useRuntimeConfig()

  const apiConfig: ApiConfig = {
    baseURL: config.public.apiBase || 'http://localhost:8080',
    timeout: 30000,
  }

  const apiFetch = $fetch.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    credentials: 'include',

    onRequest({ options }) {
      // 액세스 토큰 자동 주입
      const token = typeof localStorage !== 'undefined'
        ? localStorage.getItem('access_token')
        : null
      if (token) {
        const headers = (options.headers || {}) as Record<string, string>
        headers['Authorization'] = `Bearer ${token}`
        options.headers = headers
      }
    },

    async onResponseError({ request, response, options }) {
      // 401: 토큰 만료 → 갱신 시도
      if (response.status === 401) {
        try {
          const runtimeConfig = useRuntimeConfig()
          const baseURL = runtimeConfig.public.apiBase

          const refreshResp = await $fetch<{
            isAuthenticated: boolean
            token?: { accessToken: string }
          }>(`${baseURL}/api/v1/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          })

          if (refreshResp.isAuthenticated && refreshResp.token?.accessToken) {
            const newToken = refreshResp.token.accessToken
            localStorage.setItem('access_token', newToken)
            // 원래 요청 재시도
            const headers = (options.headers || {}) as Record<string, string>
            headers['Authorization'] = `Bearer ${newToken}`
            options.headers = headers
            return
          }
        } catch {}

        // 갱신 실패 → 로그인 페이지
        localStorage.removeItem('access_token')
        localStorage.removeItem('auth_user')
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    },
  })

  return { apiFetch, apiConfig }
}
