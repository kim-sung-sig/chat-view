<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useDataStore } from '~/store/data'

const authStore = useAuthStore()
const dataStore = useDataStore()

onMounted(() => {
  // 저장된 토큰/유저 복원
  authStore.init()
  // auth store 유저를 data store에 동기화
  if (authStore.currentUser) {
    dataStore.currentUser = authStore.currentUser
    dataStore.users[authStore.currentUser.id] = authStore.currentUser
  }
})
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
