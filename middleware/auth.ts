/**
 * 인증 미들웨어
 * 보호된 라우트에 접근하기 전에 인증 상태 확인
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // 인증이 필요한 페이지 목록
  const protectedRoutes = ['/channels', '/dm', '/settings', '/profile']

  // 현재 경로가 보호된 라우트인지 확인
  const isProtectedRoute = protectedRoutes.some(route =>
    to.path.startsWith(route)
  )

  // 보호된 라우트에 접근하는데 인증되지 않은 경우
  if (isProtectedRoute && !authStore.isLoggedIn) {
    // 로그인 페이지로 리다이렉트 (원래 가려던 페이지 기억)
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // 이미 로그인한 상태에서 로그인 페이지 접근
  if (to.path === '/login' && authStore.isLoggedIn) {
    return navigateTo('/channels')
  }

  // 토큰 만료 확인 및 갱신
  if (authStore.isLoggedIn && authStore.isTokenExpired) {
    // 토큰 갱신 시도
    authStore.refreshAccessToken().catch(() => {
      // 갱신 실패 시 로그아웃
      authStore.clearAuth()
      return navigateTo('/login')
    })
  }
})

