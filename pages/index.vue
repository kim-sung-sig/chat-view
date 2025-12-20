<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md">
      <!-- 로고 및 타이틀 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">💬 Chat Platform</h1>
        <p class="text-gray-600">실시간 채팅 플랫폼에 오신 것을 환영합니다</p>
      </div>

      <!-- 로그인 카드 -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">로그인</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- 사용자 ID -->
          <div>
            <label for="userId" class="block text-sm font-medium text-gray-700 mb-2">
              사용자 ID
            </label>
            <input
              id="userId"
              v-model="userId"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="user1"
            />
          </div>

          <!-- 사용자 이름 -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              사용자 이름
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="홍길동"
            />
          </div>

          <!-- 로그인 버튼 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">로그인 중...</span>
            <span v-else>로그인</span>
          </button>
        </form>

        <!-- 안내 메시지 -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-900">
            <strong>개발 모드:</strong> JWT 인증 모듈 연동 전까지 임시 로그인을 사용합니다.
            사용자 ID와 이름을 입력하면 바로 채팅을 시작할 수 있습니다.
          </p>
        </div>

        <!-- 예시 계정 -->
        <div class="mt-4 space-y-2">
          <p class="text-sm text-gray-600">빠른 로그인:</p>
          <div class="flex gap-2">
            <button
              @click="quickLogin('user1', '사용자1')"
              class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
            >
              사용자1
            </button>
            <button
              @click="quickLogin('user2', '사용자2')"
              class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
            >
              사용자2
            </button>
            <button
              @click="quickLogin('user3', '사용자3')"
              class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
            >
              사용자3
            </button>
          </div>
        </div>
      </div>

      <!-- 푸터 -->
      <div class="text-center mt-8 text-sm text-gray-600">
        <p>채팅 플랫폼 v1.0.0</p>
        <p class="mt-1">Nuxt 3 + Vue 3 + TypeScript</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const userId = ref('')
const username = ref('')
const loading = ref(false)

// 로그인 처리
const handleLogin = async () => {
  if (!userId.value || !username.value) {
    return
  }

  loading.value = true
  
  try {
    // 임시 로그인 (JWT 모듈 연동 전)
    authStore.tempLogin(userId.value.trim(), username.value.trim())
    
    // 채널 목록 페이지로 이동
    await router.push('/channels')
  } catch (error) {
    console.error('Login failed:', error)
    alert('로그인에 실패했습니다.')
  } finally {
    loading.value = false
  }
}

// 빠른 로그인
const quickLogin = (id: string, name: string) => {
  userId.value = id
  username.value = name
  handleLogin()
}

// 이미 로그인된 경우 리다이렉트
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/channels')
  }
})
</script>
