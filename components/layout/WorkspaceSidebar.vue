<template>
  <aside class="w-60 bg-secondary dark:bg-discord-sidebar flex flex-col border-r border-border dark:border-discord-hover">
    <!-- 워크스페이스 헤더 -->
    <div class="h-12 px-4 flex items-center justify-between border-b border-border dark:border-discord-hover shadow-sm">
      <h1 class="font-bold text-foreground truncate">워크스페이스</h1>
      <BaseTooltip text="새 채널">
        <button
          @click="handleCreateChannel"
          class="p-1.5 rounded hover:bg-accent transition-colors"
        >
          <BaseIcon name="plus" size="sm" class="text-muted-foreground" />
        </button>
      </BaseTooltip>
    </div>

    <!-- 채널 목록 -->
    <div class="flex-1 overflow-y-auto scrollbar-thin py-2">
      <!-- 채널 섹션 -->
      <div class="mb-4">
        <button
          class="w-full px-3 py-1 flex items-center justify-between hover:bg-accent transition-colors group"
          @click="channelsExpanded = !channelsExpanded"
        >
          <div class="flex items-center gap-1.5">
            <BaseIcon
              name="chevron-down"
              size="sm"
              :class="{ '-rotate-90': !channelsExpanded }"
              class="text-muted-foreground transition-transform"
            />
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              채널
            </span>
          </div>
          <button
            @click.stop="handleCreateChannel"
            class="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-accent-foreground/10 transition-opacity"
          >
            <BaseIcon name="plus" size="sm" class="text-muted-foreground" />
          </button>
        </button>

        <nav v-show="channelsExpanded" class="mt-1 space-y-0.5 px-2">
          <ChannelItem
            v-for="channel in channels"
            :key="channel.channelId"
            :channel="channel"
            :is-active="currentChannelId === channel.channelId"
            @click="handleSelectChannel(channel.channelId)"
          />
          <div v-if="channels.length === 0" class="px-2 py-2 text-xs text-muted-foreground">
            채널이 없습니다
          </div>
        </nav>
      </div>

      <!-- 다이렉트 메시지 섹션 -->
      <div>
        <button
          class="w-full px-3 py-1 flex items-center justify-between hover:bg-accent transition-colors group"
          @click="dmsExpanded = !dmsExpanded"
        >
          <div class="flex items-center gap-1.5">
            <BaseIcon
              name="chevron-down"
              size="sm"
              :class="{ '-rotate-90': !dmsExpanded }"
              class="text-muted-foreground transition-transform"
            />
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              다이렉트 메시지
            </span>
          </div>
          <button
            @click.stop="handleCreateDM"
            class="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-accent-foreground/10 transition-opacity"
          >
            <BaseIcon name="plus" size="sm" class="text-muted-foreground" />
          </button>
        </button>

        <nav v-show="dmsExpanded" class="mt-1 space-y-0.5 px-2">
          <DMItem
            v-for="dm in directMessages"
            :key="dm.id"
            :dm="dm"
            :is-active="currentChannelId === dm.id"
            @click="handleSelectDM(dm.id)"
          />
          <div v-if="directMessages.length === 0" class="px-2 py-2 text-xs text-muted-foreground">
            DM이 없습니다
          </div>
        </nav>
      </div>
    </div>

    <!-- 하단 사용자 정보 -->
    <div class="p-2 bg-secondary-foreground/5 dark:bg-discord-bg border-t border-border dark:border-discord-hover">
      <div class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent transition-colors">
        <UserAvatar
          :src="currentUser?.avatar"
          :name="currentUser?.name || 'User'"
          size="sm"
          :status="currentUser?.status"
          show-status
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-foreground truncate">
            {{ currentUser?.name || 'User' }}
          </p>
          <p class="text-xs text-muted-foreground truncate">
            {{ statusText }}
          </p>
        </div>
        <BaseTooltip text="설정">
          <button
            class="p-1.5 rounded hover:bg-accent transition-colors"
            @click="navigateTo('/settings')"
          >
            <BaseIcon name="settings" size="sm" class="text-muted-foreground" />
          </button>
        </BaseTooltip>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useChannelStore } from '~/stores/channel'
import { useUIStore } from '~/stores/ui'

const authStore = useAuthStore()
const channelStore = useChannelStore()
const UIStore = useUIStore()

const { currentUser } = storeToRefs(authStore)
const { channels, directMessages, currentChannelId } = storeToRefs(channelStore)

const channelsExpanded = ref(true)
const dmsExpanded = ref(true)

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

const handleCreateChannel = () => {
  UIStore.openModal('createChannel')
}

const handleCreateDM = () => {
  console.log('DM 생성')
}

const handleSelectChannel = async (channelId: string) => {
  await channelStore.fetchChannelDetail(channelId)
  navigateTo(`/channels/${channelId}`)
}

const handleSelectDM = async (dmId: string) => {
  await channelStore.fetchChannelDetail(dmId)
  navigateTo(`/dm/${dmId}`)
}
</script>

