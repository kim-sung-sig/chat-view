/**
 * API 호출을 위한 Composable
 * 백엔드 chat-platform API와 통신
 */

interface ApiConfig {
  baseURL: string;
  timeout: number;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  
  // API 기본 설정
  const apiConfig: ApiConfig = {
    baseURL: config.public.apiBase || 'http://localhost:8080',
    timeout: 30000
  };

  // HTTP 클라이언트 (Nuxt의 $fetch 사용)
  const apiFetch = $fetch.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    credentials: 'include', // 쿠키 포함 (refresh token)
    onRequest({ options }) {
      // 액세스 토큰 추가
      const token = localStorage.getItem('access_token');
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        };
      }
    },
    onResponseError({ response }) {
      // 401 에러 시 토큰 갱신 시도
      if (response.status === 401) {
        console.warn('Unauthorized, token may need refresh');
        // TODO: 토큰 갱신 로직
      }
    }
  });

  return {
    apiFetch,
    apiConfig
  };
};
