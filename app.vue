<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useDataStore } from '~/store/data'

const authStore = useAuthStore()
const dataStore = useDataStore()

onMounted(async () => {
  // 1. 저장된 토큰/유저 기본 복원 (localStorage)
  authStore.init()
  
  // 2. 만약 엑세스 토큰이 없다면 (또는 만료되었다면) 자동 로그인(토큰 갱신) 시도
  if (!authStore.accessToken) {
    console.log('No access token found, attempting auto-login via refresh token...')
    const success = await authStore.refreshToken()
    if (success) {
      console.log('Auto-login successful')
    }
  }

  // 3. 최종적으로 유저 정보가 있다면 data store에 동기화
  syncUserToDataStore()
})

const syncUserToDataStore = () => {
  if (authStore.currentUser) {
    dataStore.currentUser = authStore.currentUser
    dataStore.users[authStore.currentUser.id] = authStore.currentUser
  }
}

// authStore의 유저 정보가 변경될 때마다 자동 동기화
watch(() => authStore.currentUser, (newUser) => {
  if (newUser) syncUserToDataStore()
}, { deep: true })
</script>

<template>
  <div class="app-container">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Reset and base styles will be in assets/css/main.css */
</style>
