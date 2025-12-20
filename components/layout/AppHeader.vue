<template>
  <header
    class="h-[var(--header-height)] bg-white dark:bg-workspace-sidebar border-b border-gray-200 dark:border-workspace-border"
  >
    <div class="h-full px-4 flex items-center justify-between">
      <!-- 왼쪽: 워크스페이스 정보 -->
      <div class="flex items-center gap-4">
        <!-- 워크스페이스 드롭다운 -->
        <BaseDropdown placement="left" width="w-64">
          <template #trigger="{ isOpen }">
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-workspace-hover transition-colors"
            >
              <span class="font-semibold text-gray-900 dark:text-workspace-text">
                {{ currentWorkspace }}
              </span>
              <BaseIcon
                name="chevron-down"
                size="sm"
                :class="{ 'rotate-180': isOpen }"
                class="text-gray-500 transition-transform"
              />
            </button>
          </template>

          <template #default="{ close }">
            <BaseDropdownItem
              icon="users"
              @click="close"
            >
              워크스페이스 설정
            </BaseDropdownItem>
            <BaseDropdownItem
              icon="plus"
              @click="handleCreateWorkspace"
            >
              새 워크스페이스
            </BaseDropdownItem>
            <div class="border-t border-gray-200 dark:border-workspace-border my-1" />
            <BaseDropdownItem
              icon="settings"
              to="/settings"
              @click="close"
            >
              환경설정
            </BaseDropdownItem>
          </template>
        </BaseDropdown>

        <!-- 현재 채널/DM 이름 -->
        <div v-if="currentChannel" class="flex items-center gap-2">
          <span class="text-gray-400 dark:text-workspace-text-muted">#</span>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-workspace-text">
            {{ currentChannel }}
          </h1>
        </div>
      </div>

      <!-- 오른쪽: 액션 버튼들 -->
      <div class="flex items-center gap-2">
        <!-- 검색 -->
        <BaseTooltip text="검색 (Ctrl+K)">
          <BaseButton
            variant="ghost"
            size="sm"
            @click="handleSearch"
          >
            <BaseIcon name="search" size="sm" />
          </BaseButton>
        </BaseTooltip>

        <!-- 알림 -->
        <BaseTooltip text="알림">
          <BaseButton
            variant="ghost"
            size="sm"
            @click="handleNotifications"
          >
            <BaseIcon name="bell" size="sm" />
            <span
              v-if="unreadCount > 0"
              class="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"
            />
          </BaseButton>
        </BaseTooltip>

        <!-- 다크모드 토글 -->
        <BaseTooltip :text="isDarkMode ? '라이트 모드' : '다크 모드'">
          <BaseButton
            variant="ghost"
            size="sm"
            @click="toggleDarkMode"
          >
            <BaseIcon :name="isDarkMode ? 'sun' : 'moon'" size="sm" />
          </BaseButton>
        </BaseTooltip>

        <!-- 사용자 메뉴 -->
        <BaseDropdown placement="right" width="w-56">
          <template #trigger>
            <button class="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
            <div class="px-4 py-3 border-b border-gray-200 dark:border-workspace-border">
              <p class="text-sm font-medium text-gray-900 dark:text-workspace-text">
                {{ currentUser?.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-workspace-text-muted">
                {{ currentUser?.email }}
              </p>
            </div>

            <BaseDropdownItem
              icon="users"
              to="/profile"
              @click="close"
            >
              프로필
            </BaseDropdownItem>
            <BaseDropdownItem
              icon="settings"
              to="/settings"
              @click="close"
            >
              설정
            </BaseDropdownItem>
            <div class="border-t border-gray-200 dark:border-workspace-border my-1" />
            <BaseDropdownItem
              icon="arrow-right"
              danger
              @click="handleLogout"
            >
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

// ============================================
// Stores
// ============================================
const authStore = useAuthStore()
const UIStore = useUIStore()
const channelStore = useChannelStore()

const { currentUser } = storeToRefs(authStore)
const { isDarkMode } = storeToRefs(UIStore)
const { currentChannel } = storeToRefs(channelStore)

// ============================================
// Computed
// ============================================
const currentWorkspace = computed(() => {
  return '채팅 워크스페이스' // TODO: 실제 워크스페이스 데이터 연동
})

const unreadCount = computed(() => {
  return 0 // TODO: 실제 알림 카운트 연동
})

// ============================================
// Methods
// ============================================

/**
 * 검색 모달 열기
 */
const handleSearch = () => {
  // TODO: 검색 모달 구현
  console.log('검색 모달 열기')
}

/**
 * 알림 패널 토글
 */
const handleNotifications = () => {
  // TODO: 알림 패널 구현
  console.log('알림 패널 토글')
}

/**
 * 다크모드 토글
 */
const toggleDarkMode = () => {
  UIStore.toggleTheme()
}

/**
 * 워크스페이스 생성
 */
const handleCreateWorkspace = () => {
  // TODO: 워크스페이스 생성 모달
  console.log('워크스페이스 생성')
}

/**
 * 로그아웃
 */
const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/login')
}
</script>

