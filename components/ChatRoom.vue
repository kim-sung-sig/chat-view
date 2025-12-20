<template>
  <div class="flex flex-col h-full">
    <!-- 채팅방 헤더 -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ channelName }}</h2>
          <p class="text-sm text-gray-500">
            {{ channelStore.currentChannel?.memberCount || 0 }}명 참여 중
          </p>
        </div>
        
        <button class="p-2 hover:bg-gray-100 rounded-lg transition">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 메시지 목록 -->
    <div 
      ref="messageContainer"
      class="flex-1 overflow-y-auto p-6 space-y-4"
      @scroll="handleScroll"
    >
      <!-- 로딩 인디케이터 -->
      <div v-if="messageStore.isLoading" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- 메시지 없음 -->
      <div v-else-if="messages.length === 0" class="text-center py-12 text-gray-500">
        <p>메시지가 없습니다. 첫 메시지를 보내보세요!</p>
      </div>

      <!-- 메시지 리스트 -->
      <div v-else class="space-y-4">
        <MessageBubble
          v-for="message in messages"
          :key="message.messageId"
          :message="message"
          :is-own="message.senderId === authStore.user?.userId"
        />
      </div>

      <!-- 스크롤 끝 마커 -->
      <div ref="scrollEndMarker"></div>
    </div>

    <!-- 메시지 입력 -->
    <div class="bg-white border-t border-gray-200 px-6 py-4">
      <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
        <!-- 메시지 입력창 -->
        <div class="flex-1">
          <textarea
            v-model="messageInput"
            @keydown.enter.exact.prevent="sendMessage"
            placeholder="메시지를 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)"
            rows="1"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            style="max-height: 120px;"
          ></textarea>
        </div>

        <!-- 전송 버튼 -->
        <button
          type="submit"
          :disabled="!messageInput.trim() || sending"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span v-if="sending">전송 중...</span>
          <span v-else>전송</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageType } from '~/types/message';

const props = defineProps<{
  channelId: string
}>()

const authStore = useAuthStore()
const channelStore = useChannelStore()
const messageStore = useMessageStore()

const messageInput = ref('')
const sending = ref(false)
const messageContainer = ref<HTMLElement | null>(null)
const scrollEndMarker = ref<HTMLElement | null>(null)

// 메시지 목록
const messages = computed(() => {
  return messageStore.getMessagesByChannel(props.channelId).slice().reverse()
})

// 채널 이름
const channelName = computed(() => {
  return channelStore.currentChannel?.name || '채팅방'
})

// 메시지 전송
const sendMessage = async () => {
  if (!messageInput.value.trim() || sending.value) {
    return
  }

  const content = messageInput.value.trim()
  messageInput.value = ''
  sending.value = true

  try {
    await messageStore.sendMessage({
      channelId: props.channelId,
      senderId: authStore.user!.userId,
      senderName: authStore.user!.username,
      messageType: MessageType.TEXT,
      content
    })

    // 스크롤을 맨 아래로
    nextTick(() => {
      scrollToBottom()
    })
  } catch (error) {
    console.error('Failed to send message:', error)
    messageInput.value = content // 실패 시 입력 복원
    alert('메시지 전송에 실패했습니다.')
  } finally {
    sending.value = false
  }
}

// 스크롤 처리
const handleScroll = () => {
  if (!messageContainer.value) return
  
  const { scrollTop } = messageContainer.value
  
  // 맨 위에 도달하면 더 많은 메시지 로드
  if (scrollTop === 0 && messageStore.hasMoreMessages(props.channelId)) {
    loadMoreMessages()
  }
}

// 더 많은 메시지 로드
const loadMoreMessages = async () => {
  const cursor = messageStore['cursors'][props.channelId]
  if (cursor) {
    await messageStore.fetchMessages(props.channelId, cursor)
  }
}

// 맨 아래로 스크롤
const scrollToBottom = () => {
  scrollEndMarker.value?.scrollIntoView({ behavior: 'smooth' })
}

// WebSocket 메시지 수신 리스너
const handleWebSocketMessage = (event: CustomEvent) => {
  const message = event.detail
  if (message.channelId === props.channelId) {
    messageStore.addMessage(props.channelId, message)
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 채널 변경 시 메시지 로드
watch(() => props.channelId, async (newChannelId: string) => {
  if (newChannelId) {
    // 채널 상세 정보 로드
    await channelStore.fetchChannelDetail(newChannelId)
    
    // 메시지 로드
    await messageStore.fetchMessages(newChannelId)
    
    // 스크롤을 맨 아래로
    nextTick(() => {
      scrollToBottom()
    })
  }
}, { immediate: true })

// WebSocket 이벤트 리스너 등록
onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('ws-message', handleWebSocketMessage as EventListener)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('ws-message', handleWebSocketMessage as EventListener)
  }
})
</script>
