<template>
  <button
    :class="itemClasses"
    class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group"
    @click="handleClick"
  >
    <!-- 사용자 아바타 -->
    <UserAvatar
      :src="dm.user.avatar"
      :name="dm.user.name"
      size="xs"
      :status="dm.user.status"
      show-status
    />

    <!-- 사용자 이름 -->
    <span class="flex-1 text-sm truncate">
      {{ dm.user.name }}
    </span>

    <!-- 언급 수 -->
    <span
      v-if="dm.mentionCount && dm.mentionCount > 0"
      class="px-2 py-0.5 text-xs font-bold text-white bg-danger-500 rounded-full"
    >
      {{ dm.mentionCount }}
    </span>

    <!-- 읽지 않은 메시지 수 -->
    <span
      v-else-if="dm.unreadCount && dm.unreadCount > 0"
      class="px-2 py-0.5 text-xs font-medium text-brand-700 dark:text-workspace-text bg-white dark:bg-workspace-hover rounded-full"
    >
      {{ dm.unreadCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ============================================
// Props 정의
// ============================================
interface Props {
  dm: {
    id: string
    user: {
      id: string
      name: string
      avatar?: string
      status?: 'online' | 'away' | 'busy' | 'offline'
    }
    unreadCount?: number
    mentionCount?: number
  }
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

// ============================================
// Emits 정의
// ============================================
const emit = defineEmits<{
  click: []
}>()

// ============================================
// Computed
// ============================================
const itemClasses = computed(() => {
  if (props.isActive) {
    return 'bg-brand-600 dark:bg-workspace-hover text-white dark:text-workspace-text font-semibold'
  }

  if (props.dm.unreadCount && props.dm.unreadCount > 0) {
    return 'text-white dark:text-workspace-text font-semibold hover:bg-brand-600 dark:hover:bg-workspace-hover'
  }

  return 'text-brand-200 dark:text-workspace-text-muted hover:bg-brand-600 dark:hover:bg-workspace-hover hover:text-white dark:hover:text-workspace-text'
})

// ============================================
// Methods
// ============================================
const handleClick = () => {
  emit('click')
}
</script>

