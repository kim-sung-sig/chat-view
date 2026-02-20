<script setup lang="ts">
/**
 * 로그인/회원가입 페이지
 */
import { ref, computed } from 'vue'
import { useAuthStore } from '~/store/auth'

definePageMeta({ layout: 'blank' })

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref<'login' | 'signup'>('login')

// 로그인 폼
const loginForm = ref({ identifier: '', password: '' })
// 회원가입 폼
const signupForm = ref({ email: '', password: '', confirmPassword: '', nickname: '' })

const isLoading = ref(false)
const error = ref('')
const successMsg = ref('')
const showPassword = ref(false)

// 로그인
const handleLogin = async () => {
  error.value = ''
  if (!loginForm.value.identifier.trim() || !loginForm.value.password.trim()) {
    error.value = '이메일(또는 아이디)과 비밀번호를 입력해주세요.'
    return
  }

  isLoading.value = true
  try {
    const result = await authStore.login(loginForm.value.identifier, loginForm.value.password)
    if (result.success) {
      // data store에 현재 유저 동기화
      if (authStore.currentUser) {
        const { useDataStore } = await import('~/store/data')
        const dataStore = useDataStore()
        dataStore.currentUser = authStore.currentUser
        dataStore.users[authStore.currentUser.id] = authStore.currentUser
      }
      await router.push('/')
    } else if (result.requiresMfa) {
      error.value = 'MFA 인증이 필요합니다. (현재 미지원)'
    } else {
      error.value = getErrorMessage(result.reason)
    }
  } catch (e: any) {
    error.value = getErrorMessage(e?.data?.message || e?.message)
  } finally {
    isLoading.value = false
  }
}

// 회원가입
const handleSignup = async () => {
  error.value = ''
  successMsg.value = ''

  if (!signupForm.value.email || !signupForm.value.password || !signupForm.value.nickname) {
    error.value = '모든 필드를 입력해주세요.'
    return
  }
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  if (signupForm.value.password.length < 8) {
    error.value = '비밀번호는 8자 이상이어야 합니다.'
    return
  }

  isLoading.value = true
  try {
    const { AuthService } = await import('~/services/api/auth.service')
    const authService = new AuthService()
    await authService.signup({
      email: signupForm.value.email,
      password: signupForm.value.password,
      nickname: signupForm.value.nickname,
    })
    successMsg.value = '회원가입이 완료되었습니다! 로그인해주세요.'
    activeTab.value = 'login'
    loginForm.value.identifier = signupForm.value.email
    signupForm.value = { email: '', password: '', confirmPassword: '', nickname: '' }
  } catch (e: any) {
    error.value = getErrorMessage(e?.data?.message || e?.message)
  } finally {
    isLoading.value = false
  }
}

const getErrorMessage = (msg?: string) => {
  if (!msg) return '오류가 발생했습니다. 다시 시도해주세요.'
  if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) return '아이디 또는 비밀번호가 올바르지 않습니다.'
  if (msg.includes('429') || msg.toLowerCase().includes('too many')) return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.'
  if (msg.includes('409') || msg.toLowerCase().includes('conflict')) return '이미 사용 중인 이메일입니다.'
  return msg
}

const switchTab = (tab: 'login' | 'signup') => {
  activeTab.value = tab
  error.value = ''
  successMsg.value = ''
}

