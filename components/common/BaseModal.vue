<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <!-- 배경 오버레이 -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <!-- 모달 컨테이너 -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel :class="panelClasses">
              <!-- 헤더 -->
              <div v-if="title || closeable" class="flex items-center justify-between mb-4">
                <DialogTitle
                  v-if="title"
                  class="text-lg font-semibold text-gray-900"
                >
                  {{ title }}
                </DialogTitle>

                <button
                  v-if="closeable"
                  @click="handleClose"
                  class="ml-auto text-gray-400 hover:text-gray-500 transition-colors rounded-lg p-1 hover:bg-gray-100"
                  aria-label="모달 닫기"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>

              <!-- 콘텐츠 -->
              <div :class="contentClasses">
                <slot />
              </div>

              <!-- 푸터 (있는 경우) -->
              <div v-if="$slots.footer" class="mt-6 flex items-center justify-end gap-3">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { ModalSize } from '~/types/ui'

// ============================================
// Props 정의
// ============================================
interface Props {
  /** 모달 열림 상태 */
  isOpen: boolean
  /** 모달 제목 */
  title?: string
  /** 모달 크기 */
  size?: ModalSize
  /** 닫기 버튼 표시 여부 */
  closeable?: boolean
  /** 컨텐츠 패딩 제거 */
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeable: true,
  noPadding: false,
})

// ============================================
// Emits 정의
// ============================================
const emit = defineEmits<{
  close: []
}>()

// ============================================
// Computed
// ============================================

/**
 * 패널 클래스 계산
 */
const panelClasses = computed(() => {
  const sizes: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  }

  const baseClasses = `
    w-full transform overflow-hidden rounded-2xl
    bg-white p-6 text-left align-middle
    shadow-xl transition-all
  `.trim().replace(/\s+/g, ' ')

  return `${baseClasses} ${sizes[props.size]}`
})

/**
 * 컨텐츠 클래스
 */
const contentClasses = computed(() => {
  return props.noPadding ? '' : ''
})

// ============================================
// Methods
// ============================================

/**
 * 모달 닫기 핸들러
 */
const handleClose = () => {
  if (props.closeable) {
    emit('close')
  }
}
</script>
