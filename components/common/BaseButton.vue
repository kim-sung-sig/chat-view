<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- 로딩 스피너 -->
    <LoadingSpinner v-if="loading" :size="spinnerSize" class="mr-2" />

    <!-- 아이콘 (왼쪽) -->
    <component
      v-if="iconLeft && !loading"
      :is="iconLeft"
      :class="iconClasses"
    />

    <!-- 버튼 텍스트 -->
    <span v-if="$slots.default">
      <slot />
    </span>

    <!-- 아이콘 (오른쪽) -->
    <component
      v-if="iconRight"
      :is="iconRight"
      :class="iconClasses"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonVariant, ButtonSize } from '~/types/ui'

// ============================================
// Props 정의
// ============================================
interface Props {
  /** 버튼 스타일 변형 */
  variant?: ButtonVariant
  /** 버튼 크기 */
  size?: ButtonSize
  /** 버튼 타입 */
  type?: 'button' | 'submit' | 'reset'
  /** 비활성화 여부 */
  disabled?: boolean
  /** 로딩 상태 */
  loading?: boolean
  /** 전체 너비 사용 */
  fullWidth?: boolean
  /** 왼쪽 아이콘 컴포넌트 */
  iconLeft?: any
  /** 오른쪽 아이콘 컴포넌트 */
  iconRight?: any
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
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
 * 버튼 클래스 계산
 */
const buttonClasses = computed(() => {
  const base = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `.trim().replace(/\s+/g, ' ')

  // 스타일 변형
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 active:bg-brand-800 shadow-sm',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 active:bg-gray-200',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 active:bg-danger-700 shadow-sm',
  }

  // 크기
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const width = props.fullWidth ? 'w-full' : ''

  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${width}`
})

/**
 * 아이콘 크기 클래스
 */
const iconClasses = computed(() => {
  const sizes: Record<ButtonSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return sizes[props.size]
})

/**
 * 스피너 크기
 */
const spinnerSize = computed(() => {
  const sizes: Record<ButtonSize, 'sm' | 'md' | 'lg'> = {
    sm: 'sm',
    md: 'sm',
    lg: 'md',
  }

  return sizes[props.size]
})

// ============================================
// Methods
// ============================================

/**
 * 클릭 이벤트 핸들러
 */
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
