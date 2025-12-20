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
        <!-- 탭 메뉴 -->
        <div class="flex gap-2 mb-6 p-1 bg-secondary dark:bg-discord-bg rounded-lg">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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
            size="lg"
          >
            로그인
          </BaseButton>

          <p class="text-center text-sm text-muted-foreground">
            계정이 없으신가요?
            <button
              type="button"
              @click="activeTab = 'register'"
              class="text-primary hover:underline font-medium ml-1"
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
            size="lg"
          >
            회원가입
          </BaseButton>

          <p class="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?
            <button
              type="button"
              @click="activeTab = 'password'"
              class="text-primary hover:underline font-medium ml-1"
            >
              로그인
            </button>
          </p>
        </form>

        <!-- OAuth2 로그인 -->
        <div v-else-if="activeTab === 'oauth2'" class="space-y-3">
          <p class="text-sm text-muted-foreground mb-4 text-center">
            소셜 계정으로 간편하게 로그인하세요
          </p>
          <BaseButton
            v-for="provider in oauth2Providers"
            :key="provider.id"
            variant="secondary"
            full-width
            @click="handleOAuth2Login(provider.id)"
            size="lg"
          >
            <BaseIcon :name="provider.icon" size="sm" />
            {{ provider.label }}로 로그인
          </BaseButton>
        </div>

        <!-- MFA 검증 -->
        <form v-else-if="activeTab === 'mfa'" @submit.prevent="handleMFAVerify" class="space-y-4">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <BaseIcon name="shield" size="lg" class="text-primary" />
            </div>
            <h3 class="font-semibold text-foreground mb-2">2단계 인증</h3>
            <p class="text-sm text-muted-foreground">
              인증 코드를 입력해주세요
            </p>
          </div>

          <div class="flex gap-2 mb-4">
            <button
              v-for="method in availableMFAMethods"
              :key="method"
              type="button"
              @click="selectedMFAMethod = method"
              :class="[
                'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                selectedMFAMethod === method
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              ]"
            >
              {{ getMFAMethodLabel(method) }}
            </button>
          </div>

          <BaseInput
            v-model="mfaForm.code"
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
            size="lg"
          >
            인증
          </BaseButton>

          <BaseButton
            type="button"
            variant="ghost"
            full-width
            @click="handleCancelMFA"
          >
            취소
          </BaseButton>
        </form>

        <!-- 구분선 -->
        <div v-if="activeTab === 'password' || activeTab === 'register'" class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-card dark:bg-discord-sidebar text-muted-foreground">또는</span>
          </div>
        </div>

        <!-- 빠른 로그인 (개발용) -->
        <div v-if="activeTab === 'password' || activeTab === 'register'" class="space-y-2">
          <p class="text-xs text-muted-foreground text-center mb-2">빠른 로그인 (개발용)</p>
          <div class="grid grid-cols-2 gap-2">
            <BaseButton
              variant="ghost"
              size="sm"
              @click="quickLogin('user1')"
            >
              User1
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="sm"
              @click="quickLogin('user2')"
            >
              User2
            </BaseButton>
          </div>
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
const activeTab = ref<'password' | 'register' | 'oauth2' | 'mfa'>('password')

const tabs = [
  { id: 'password', label: '로그인' },
  { id: 'register', label: '회원가입' },
  { id: 'oauth2', label: 'OAuth2' },
]

const passwordForm = reactive({
  userId: '',
  password: ''
})

const registerForm = reactive({
  userId: '',
  username: '',
  email: '',
  password: ''
})

const mfaForm = reactive({
  code: ''
})

const selectedMFAMethod = ref<'totp' | 'sms' | 'email'>('totp')
const availableMFAMethods = ref<Array<'totp' | 'sms' | 'email'>>(['totp', 'sms', 'email'])

const oauth2Providers = [
  { id: 'google', label: 'Google', icon: 'search' },
  { id: 'github', label: 'GitHub', icon: 'code' },
  { id: 'kakao', label: 'Kakao', icon: 'chat' },
  { id: 'naver', label: 'Naver', icon: 'globe' },
]

const handlePasswordLogin = async () => {
  loading.value = true
  try {
    await authStore.login({
      userId: passwordForm.userId,
      password: passwordForm.password
    })
    navigateTo('/channels')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  try {
    await authStore.register(registerForm)
    activeTab.value = 'password'
  } catch (error) {
    console.error('Register failed:', error)
  } finally {
    loading.value = false
  }
}

const handleOAuth2Login = async (provider: string) => {
  loading.value = true
  try {
    await authStore.loginWithOAuth2(provider)
  } catch (error) {
    console.error('OAuth2 login failed:', error)
  } finally {
    loading.value = false
  }
}

const handleMFAVerify = async () => {
  loading.value = true
  try {
    await authStore.verifyMFA({
      code: mfaForm.code,
      method: selectedMFAMethod.value
    })
    navigateTo('/channels')
  } catch (error) {
    console.error('MFA verification failed:', error)
  } finally {
    loading.value = false
  }
}

const handleCancelMFA = () => {
  activeTab.value = 'password'
  mfaForm.code = ''
}

const getMFAMethodLabel = (method: string) => {
  const labels = {
    totp: 'OTP 앱',
    sms: 'SMS',
    email: '이메일'
  }
  return labels[method as keyof typeof labels] || method
}

const quickLogin = async (userId: string) => {
  passwordForm.userId = userId
  passwordForm.password = 'password'
  await handlePasswordLogin()
}
</script>

