<template>
  <div>
    <NuxtPage />
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
