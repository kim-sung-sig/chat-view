<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 헤더 -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">💬 Chat Platform</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- 사용자 정보 -->
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {{ authStore.user?.username?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.username }}</p>
              <p class="text-xs text-gray-500">{{ authStore.user?.userId }}</p>
            </div>
          </div>
          
          <!-- 로그아웃 버튼 -->
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 채널 리스트 -->
      <aside class="w-80 bg-white border-r border-gray-200 flex flex-col">
        <!-- 채널 헤더 -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">채널</h2>
            <button
              @click="showCreateModal = true"
              class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              + 새 채널
            </button>
          </div>
          
          <!-- 검색 -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="채널 검색..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <!-- 채널 목록 -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="channelStore.isLoading" class="p-4 text-center text-gray-500">
            채널을 불러오는 중...
          </div>
          
          <div v-else-if="filteredChannels.length === 0" class="p-4 text-center text-gray-500">
            채널이 없습니다
          </div>
          
          <div v-else class="space-y-1 p-2">
            <button
              v-for="channel in filteredChannels"
              :key="channel.channelId"
              @click="selectChannel(channel)"
              :class="[
                'w-full p-3 rounded-lg text-left transition hover:bg-gray-50',
                selectedChannelId === channel.channelId ? 'bg-blue-50 border border-blue-200' : ''
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-medium text-gray-900 truncate">
                  {{ getChannelName(channel) }}
                </h3>
                <span class="text-xs text-gray-500">
                  {{ channel.channelType }}
                </span>
              </div>
              <p v-if="channel.lastMessage" class="text-sm text-gray-600 truncate">
                {{ channel.lastMessage.content }}
              </p>
              <p v-else class="text-sm text-gray-400">메시지가 없습니다</p>
            </button>
          </div>
        </div>
      </aside>

      <!-- 채팅 영역 -->
      <main class="flex-1 flex flex-col bg-gray-50">
        <ChatRoom v-if="selectedChannelId" :channel-id="selectedChannelId" />
        
        <div v-else class="flex-1 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <div class="text-6xl mb-4">💬</div>
            <p class="text-lg">채널을 선택하여 채팅을 시작하세요</p>
          </div>
        </div>
      </main>
    </div>

    <!-- 채널 생성 모달 -->
    <CreateChannelModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleChannelCreated"
    />
  </div>
</template>

<script setup lang="ts">
import type { Channel } from '~/types/channel'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const channelStore = useChannelStore()
const websocketStore = useWebSocketStore()
const router = useRouter()

const searchQuery = ref('')
const selectedChannelId = ref<string | null>(null)
const showCreateModal = ref(false)

// 필터링된 채널 목록
const filteredChannels = computed(() => {
  if (!searchQuery.value) {
    return channelStore.getChannels
  }
  
  const query = searchQuery.value.toLowerCase()
  return channelStore.getChannels.filter((channel: Channel) => {
    const name = getChannelName(channel).toLowerCase()
    return name.includes(query)
  })
})

// 채널 이름 가져오기
const getChannelName = (channel: Channel) => {
  if (channel.name) {
    return channel.name
  }
  if (channel.channelType === 'DIRECT') {
    return '일대일 채팅'
  }
  return `채널 ${channel.channelId.substring(0, 8)}`
}

// 채널 선택
const selectChannel = (channel: Channel) => {
  selectedChannelId.value = channel.channelId
}

// 채널 생성 완료
const handleChannelCreated = (channel: Channel) => {
  showCreateModal.value = false
  selectedChannelId.value = channel.channelId
  channelStore.fetchChannels(authStore.user!.userId)
}

// 로그아웃
const handleLogout = () => {
  websocketStore.disconnect()
  authStore.logout()
  router.push('/')
}

// 초기화
onMounted(async () => {
  if (!authStore.user) {
    router.push('/')
    return
  }
  
  // 채널 목록 로드
  await channelStore.fetchChannels(authStore.user.userId)
  
  // WebSocket 연결
  websocketStore.connect(authStore.user.userId)
})

onUnmounted(() => {
  // WebSocket 연결 해제
  websocketStore.disconnect()
})
</script>
