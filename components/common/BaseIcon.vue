<template>
  <component
    :is="component"
    :class="iconClasses"
    :aria-label="ariaLabel"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  // Navigation
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  Cog6ToothIcon,

  // Actions
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  LockClosedIcon,
  GlobeAltIcon,

  // Communication
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
  MicrophoneIcon,

  // Media
  PhotoIcon,
  DocumentIcon,
  FaceSmileIcon,

  // Status
  BellIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  ArrowLeftIcon,
  ArrowRightIcon,

  // System
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  SunIcon,
  MoonIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline'

import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  BellIcon as BellIconSolid,
} from '@heroicons/vue/24/solid'

// ============================================
// Props 정의
// ============================================
interface Props {
  /** 아이콘 이름 */
  name: string
  /** 아이콘 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** 솔리드 스타일 사용 */
  solid?: boolean
  /** 색상 클래스 (Tailwind) */
  color?: string
  /** 접근성 라벨 */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  solid: false,
  color: 'currentColor',
})

// ============================================
// 아이콘 맵
// ============================================
const iconMap = {
  // Navigation
  home: HomeIcon,
  chat: ChatBubbleLeftRightIcon,
  users: UserGroupIcon,
  settings: Cog6ToothIcon,

  // Actions
  plus: PlusIcon,
  edit: PencilIcon,
  delete: TrashIcon,
  close: XMarkIcon,
  check: CheckIcon,

  // Communication
  send: PaperAirplaneIcon,
  phone: PhoneIcon,
  video: VideoCameraIcon,
  microphone: MicrophoneIcon,

  // Media
  photo: PhotoIcon,
  document: DocumentIcon,
  emoji: FaceSmileIcon,

  // Status
  bell: BellIcon,
  search: MagnifyingGlassIcon,
  more: EllipsisVerticalIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,

  // System
  'chevron-down': ChevronDownIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  error: XCircleIcon,
  sun: SunIcon,
  moon: MoonIcon,
}

const iconMapSolid = {
  home: HomeIconSolid,
  chat: ChatBubbleLeftRightIconSolid,
  users: UserGroupIconSolid,
  settings: Cog6ToothIconSolid,
  bell: BellIconSolid,
}

// ============================================
// Computed
// ============================================

/**
 * 사용할 아이콘 컴포넌트
 */
const component = computed(() => {
  const map = props.solid ? iconMapSolid : iconMap
  return map[props.name as keyof typeof map] || iconMap['info']
})

/**
 * 아이콘 클래스
 */
const iconClasses = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }

  return `${sizes[props.size]} ${props.color}`
})
</script>