// 비밀번호 강도
const pwStrengthScore = computed(() => {
  const pw = signupForm.value.password
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(4, score)
})
const pwStrengthClass = computed(() => ['', 'weak', 'fair', 'good', 'strong'][pwStrengthScore.value] ?? '')
const pwStrengthLabel = computed(() => ['', '약함', '보통', '좋음', '강함'][pwStrengthScore.value] ?? '')
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 로고 -->
      <div class="brand">
        <div class="brand-icon">💬</div>
        <h1 class="brand-name">Discode</h1>
      </div>

      <div class="login-box">
        <!-- 탭 -->
        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'login' }" @click="switchTab('login')">로그인</button>
          <button class="tab" :class="{ active: activeTab === 'signup' }" @click="switchTab('signup')">회원가입</button>
        </div>

        <!-- 성공 메시지 -->
        <div v-if="successMsg" class="success-banner">✓ {{ successMsg }}</div>

        <!-- ── 로그인 폼 ── -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="form">
          <div class="form-group">
            <label>이메일 또는 아이디 <span class="required">*</span></label>
            <input
              v-model="loginForm.identifier"
              type="text"
              placeholder="user@example.com"
              :disabled="isLoading"
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label>비밀번호 <span class="required">*</span></label>
            <div class="password-wrap">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="비밀번호를 입력하세요"
                :disabled="isLoading"
                autocomplete="current-password"
              />
              <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div v-if="error" class="error-banner">⚠️ {{ error }}</div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner" />
            {{ isLoading ? '로그인 중...' : '로그인' }}
          </button>

          <p class="switch-hint">
            계정이 없으신가요?
            <button type="button" class="link-btn" @click="switchTab('signup')">회원가입</button>
          </p>
        </form>

        <!-- ── 회원가입 폼 ── -->
        <form v-else @submit.prevent="handleSignup" class="form">
          <div class="form-group">
            <label>이메일 <span class="required">*</span></label>
            <input
              v-model="signupForm.email"
              type="email"
              placeholder="user@example.com"
              :disabled="isLoading"
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label>닉네임 <span class="required">*</span></label>
            <input
              v-model="signupForm.nickname"
              type="text"
              placeholder="사용할 닉네임"
              :disabled="isLoading"
              autocomplete="nickname"
            />
          </div>

          <div class="form-group">
            <label>비밀번호 <span class="required">*</span></label>
            <div class="password-wrap">
              <input
                v-model="signupForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="8자 이상"
                :disabled="isLoading"
                autocomplete="new-password"
              />
              <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>비밀번호 확인 <span class="required">*</span></label>
            <input
              v-model="signupForm.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호를 다시 입력"
              :disabled="isLoading"
              autocomplete="new-password"
            />
          </div>

          <!-- 비밀번호 강도 표시 -->
          <div v-if="signupForm.password" class="pw-strength">
            <div class="pw-strength-bar">
              <div
                class="pw-strength-fill"
                :class="pwStrengthClass"
                :style="{ width: `${pwStrengthScore * 25}%` }"
              />
            </div>
            <span class="pw-strength-label" :class="pwStrengthClass">{{ pwStrengthLabel }}</span>
          </div>

          <div v-if="error" class="error-banner">⚠️ {{ error }}</div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner" />
            {{ isLoading ? '처리 중...' : '회원가입' }}
          </button>

          <p class="switch-hint">
            이미 계정이 있으신가요?
            <button type="button" class="link-btn" @click="switchTab('login')">로그인</button>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1b2e 0%, #16213e 50%, #0f3460 100%);
  padding: 20px;
}
.login-container { width: 100%; max-width: 440px; display: flex; flex-direction: column; align-items: center; gap: 24px; }

.brand { display: flex; align-items: center; gap: 12px; }
.brand-icon { font-size: 40px; }
.brand-name { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; }

.login-box {
  width: 100%;
  background: var(--bg-secondary, #2b2d31);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}

.tabs { display: flex; gap: 0; margin-bottom: 24px; background: var(--bg-tertiary, #1e1f22); border-radius: 8px; padding: 4px; }
.tab { flex: 1; background: none; border: none; color: var(--c-text-muted, #949ba4); padding: 8px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.15s, color 0.15s; }
.tab.active { background: var(--brand-experiment, #5865f2); color: #fff; }

.form { display: flex; flex-direction: column; gap: 16px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--c-text-muted, #949ba4); letter-spacing: 0.4px; }
.required { color: var(--c-danger, #da373c); }
.form-group input {
  background: var(--bg-tertiary, #1e1f22);
  border: 1px solid var(--bg-modifier-accent, #3a3c40);
  border-radius: 6px;
  color: var(--c-text-normal, #dbdee1);
  font-size: 15px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}
.form-group input:focus { border-color: var(--brand-experiment, #5865f2); }
.form-group input:disabled { opacity: 0.5; cursor: not-allowed; }

.password-wrap { position: relative; }
.password-wrap input { padding-right: 42px; }
.toggle-pw { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.6; padding: 0; }
.toggle-pw:hover { opacity: 1; }

/* 비밀번호 강도 */
.pw-strength { display: flex; align-items: center; gap: 8px; }
.pw-strength-bar { flex: 1; height: 4px; background: var(--bg-modifier-accent); border-radius: 2px; overflow: hidden; }
.pw-strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
.pw-strength-fill.weak { background: var(--c-danger, #da373c); }
.pw-strength-fill.fair { background: var(--c-warning, #faa61a); }
.pw-strength-fill.good { background: #23a559; }
.pw-strength-fill.strong { background: #23d18b; }
.pw-strength-label { font-size: 11px; font-weight: 600; min-width: 36px; }
.pw-strength-label.weak { color: var(--c-danger); }
.pw-strength-label.fair { color: var(--c-warning); }
.pw-strength-label.good, .pw-strength-label.strong { color: #23a559; }

/* 버튼 */
.submit-btn {
  background: var(--brand-experiment, #5865f2);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s, opacity 0.15s;
  margin-top: 4px;
}
.submit-btn:hover:not(:disabled) { background: #4752c4; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 에러/성공 */
.error-banner { background: #f23f4215; border: 1px solid #f23f4240; color: #f23f42; border-radius: 6px; padding: 10px 14px; font-size: 13px; }
.success-banner { background: #23a55920; border: 1px solid #23a55940; color: #23a559; border-radius: 6px; padding: 10px 14px; font-size: 13px; margin-bottom: 8px; }

.switch-hint { font-size: 13px; color: var(--c-text-muted); text-align: center; }
.link-btn { background: none; border: none; color: var(--brand-experiment, #5865f2); cursor: pointer; font-size: 13px; font-weight: 600; padding: 0; }
.link-btn:hover { text-decoration: underline; }
</style>
