export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // 클라이언트 사이드에서만 실행
  if (import.meta.client) {
    // 인증 정보 복원 시도
    authStore.restoreAuth()
    
    // 로그인되지 않았으면 홈으로 리다이렉트
    if (!authStore.isLoggedIn) {
      return navigateTo('/')
    }
  }
})
