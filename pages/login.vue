<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-discord-bg dark:via-discord-sidebar dark:to-discord-bg p-4">
    <div class="w-full max-w-md">
      <!-- 로고 및 타이틀 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4 shadow-lg">
          <span class="text-4xl">💬</span>
        </div>
        <h1 class="text-4xl font-bold text-foreground mb-2">
          Chat Platform
        </h1>
        <p class="text-muted-foreground">
          실시간 채팅 플랫폼에 오신 것을 환영합니다
        </p>
      </div>

      <!-- 로그인 카드 -->
      <div class="bg-card dark:bg-discord-sidebar rounded-xl shadow-2xl p-8 border border-border dark:border-discord-hover">
        <!-- 로그인 폼 -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              사용자 ID
            </label>
            <input
              v-model="form.userId"
              type="text"
              placeholder="user1, user2 또는 admin"
              required
              class="input w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              비밀번호
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="아무거나 입력하세요"
              required
              class="input w-full"
            />
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            full-width
            :loading="loading"
            size="lg"
          >
            로그인
          </BaseButton>
        </form>

        <!-- 구분선 -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-card dark:bg-discord-sidebar text-muted-foreground">빠른 로그인</span>
          </div>
        </div>

        <!-- 빠른 로그인 버튼 -->
        <div class="grid grid-cols-3 gap-2">
          <BaseButton
            variant="secondary"
            size="sm"
            @click="quickLogin('admin')"
            :loading="loading"
          >
            관리자
          </BaseButton>
          <BaseButton
            variant="secondary"
            size="sm"
            @click="quickLogin('user1')"
            :loading="loading"
          >
            User1
          </BaseButton>
          <BaseButton
            variant="secondary"
            size="sm"
            @click="quickLogin('user2')"
            :loading="loading"
          >
            User2
          </BaseButton>
        </div>

        <!-- 안내 메시지 -->
        <div class="mt-6 p-4 bg-secondary dark:bg-discord-bg rounded-lg">
          <p class="text-xs text-muted-foreground text-center">
            ℹ️ 현재 테스트 모드입니다. 어떤 ID/비밀번호든 입력하면 로그인됩니다.
          </p>
        </div>
      </div>

      <!-- 푸터 -->
      <div class="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Chat Platform. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: undefined,
  layout: false
})

const authStore = useAuthStore()
const loading = ref(false)

const form = reactive({
  userId: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login({
      userId: form.userId,
      password: form.password
    })
    navigateTo('/channels')
  } catch (error) {
    console.error('Login failed:', error)
    alert('로그인 실패')
  } finally {
    loading.value = false
  }
}

const quickLogin = async (userId: string) => {
  form.userId = userId
  form.password = 'password'
  await handleLogin()
}
</script>

