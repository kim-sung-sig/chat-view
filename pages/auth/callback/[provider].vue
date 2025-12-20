<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-workspace-bg dark:to-workspace-sidebar">
    <div class="text-center">
      <LoadingSpinner size="lg" />
      <p class="mt-4 text-gray-600 dark:text-workspace-text-muted">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import type { OAuth2Provider } from '~/types/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const message = ref('OAuth2 로그인 처리 중...')

onMounted(async () => {
  try {
    // URL에서 파라미터 추출
    const code = route.query.code as string
    const state = route.query.state as string
    const provider = route.params.provider as OAuth2Provider
    const error = route.query.error as string

    // 에러 확인
    if (error) {
      message.value = 'OAuth2 로그인이 취소되었습니다.'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return
    }

    // 코드가 없으면 에러
    if (!code) {
      message.value = '잘못된 OAuth2 응답입니다.'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return
    }

    // OAuth2 로그인 수행
    const redirectUri = `${window.location.origin}/auth/callback/${provider}`
    await authStore.loginWithOAuth2({
      provider,
      code,
      redirectUri,
    })

    // 로그인 성공
    message.value = '로그인 성공! 채널로 이동합니다...'
    setTimeout(() => {
      router.push('/channels')
    }, 1000)
  } catch (err: any) {
    message.value = err.message || 'OAuth2 로그인에 실패했습니다.'
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }
})
</script>

