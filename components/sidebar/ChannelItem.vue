<template>
  <button
    :class="itemClasses"
    class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors group"
    @click="handleClick"
  >
    <!-- 채널 아이콘 -->
    <span class="text-brand-200 dark:text-workspace-text-muted group-hover:text-white">
      #
    </span>

    <!-- 채널 이름 -->
    <span class="flex-1 text-sm truncate">
      {{ channel.name }}
    </span>

    <!-- 언급 수 -->
    <span
      v-if="channel.mentionCount && channel.mentionCount > 0"
      class="px-2 py-0.5 text-xs font-bold text-white bg-danger-500 rounded-full"
    >
      {{ channel.mentionCount }}
    </span>

    <!-- 읽지 않은 메시지 수 -->
    <span
      v-else-if="channel.unreadCount && channel.unreadCount > 0"
      class="px-2 py-0.5 text-xs font-medium text-brand-700 dark:text-workspace-text bg-white dark:bg-workspace-hover rounded-full"
    >
      {{ channel.unreadCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Channel } from '~/types/channel'

// ============================================
// Props 정의
// ============================================
interface Props {
  channel: Channel
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

  if (props.channel.unreadCount && props.channel.unreadCount > 0) {
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

