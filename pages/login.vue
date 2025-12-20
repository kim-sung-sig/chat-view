<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-workspace-bg dark:to-workspace-sidebar p-4">
    <div class="w-full max-w-md">
      <!-- 로고 및 타이틀 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-workspace-text mb-2">
          💬 Chat Platform
        </h1>
        <p class="text-gray-600 dark:text-workspace-text-muted">
          실시간 채팅 플랫폼에 오신 것을 환영합니다
        </p>
      </div>

      <!-- 로그인 카드 -->
      <div class="bg-white dark:bg-workspace-sidebar rounded-2xl shadow-xl p-8">
        <!-- 탭 메뉴 -->
        <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-workspace-border">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 py-3 text-sm font-medium transition-colors border-b-2',
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-workspace-text-muted dark:hover:text-workspace-text'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Password 로그인 -->
        <form v-if="activeTab === 'password'" @submit.prevent="handlePasswordLogin" class="space-y-4">
          <BaseInput
            v-model="passwordForm.userId"
            label="사용자 ID"
            placeholder="user1"
            required
          />

          <BaseInput
            v-model="passwordForm.password"
            type="password"
            label="비밀번호"
            placeholder="••••••••"
            required
          />

          <BaseButton
            type="submit"
            variant="primary"
            full-width
            :loading="loading"
          >
            로그인
          </BaseButton>

          <p class="text-center text-sm text-gray-600 dark:text-workspace-text-muted">
            계정이 없으신가요?
            <button
              type="button"
              @click="activeTab = 'register'"
              class="text-brand-600 hover:underline"
            >
              회원가입
            </button>
          </p>
        </form>

        <!-- 회원가입 -->
        <form v-else-if="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-4">
          <BaseInput
            v-model="registerForm.userId"
            label="사용자 ID"
            placeholder="user1"
            required
          />

          <BaseInput
            v-model="registerForm.username"
            label="사용자 이름"
            placeholder="홍길동"
            required
          />

          <BaseInput
            v-model="registerForm.email"
            type="email"
            label="이메일"
            placeholder="user@example.com"
            required
          />

          <BaseInput
            v-model="registerForm.password"
            type="password"
            label="비밀번호"
            placeholder="••••••••"
            required
          />

          <BaseButton
            type="submit"
            variant="primary"
            full-width
            :loading="loading"
          >
            회원가입
          </BaseButton>

          <p class="text-center text-sm text-gray-600 dark:text-workspace-text-muted">
            이미 계정이 있으신가요?
            <button
              type="button"
              @click="activeTab = 'password'"
              class="text-brand-600 hover:underline"
            >
              로그인
            </button>
          </p>
        </form>

        <!-- OAuth2 로그인 -->
        <div v-else-if="activeTab === 'oauth2'" class="space-y-3">
          <BaseButton
            v-for="provider in oauth2Providers"
            :key="provider.id"
            variant="secondary"
            full-width
            @click="handleOAuth2Login(provider.id)"
          >
            <BaseIcon :name="provider.icon" size="sm" class="mr-2" />
            {{ provider.label }}로 로그인
          </BaseButton>
        </div>

        <!-- MFA 검증 -->
        <form v-else-if="activeTab === 'mfa'" @submit.prevent="handleMFAVerify" class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-workspace-text-muted mb-4">
            2단계 인증 코드를 입력해주세요.
          </p>

          <div class="flex gap-2 mb-4">
            <button
              v-for="method in availableMFAMethods"
              :key="method"
              type="button"
              @click="selectedMFAMethod = method"
              :class="[
                'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                selectedMFAMethod === method
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-workspace-hover dark:text-workspace-text'
              ]"
            >
              {{ getMFAMethodLabel(method) }}
            </button>
          </div>

          <BaseInput
            v-model="mfaCode"
            label="인증 코드"
            placeholder="000000"
            required
            maxlength="6"
          />

          <BaseButton
            type="submit"
            variant="primary"
            full-width
            :loading="loading"
          >
            인증
          </BaseButton>
        </form>

        <!-- 에러 메시지 -->
        <div v-if="error" class="mt-4 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
          <p class="text-sm text-danger-700 dark:text-danger-400">
            {{ error }}
          </p>
        </div>

        <!-- 개발용 임시 로그인 -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-workspace-border">
          <p class="text-xs text-gray-500 dark:text-workspace-text-muted mb-2 text-center">
            개발 모드 (JWT 서버 연동 전)
          </p>
          <BaseButton
            variant="ghost"
            size="sm"
            full-width
            @click="handleTempLogin"
          >
            임시 로그인
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { OAuth2Provider, MFAMethod } from '~/types/auth'

// ============================================
// State
// ============================================
const authStore = useAuthStore()

const activeTab = ref<'password' | 'oauth2' | 'mfa' | 'register'>('password')
const loading = ref(false)
const error = ref('')

const passwordForm = ref({
  userId: '',
  password: '',
})

const registerForm = ref({
  userId: '',
  username: '',
  email: '',
  password: '',
})

const mfaCode = ref('')
const selectedMFAMethod = ref<MFAMethod>('totp')
const availableMFAMethods = ref<MFAMethod[]>([])

// ============================================
// 탭 설정
// ============================================
const tabs = [
  { id: 'password', label: '로그인' },
  { id: 'oauth2', label: 'SNS 로그인' },
]

const oauth2Providers = [
  { id: 'google', label: 'Google', icon: 'users' },
  { id: 'github', label: 'GitHub', icon: 'users' },
  { id: 'kakao', label: 'Kakao', icon: 'users' },
  { id: 'naver', label: 'Naver', icon: 'users' },
]

// ============================================
// Methods
// ============================================

/**
 * Password 로그인
 */
const handlePasswordLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.loginWithPassword(passwordForm.value)

    // MFA 필요 여부 확인
    if (authStore.needsMFA) {
      availableMFAMethods.value = authStore.mfaMethods
      selectedMFAMethod.value = authStore.mfaMethods[0]
      activeTab.value = 'mfa'
      return
    }

    // 로그인 성공
    await navigateTo('/channels')
  } catch (err: any) {
    error.value = err.message || '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

/**
 * 회원가입
 */
const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.register(registerForm.value)
    await navigateTo('/channels')
  } catch (err: any) {
    error.value = err.message || '회원가입에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

/**
 * OAuth2 로그인
 */
const handleOAuth2Login = (provider: OAuth2Provider) => {
  const authUrl = authStore.getOAuth2Url(provider)
  window.location.href = authUrl
}

/**
 * MFA 검증
 */
const handleMFAVerify = async () => {
  if (!authStore.user) return

  loading.value = true
  error.value = ''

  try {
    await authStore.verifyMFA({
      userId: authStore.user.userId,
      code: mfaCode.value,
      method: selectedMFAMethod.value,
    })

    await navigateTo('/channels')
  } catch (err: any) {
    error.value = err.message || 'MFA 인증에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

/**
 * 임시 로그인 (개발용)
 */
const handleTempLogin = () => {
  authStore.tempLogin('user1', '테스트 사용자')
  navigateTo('/channels')
}

/**
 * MFA 방식 라벨
 */
const getMFAMethodLabel = (method: MFAMethod): string => {
  const labels: Record<MFAMethod, string> = {
    totp: 'OTP 앱',
    sms: 'SMS',
    email: '이메일',
  }
  return labels[method]
}

// ============================================
// Lifecycle
// ============================================

// 이미 로그인된 경우 채널로 리다이렉트
onMounted(() => {
  if (authStore.isLoggedIn) {
    navigateTo('/channels')
  }
})
</script>

