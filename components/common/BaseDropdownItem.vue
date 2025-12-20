<template>
  <component
    :is="component"
    :to="to"
    :href="href"
    :class="itemClasses"
    class="group flex items-center gap-3 px-4 py-2 text-sm transition-colors"
    @click="handleClick"
  >
    <!-- 아이콘 (왼쪽) -->
    <BaseIcon
      v-if="icon"
      :name="icon"
      size="sm"
      :class="iconColor"
    />

    <!-- 텍스트 -->
    <span class="flex-1">
      <slot />
    </span>

    <!-- 아이콘 (오른쪽) -->
    <BaseIcon
      v-if="iconRight"
      :name="iconRight"
      size="sm"
      class="text-gray-400"
    />

    <!-- 뱃지 -->
    <span
      v-if="badge"
      class="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-brand-100 text-brand-700"
    >
      {{ badge }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ============================================
// Props 정의
// ============================================
interface Props {
  /** 왼쪽 아이콘 */
  icon?: string
  /** 오른쪽 아이콘 */
  iconRight?: string
  /** 뱃지 텍스트 */
  badge?: string | number
  /** Nuxt Link to */
  to?: string | object
  /** 외부 링크 href */
  href?: string
  /** 위험한 액션 (빨간색) */
  danger?: boolean
  /** 비활성화 */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  danger: false,
  disabled: false,
})

// ============================================
// Emits 정의
// ============================================
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// ============================================
// Computed
// ============================================

/**
 * 사용할 컴포넌트 결정
 */
const component = computed(() => {
  if (props.to) return 'NuxtLink'
  if (props.href) return 'a'
  return 'button'
})

/**
 * 아이템 클래스
 */
const itemClasses = computed(() => {
  const base = 'text-left w-full focus:outline-none focus:bg-gray-50 dark:focus:bg-workspace-hover'

  if (props.disabled) {
    return `${base} opacity-50 cursor-not-allowed`
  }

  if (props.danger) {
    return `${base} text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/10`
  }

  return `${base} text-gray-700 dark:text-workspace-text hover:bg-gray-50 dark:hover:bg-workspace-hover`
})

/**
 * 아이콘 색상
 */
const iconColor = computed(() => {
  if (props.danger) return 'text-danger-500'
  return 'text-gray-400 group-hover:text-gray-500'
})

// ============================================
// Methods
// ============================================

/**
 * 클릭 이벤트 핸들러
 */
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

