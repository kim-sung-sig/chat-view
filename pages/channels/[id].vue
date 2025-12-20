<template>
  <NuxtLayout name="default">
    <div class="h-full flex flex-col bg-white dark:bg-workspace-bg">
      <!-- 채널 헤더 -->
      <div class="h-16 border-b border-gray-200 dark:border-workspace-border px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-gray-900 dark:text-workspace-text">
            # {{ currentChannel?.name || '채널' }}
          </h1>
          <span v-if="currentChannel?.description" class="text-sm text-gray-500 dark:text-workspace-text-muted">
            {{ currentChannel.description }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- 멤버 수 -->
          <BaseButton variant="ghost" size="sm" @click="showMembers">
            <BaseIcon name="users" size="sm" />
            <span class="ml-1">{{ memberCount }}</span>
          </BaseButton>

          <!-- 채널 설정 -->
          <BaseButton variant="ghost" size="sm" @click="showChannelSettings">
            <BaseIcon name="settings" size="sm" />
          </BaseButton>
        </div>
      </div>

      <!-- 메시지 영역 -->
      <div class="flex-1 overflow-y-auto" ref="messageContainer">
        <div class="max-w-4xl mx-auto py-4 px-6 space-y-4">
          <!-- 로딩 -->
          <div v-if="loading" class="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>

          <!-- 메시지 목록 -->
          <div v-else-if="messages.length > 0">
            <MessageBubble
              v-for="message in messages"
              :key="message.messageId"
              :message="message"
              :is-own="message.senderId === currentUser?.userId"
            />
          </div>

          <!-- 빈 상태 -->
          <div v-else class="flex flex-col items-center justify-center py-16 text-center">
            <BaseIcon name="chat" size="xl" class="text-gray-300 dark:text-workspace-text-muted mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-workspace-text mb-2">
              아직 메시지가 없습니다
            </h3>
            <p class="text-sm text-gray-500 dark:text-workspace-text-muted">
              첫 메시지를 보내보세요!
            </p>
          </div>
        </div>
      </div>

      <!-- 메시지 입력 -->
      <div class="border-t border-gray-200 dark:border-workspace-border p-4">
        <MessageInput
          v-model="messageText"
          :disabled="!currentChannel"
          :placeholder="`#${currentChannel?.name || '채널'}에 메시지 보내기`"
          @send="handleSendMessage"
          @upload="handleFileUpload"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useChannelStore } from '~/stores/channel'
import { useMessageStore } from '~/stores/message'
import { useWebSocketStore } from '~/stores/websocket'

// ============================================
// Middleware
// ============================================
definePageMeta({
  middleware: 'auth'
})

// ============================================
// Stores
// ============================================
const route = useRoute()
const authStore = useAuthStore()
const channelStore = useChannelStore()
const messageStore = useMessageStore()
const wsStore = useWebSocketStore()

const { currentUser } = storeToRefs(authStore)
const { currentChannel } = storeToRefs(channelStore)
const { messages, loading } = storeToRefs(messageStore)

// ============================================
// State
// ============================================
const messageText = ref('')
const messageContainer = ref<HTMLElement | null>(null)

// ============================================
// Computed
// ============================================
const channelId = computed(() => route.params.id as string)

const memberCount = computed(() => {
  return currentChannel.value?.memberCount || 0
})

// ============================================
// Methods
// ============================================

/**
 * 메시지 전송
 */
const handleSendMessage = async () => {
  if (!messageText.value.trim() || !currentChannel.value) return

  try {
    await messageStore.sendMessage({
      channelId: currentChannel.value.channelId,
      content: messageText.value.trim(),
      senderId: currentUser.value!.userId,
      senderName: currentUser.value!.username,
      messageType: 'TEXT' as any,
    })

    messageText.value = ''

    // 스크롤을 맨 아래로
    await nextTick()
    scrollToBottom()
  } catch (error: any) {
    console.error('Failed to send message:', error)
    // TODO: 에러 토스트 표시
  }
}

/**
 * 파일 업로드
 */
const handleFileUpload = async (files: File[]) => {
  if (!currentChannel.value) return

  try {
    // TODO: 파일 업로드 구현
    console.log('Files to upload:', files)
  } catch (error: any) {
    console.error('Failed to upload files:', error)
  }
}

/**
 * 멤버 목록 표시
 */
const showMembers = () => {
  // TODO: 오른쪽 패널에 멤버 목록 표시
  console.log('Show members')
}

/**
 * 채널 설정 표시
 */
const showChannelSettings = () => {
  // TODO: 채널 설정 모달 표시
  console.log('Show channel settings')
}

/**
 * 스크롤을 맨 아래로
 */
const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

/**
 * 채널 데이터 로드
 */
const loadChannelData = async () => {
  if (!channelId.value) return

  try {
    // 채널 상세 정보 조회
    await channelStore.fetchChannelDetail(channelId.value)

    // 메시지 목록 조회
    await messageStore.fetchMessages(channelId.value)

    // WebSocket 연결
    if (!wsStore.isConnected) {
      await wsStore.connect()
    }

    // 채널 구독
    wsStore.subscribeToChannel(channelId.value)

    // 스크롤을 맨 아래로
    await nextTick()
    scrollToBottom()
  } catch (error: any) {
    console.error('Failed to load channel data:', error)
  }
}

// ============================================
// Lifecycle
// ============================================

onMounted(() => {
  loadChannelData()
})

onUnmounted(() => {
  // 채널 구독 해제
  if (channelId.value) {
    wsStore.unsubscribeFromChannel(channelId.value)
  }
})

// 채널 변경 감지
watch(channelId, () => {
  loadChannelData()
})

// 새 메시지 도착 시 스크롤
watch(() => messages.value.length, async () => {
  await nextTick()
  scrollToBottom()
})
</script>

