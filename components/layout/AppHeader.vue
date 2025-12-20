<template>
  <header class="h-12 flex-shrink-0 bg-card dark:bg-discord-sidebar border-b border-border dark:border-discord-hover shadow-sm">
    <div class="h-full px-4 flex items-center justify-between gap-4">
      <!-- 왼쪽: 채널 정보 -->
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <div v-if="currentChannel" class="flex items-center gap-2 min-w-0">
          <span class="text-muted-foreground text-xl font-semibold">#</span>
          <h1 class="text-base font-semibold text-foreground truncate">
            {{ currentChannel }}
          </h1>
        </div>
        <div v-else class="flex items-center gap-2">
          <BaseIcon name="home" size="sm" class="text-muted-foreground" />
          <h1 class="text-base font-semibold text-foreground">
            {{ currentWorkspace }}
          </h1>
        </div>
      </div>

      <!-- 오른쪽: 액션 버튼들 -->
      <div class="flex items-center gap-1">
        <!-- 검색 -->
        <BaseTooltip text="검색 (Ctrl+K)">
          <button
            @click="handleSearch"
            class="p-2 rounded hover:bg-accent transition-colors"
          >
            <BaseIcon name="search" size="sm" class="text-muted-foreground hover:text-foreground" />
          </button>
        </BaseTooltip>

        <!-- 알림 -->
        <BaseTooltip text="알림">
          <button
            @click="handleNotifications"
            class="p-2 rounded hover:bg-accent transition-colors relative"
          >
            <BaseIcon name="bell" size="sm" class="text-muted-foreground hover:text-foreground" />
            <span
              v-if="unreadCount > 0"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-card"
            />
          </button>
        </BaseTooltip>

        <!-- 다크모드 토글 -->
        <BaseTooltip :text="isDarkMode ? '라이트 모드' : '다크 모드'">
          <button
            @click="toggleDarkMode"
            class="p-2 rounded hover:bg-accent transition-colors"
          >
            <BaseIcon
              :name="isDarkMode ? 'sun' : 'moon'"
              size="sm"
              class="text-muted-foreground hover:text-foreground"
            />
          </button>
        </BaseTooltip>

        <!-- 사용자 메뉴 -->
        <BaseDropdown placement="bottom-end">
          <template #trigger>
            <button class="p-1 rounded hover:bg-accent transition-colors">
              <UserAvatar
                :src="currentUser?.avatar"
                :name="currentUser?.name || 'User'"
                size="sm"
                :status="currentUser?.status"
                show-status
              />
            </button>
          </template>

          <template #default="{ close }">
            <div class="px-3 py-2 border-b border-border">
              <p class="text-sm font-semibold text-foreground">
                {{ currentUser?.name || 'User' }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ currentUser?.email || '' }}
              </p>
            </div>

            <BaseDropdownItem @click="() => { navigateTo('/profile'); close() }">
              <BaseIcon name="users" size="sm" />
              프로필
            </BaseDropdownItem>
            <BaseDropdownItem @click="() => { navigateTo('/settings'); close() }">
              <BaseIcon name="settings" size="sm" />
              설정
            </BaseDropdownItem>
            <div class="border-t border-border my-1" />
            <BaseDropdownItem @click="handleLogout" class="text-red-600 dark:text-red-400">
              <BaseIcon name="arrow-right" size="sm" />
              로그아웃
            </BaseDropdownItem>
          </template>
        </BaseDropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useUIStore } from '~/stores/ui'
import { useChannelStore } from '~/stores/channel'

const authStore = useAuthStore()
const UIStore = useUIStore()
const channelStore = useChannelStore()

const { currentUser } = storeToRefs(authStore)
const { isDarkMode } = storeToRefs(UIStore)
const { currentChannel } = storeToRefs(channelStore)

const currentWorkspace = computed(() => {
  return '채팅 워크스페이스'
})

const unreadCount = computed(() => {
  return 0
})

const handleSearch = () => {
  console.log('검색 모달 열기')
}

const handleNotifications = () => {
  console.log('알림 패널 토글')
}

const toggleDarkMode = () => {
  UIStore.toggleTheme()
}

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/login')
}
</script>

