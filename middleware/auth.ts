/**
 * 인증 미들웨어
 * 로그인이 필요한 페이지에 접근 시 토큰 확인
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 클라이언트에서만 실행
  if (process.client) {
    const token = localStorage.getItem('access_token');
    
    // 로그인 페이지는 제외
    if (to.path === '/login') {
      return;
    }
    
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      return navigateTo('/login');
    }
  }
});
