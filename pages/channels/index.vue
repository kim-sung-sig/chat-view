<template>
  <NuxtLayout name="default">
    <div class="h-full flex items-center justify-center bg-gray-50 dark:bg-workspace-bg">
      <div class="text-center max-w-lg">
        <div class="mb-8">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-100 dark:bg-workspace-sidebar flex items-center justify-center">
            <BaseIcon name="chat" size="xl" class="text-brand-600 dark:text-brand-400" />
          </div>

          <h1 class="text-3xl font-bold text-gray-900 dark:text-workspace-text mb-3">
            채팅 시작하기
          </h1>

          <p class="text-gray-600 dark:text-workspace-text-muted mb-8">
            왼쪽 사이드바에서 채널을 선택하거나<br />
            새 채널을 만들어보세요!
          </p>
        </div>

        <div class="space-y-3">
          <BaseButton
            variant="primary"
            size="lg"
            full-width
            @click="handleCreateChannel"
          >
            <BaseIcon name="plus" size="sm" class="mr-2" />
            새 채널 만들기
          </BaseButton>

          <BaseButton
            variant="secondary"
            size="lg"
            full-width
            @click="handleBrowseChannels"
          >
            <BaseIcon name="search" size="sm" class="mr-2" />
            채널 둘러보기
          </BaseButton>
        </div>

        <!-- 최근 채널 -->
        <div v-if="recentChannels.length > 0" class="mt-12">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-workspace-text mb-4">
            최근 채널
          </h2>

          <div class="space-y-2">
            <button
              v-for="channel in recentChannels"
              :key="channel.channelId"
              @click="goToChannel(channel.channelId)"
              class="w-full p-4 rounded-lg border border-gray-200 dark:border-workspace-border
                     hover:border-brand-500 dark:hover:border-brand-500
                     hover:bg-brand-50 dark:hover:bg-workspace-hover
                     transition-colors text-left"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-brand-100 dark:bg-workspace-sidebar flex items-center justify-center">
                  <span class="text-brand-600 dark:text-brand-400 font-semibold">#</span>
                </div>

                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-gray-900 dark:text-workspace-text truncate">
                    {{ channel.name }}
                  </h3>
                  <p v-if="channel.description" class="text-sm text-gray-500 dark:text-workspace-text-muted truncate">
                    {{ channel.description }}
                  </p>
                </div>

                <BaseIcon name="arrow-right" size="sm" class="text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChannelStore } from '~/stores/channel'
import { useUIStore } from '~/stores/ui'

// ============================================
// Middleware
// ============================================
definePageMeta({
  middleware: 'auth'
})

// ============================================
// Stores
// ============================================
const channelStore = useChannelStore()
const UIStore = useUIStore()

const { channels } = storeToRefs(channelStore)

// ============================================
// Computed
// ============================================
const recentChannels = computed(() => {
  // 최근 5개 채널만 표시
  return channels.value.slice(0, 5)
})

// ============================================
// Methods
// ============================================

/**
 * 새 채널 만들기
 */
const handleCreateChannel = () => {
  UIStore.openModal('createChannel')
}

/**
 * 채널 둘러보기
 */
const handleBrowseChannels = () => {
  // TODO: 채널 브라우저 모달 표시
  console.log('Browse channels')
}

/**
 * 채널로 이동
 */
const goToChannel = (channelId: string) => {
  navigateTo(`/channels/${channelId}`)
}

// ============================================
// Lifecycle
// ============================================
onMounted(async () => {
  // 채널 목록 로드
  const authStore = useAuthStore()
  if (authStore.currentUser) {
    await channelStore.fetchChannels(authStore.currentUser.userId)
  }
})
</script>

