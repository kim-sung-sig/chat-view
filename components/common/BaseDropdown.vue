<template>
  <div class="relative" ref="dropdownRef">
    <div @click="toggle">
      <slot name="trigger" :isOpen="isOpen">
        <button class="btn btn-ghost">
          {{ label }}
        </button>
      </slot>
    </div>

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
        class="absolute z-50 mt-2 rounded-lg bg-card dark:bg-discord-sidebar shadow-lg border border-border dark:border-discord-hover"
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

interface Props {
  label?: string
  placement?: 'left' | 'right' | 'bottom-end'
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Menu',
  placement: 'left',
  width: 'w-56',
})

const emit = defineEmits<{
  open: []
  close: []
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const menuClasses = computed(() => {
  let placement = 'left-0'
  if (props.placement === 'right') placement = 'right-0'
  if (props.placement === 'bottom-end') placement = 'right-0'
  return `${placement} ${props.width}`
})

const toggle = () => {
  isOpen.value = !isOpen.value
  emit(isOpen.value ? 'open' : 'close')
}

const close = () => {
  isOpen.value = false
  emit('close')
}

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

