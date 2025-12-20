<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// 앱 초기화
const authStore = useAuthStore()
const wsStore = useWebSocketStore()
const messageStore = useMessageStore()

onMounted(() => {
  // 인증 정보 복원
  authStore.restoreAuth()

  // 로그인된 경우 WebSocket 연결
  if (authStore.isLoggedIn) {
    wsStore.connect()
    messageStore.setupMessageListener()
  }
})

onUnmounted(() => {
  // WebSocket 연결 해제
  wsStore.disconnect()
  messageStore.removeMessageListener()
})
</script>
