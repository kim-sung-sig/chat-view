<template>
  <div class="min-h-screen bg-gray-50">
    <slot />
  </div>
</template>

<script setup lang="ts">
// 앱 초기화
const authStore = useAuthStore()

onMounted(() => {
  // 인증 정보 복원
  authStore.restoreAuth()
})
</script>
