<template>
  <div class="relative inline-block" ref="triggerRef">
    <!-- Trigger 요소 -->
    <div
      @mouseenter="show"
      @mouseleave="hide"
      @focus="show"
      @blur="hide"
    >
      <slot />
    </div>

    <!-- Tooltip 내용 -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-show="isVisible"
          ref="tooltipRef"
          :class="tooltipClasses"
          :style="tooltipStyle"
          class="absolute z-tooltip px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none dark:bg-gray-800"
          role="tooltip"
        >
          {{ text }}
          <slot name="content" />

          <!-- 화살표 -->
          <div :class="arrowClasses" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useFloating, offset, flip, shift, arrow } from '@floating-ui/vue'

// ============================================
// Props 정의
// ============================================
interface Props {
  /** 툴팁 텍스트 */
  text?: string
  /** 툴팁 위치 */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** 표시 지연시간 (ms) */
  delay?: number
  /** 비활성화 */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  delay: 200,
  disabled: false,
})

// ============================================
// State
// ============================================
const isVisible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)
let showTimeout: NodeJS.Timeout | null = null

// ============================================
// Floating UI
// ============================================
const { floatingStyles, placement: computedPlacement } = useFloating(
  triggerRef,
  tooltipRef,
  {
    placement: props.placement,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  }
)

// ============================================
// Computed
// ============================================

const tooltipClasses = computed(() => {
  return 'max-w-xs'
})

const tooltipStyle = computed(() => {
  return floatingStyles.value
})

const arrowClasses = computed(() => {
  const base = 'absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45'

  const placements = {
    top: '-bottom-1 left-1/2 -translate-x-1/2',
    bottom: '-top-1 left-1/2 -translate-x-1/2',
    left: '-right-1 top-1/2 -translate-y-1/2',
    right: '-left-1 top-1/2 -translate-y-1/2',
  }

  return `${base} ${placements[computedPlacement.value.split('-')[0] as keyof typeof placements]}`
})

// ============================================
// Methods
// ============================================

/**
 * 툴팁 표시
 */
const show = () => {
  if (props.disabled) return

  showTimeout = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

/**
 * 툴팁 숨김
 */
const hide = () => {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  isVisible.value = false
}
</script>

