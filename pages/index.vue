<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-workspace-bg dark:to-workspace-sidebar">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-workspace-text mb-4">
        💬 Chat Platform
      </h1>
      <p class="text-gray-600 dark:text-workspace-text-muted mb-8">
        로딩 중...
      </p>
      <LoadingSpinner size="lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // 로그인 여부에 따라 리다이렉트
  if (authStore.isLoggedIn) {
    navigateTo('/channels')
  } else {
    navigateTo('/login')
  }
})
</script>

