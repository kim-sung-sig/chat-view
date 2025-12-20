<template>
  <div
    :class="avatarClasses"
    :title="name"
    class="relative"
  >
    <!-- 이미지가 있는 경우 -->
    <img
      v-if="src"
      :src="src"
      :alt="name"
      class="w-full h-full object-cover"
      @error="handleImageError"
    />

    <!-- 이미지가 없는 경우 이니셜 표시 -->
    <span
      v-else
      class="font-semibold text-white"
      :class="textSizeClass"
    >
      {{ initials }}
    </span>

    <!-- 온라인 상태 표시 -->
    <span
      v-if="showStatus && status"
      :class="statusClasses"
      class="absolute bottom-0 right-0 rounded-full border-2 border-white ring-2 ring-white"
      :title="statusText"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AvatarSize, OnlineStatus } from '~/types/ui'

// ============================================
// Props 정의
// ============================================
interface Props {
  /** 아바타 이미지 URL */
  src?: string
  /** 사용자 이름 */
  name: string
  /** 아바타 크기 */
  size?: AvatarSize
  /** 온라인 상태 */
  status?: OnlineStatus
  /** 상태 표시 여부 */
  showStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showStatus: false,
})

// ============================================
// State
// ============================================
const imageError = ref(false)

// ============================================
// Computed
// ============================================

/**
 * 이름의 이니셜 추출
 * 예: "홍길동" → "홍길", "John Doe" → "JD"
 */
const initials = computed(() => {
  if (!props.name) return '?'

  const words = props.name.trim().split(' ')

  // 한글인 경우 처음 2글자
  if (/[가-힣]/.test(props.name)) {
    return props.name.slice(0, 2)
  }

  // 영문인 경우 각 단어의 첫 글자
  return words
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

/**
 * 아바타 컨테이너 클래스
 */
const avatarClasses = computed(() => {
  const sizes: Record<AvatarSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full overflow-hidden
    bg-gradient-to-br from-brand-500 to-brand-600
    flex-shrink-0
  `.trim().replace(/\s+/g, ' ')

  return `${baseClasses} ${sizes[props.size]}`
})

/**
 * 텍스트 크기 클래스
 */
const textSizeClass = computed(() => {
  const sizes: Record<AvatarSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  return sizes[props.size]
})

/**
 * 상태 표시 클래스
 */
const statusClasses = computed(() => {
  if (!props.status) return ''

  const statuses: Record<OnlineStatus, string> = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-danger-500',
  }

  const sizes: Record<AvatarSize, string> = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  }

  return `${statuses[props.status]} ${sizes[props.size]}`
})

/**
 * 상태 텍스트
 */
const statusText = computed(() => {
  if (!props.status) return ''

  const texts: Record<OnlineStatus, string> = {
    online: '온라인',
    offline: '오프라인',
    away: '자리 비움',
    busy: '다른 용무 중',
  }

  return texts[props.status]
})

// ============================================
// Methods
// ============================================

/**
 * 이미지 로드 실패 처리
 */
const handleImageError = () => {
  imageError.value = true
}
</script>
