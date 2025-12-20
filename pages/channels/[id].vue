<template>
  <NuxtLayout name="default">
    <div class="h-full flex flex-col bg-background dark:bg-discord-bg">
      <!-- 채널 헤더 -->
      <div class="h-12 border-b border-border dark:border-discord-hover px-4 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground text-xl font-semibold">#</span>
            <h1 class="text-base font-semibold text-foreground truncate">
              {{ channel?.name || '채널' }}
            </h1>
          </div>
          <div v-if="channel?.description" class="hidden md:block">
            <span class="text-sm text-muted-foreground">{{ channel.description }}</span>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <!-- 멤버 보기 -->
          <BaseTooltip text="멤버">
            <button
              @click="showMembers = !showMembers"
              class="p-2 rounded hover:bg-accent transition-colors"
            >
              <BaseIcon name="users" size="sm" class="text-muted-foreground" />
            </button>
          </BaseTooltip>

          <!-- 검색 -->
          <BaseTooltip text="검색">
            <button
              @click="handleSearch"
              class="p-2 rounded hover:bg-accent transition-colors"
            >
              <BaseIcon name="search" size="sm" class="text-muted-foreground" />
            </button>
          </BaseTooltip>

          <!-- 채널 설정 -->
          <BaseTooltip text="채널 설정">
            <button
              @click="handleChannelSettings"
              class="p-2 rounded hover:bg-accent transition-colors"
            >
              <BaseIcon name="settings" size="sm" class="text-muted-foreground" />
            </button>
          </BaseTooltip>
        </div>
      </div>

      <!-- 메인 컨텐츠 -->
      <div class="flex-1 flex min-h-0">
        <!-- 메시지 영역 -->
        <div class="flex-1 flex flex-col min-w-0">
          <!-- 메시지 목록 -->
          <div class="flex-1 overflow-y-auto scrollbar-thin" ref="messageContainer">
            <div class="p-4 space-y-4">
              <!-- 채널 시작 배너 -->
              <div class="pb-4">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <span class="text-3xl font-bold text-primary">#</span>
                </div>
                <h2 class="text-2xl font-bold text-foreground mb-2">
                  #{{ channel?.name }} 채널에 오신 것을 환영합니다!
                </h2>
                <p class="text-muted-foreground">
                  {{ channel?.description || '이 채널의 시작입니다.' }}
                </p>
                <div class="mt-4 flex gap-2">
                  <span class="text-xs text-muted-foreground">
                    👥 {{ channel?.memberCount || 0 }}명의 멤버
                  </span>
                  <span class="text-xs text-muted-foreground">
                    📅 {{ formatDate(channel?.createdAt) }} 생성
                  </span>
                </div>
              </div>

              <!-- 로딩 -->
              <div v-if="loading" class="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>

              <!-- 메시지 목록 -->
              <div v-else-if="messages.length > 0" class="space-y-4">
                <MessageBubble
                  v-for="message in messages"
                  :key="message.messageId"
                  :message="message"
                  :is-own="message.senderId === currentUser?.userId"
                />
              </div>

              <!-- 빈 상태 -->
              <div v-else class="flex flex-col items-center justify-center py-16 text-center">
                <div class="w-20 h-20 rounded-full bg-secondary dark:bg-discord-sidebar flex items-center justify-center mb-4">
                  <BaseIcon name="chat" size="xl" class="text-muted-foreground" />
                </div>
                <h3 class="text-lg font-medium text-foreground mb-2">
                  대화를 시작해보세요!
                </h3>
                <p class="text-sm text-muted-foreground">
                  첫 메시지를 보내보세요
                </p>
              </div>
            </div>
          </div>

          <!-- 메시지 입력 -->
          <div class="p-4 border-t border-border dark:border-discord-hover flex-shrink-0">
            <MessageInput
              v-model="messageText"
              :disabled="!channel"
              :placeholder="`#${channel?.name || '채널'}에 메시지 보내기`"
              @send="handleSendMessage"
            />
          </div>
        </div>

        <!-- 멤버 사이드바 -->
        <aside
          v-if="showMembers"
          class="w-60 bg-secondary dark:bg-discord-sidebar border-l border-border dark:border-discord-hover flex-shrink-0"
        >
          <div class="p-4">
            <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              멤버 — {{ channel?.memberCount || 0 }}
            </h3>

            <!-- 임시 멤버 리스트 -->
            <div class="space-y-2">
              <div
                v-for="i in Math.min(channel?.memberCount || 0, 20)"
                :key="i"
                class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent transition-colors cursor-pointer"
              >
                <UserAvatar
                  :name="`User ${i}`"
                  size="xs"
                  status="online"
                  show-status
                />
                <span class="text-sm text-foreground">User {{ i }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useChannelStore } from '~/stores/channel'
import { useMessageStore } from '~/stores/message'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const authStore = useAuthStore()
const channelStore = useChannelStore()
const messageStore = useMessageStore()

const { currentUser } = storeToRefs(authStore)
const { currentChannel: channel } = storeToRefs(channelStore)
const { messages, loading } = storeToRefs(messageStore)

const messageText = ref('')
const messageContainer = ref<HTMLElement | null>(null)
const showMembers = ref(true)

const channelId = computed(() => route.params.id as string)

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const handleSendMessage = () => {
  if (!messageText.value.trim() || !channel.value) return

  messageStore.sendMessage({
    channelId: channel.value.channelId,
    content: messageText.value.trim()
  })

  messageText.value = ''
}

const handleSearch = () => {
  console.log('검색')
}

const handleChannelSettings = () => {
  console.log('채널 설정')
}

onMounted(async () => {
  if (channelId.value) {
    await channelStore.fetchChannelDetail(channelId.value)
    await messageStore.fetchMessages(channelId.value)
  }
})

watch(channelId, async (newId) => {
  if (newId) {
    await channelStore.fetchChannelDetail(newId)
    await messageStore.fetchMessages(newId)
  }
})
</script>

