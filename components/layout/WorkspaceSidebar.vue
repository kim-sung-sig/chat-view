<template>
  <aside
    class="w-[var(--sidebar-width)] bg-brand-700 dark:bg-workspace-sidebar border-r border-brand-800 dark:border-workspace-border flex flex-col"
  >
    <!-- 채널 목록 -->
    <div class="flex-1 overflow-y-auto py-4">
      <!-- 채널 섹션 -->
      <div class="mb-6">
        <div class="px-4 mb-2 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-brand-100 dark:text-workspace-text-muted uppercase tracking-wide">
            채널
          </h2>
          <BaseButton
            variant="ghost"
            size="sm"
            @click="handleCreateChannel"
            class="text-brand-100 hover:text-white hover:bg-brand-600 dark:hover:bg-workspace-hover"
          >
            <BaseIcon name="plus" size="sm" />
          </BaseButton>
        </div>

        <nav class="space-y-1 px-2">
          <ChannelItem
            v-for="channel in channels"
            :key="channel.channelId"
            :channel="channel"
            :is-active="currentChannelId === channel.channelId"
            @click="handleSelectChannel(channel.channelId)"
          />
        </nav>
      </div>

      <!-- 다이렉트 메시지 섹션 -->
      <div>
        <div class="px-4 mb-2 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-brand-100 dark:text-workspace-text-muted uppercase tracking-wide">
            다이렉트 메시지
          </h2>
          <BaseButton
            variant="ghost"
            size="sm"
            @click="handleCreateDM"
            class="text-brand-100 hover:text-white hover:bg-brand-600 dark:hover:bg-workspace-hover"
          >
            <BaseIcon name="plus" size="sm" />
          </BaseButton>
        </div>

        <nav class="space-y-1 px-2">
          <DMItem
            v-for="dm in directMessages"
            :key="dm.id"
            :dm="dm"
            :is-active="currentChannelId === dm.id"
            @click="handleSelectDM(dm.id)"
          />
        </nav>
      </div>
    </div>

    <!-- 하단 사용자 정보 -->
    <div class="p-4 border-t border-brand-800 dark:border-workspace-border">
      <div class="flex items-center gap-3">
        <UserAvatar
          :src="currentUser?.avatar"
          :name="currentUser?.name || 'User'"
          size="sm"
          :status="currentUser?.status"
          show-status
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white dark:text-workspace-text truncate">
            {{ currentUser?.name }}
          </p>
          <p class="text-xs text-brand-200 dark:text-workspace-text-muted truncate">
            {{ statusText }}
          </p>
        </div>
        <BaseButton
          variant="ghost"
          size="sm"
          class="text-brand-100 hover:text-white hover:bg-brand-600 dark:hover:bg-workspace-hover"
        >
          <BaseIcon name="settings" size="sm" />
        </BaseButton>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useChannelStore } from '~/stores/channel'

// ============================================
// Stores
// ============================================
const authStore = useAuthStore()
const channelStore = useChannelStore()

const { currentUser } = storeToRefs(authStore)
const { channels, directMessages, currentChannelId } = storeToRefs(channelStore)

// ============================================
// Computed
// ============================================
const statusText = computed(() => {
  const status = currentUser.value?.status
  const statusMap = {
    online: '온라인',
    away: '자리 비움',
    busy: '다른 용무 중',
    offline: '오프라인',
  }
  return statusMap[status as keyof typeof statusMap] || '오프라인'
})

// ============================================
// Methods
// ============================================

/**
 * 채널 생성 모달 열기
 */
const handleCreateChannel = () => {
  // TODO: 채널 생성 모달 구현
  console.log('채널 생성')
}

/**
 * DM 생성 모달 열기
 */
const handleCreateDM = () => {
  // TODO: DM 생성 모달 구현
  console.log('DM 생성')
}

/**
 * 채널 선택
 */
const handleSelectChannel = async (channelId: string) => {
  await channelStore.fetchChannelDetail(channelId)
  navigateTo(`/channels/${channelId}`)
}

/**
 * DM 선택
 */
const handleSelectDM = async (dmId: string) => {
  await channelStore.fetchChannelDetail(dmId)
  navigateTo(`/dm/${dmId}`)
}
</script>

