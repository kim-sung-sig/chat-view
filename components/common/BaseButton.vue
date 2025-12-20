<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <LoadingSpinner v-if="loading" :size="spinnerSize" class="mr-2" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonVariant, ButtonSize } from '~/types/ui'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  }

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
  }

  const width = props.fullWidth ? 'w-full' : ''

  return [base, variants[props.variant], sizes[props.size], width].filter(Boolean).join(' ')
})

const spinnerSize = computed(() => {
  const sizeMap = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  }
  return sizeMap[props.size] as 'xs' | 'sm' | 'md'
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

