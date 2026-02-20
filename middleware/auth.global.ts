/**
 * 인증 미들웨어
 * - 토큰 없으면 /login 리다이렉트
 * - /login 페이지에서 이미 토큰 있으면 / 리다이렉트
 */
export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return

  const token = localStorage.getItem('access_token')

  // 이미 로그인 상태에서 /login 접근 시 메인으로
  if (to.path === '/login' && token) {
    return navigateTo('/')
  }

  // 로그인 페이지는 인증 불필요
  if (to.path === '/login') return

  // 토큰 없으면 로그인으로
  if (!token) {
    return navigateTo('/login')
  }

  // 토큰 만료 여부 간단 체크 (JWT exp 클레임)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem('access_token')
      return navigateTo('/login')
    }
  } catch {
    // 파싱 실패해도 토큰 존재하면 일단 통과 (서버에서 검증)
  }
})
