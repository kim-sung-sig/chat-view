<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger 버튼 -->
    <div @click="toggle">
      <slot name="trigger" :isOpen="isOpen">
        <BaseButton
          variant="ghost"
          :icon-right="ChevronDownIcon"
        >
          {{ label }}
        </BaseButton>
      </slot>
    </div>

    <!-- Dropdown 메뉴 -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        :class="menuClasses"
        class="absolute z-dropdown mt-2 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-workspace-sidebar dark:ring-workspace-border"
      >
        <div class="py-1">
          <slot :close="close" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { onClickOutside } from '@vueuse/core'

// ============================================
// Props 정의
// ============================================
interface Props {
  /** 드롭다운 라벨 (기본 trigger 사용 시) */
  label?: string
  /** 메뉴 위치 */
  placement?: 'left' | 'right'
  /** 메뉴 너비 */
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Menu',
  placement: 'left',
  width: 'w-56',
})

// ============================================
// Emits 정의
// ============================================
const emit = defineEmits<{
  open: []
  close: []
}>()

// ============================================
// State
// ============================================
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// ============================================
// Computed
// ============================================
const menuClasses = computed(() => {
  const placement = props.placement === 'right' ? 'right-0' : 'left-0'
  return `${placement} ${props.width}`
})

// ============================================
// Methods
// ============================================

/**
 * 드롭다운 열기/닫기 토글
 */
const toggle = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    emit('open')
  } else {
    emit('close')
  }
}

/**
 * 드롭다운 닫기
 */
const close = () => {
  isOpen.value = false
  emit('close')
}

/**
 * 드롭다운 열기
 */
const open = () => {
  isOpen.value = true
  emit('open')
}

// ============================================
// Lifecycle
// ============================================

// 외부 클릭 시 닫기
onClickOutside(dropdownRef, () => {
  if (isOpen.value) {
    close()
  }
})

// ESC 키로 닫기
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

// ============================================
// Expose
// ============================================
defineExpose({
  open,
  close,
  toggle,
  isOpen,
})
</script>

