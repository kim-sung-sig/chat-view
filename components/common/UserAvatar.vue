<template>
  <div :class="avatarClasses" class="relative flex items-center justify-center">
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="name"
      class="w-full h-full object-cover"
      @error="imageError = true"
    />

    <span v-else class="font-semibold text-white" :class="textSizeClass">
      {{ initials }}
    </span>

    <span
      v-if="showStatus && status"
      :class="statusClasses"
      class="absolute bottom-0 right-0 rounded-full border-2 border-white"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'away' | 'busy' | 'offline'
  showStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showStatus: false,
})

const imageError = ref(false)

const initials = computed(() => {
  if (!props.name) return '?'

  const words = props.name.trim().split(' ')

  if (/[가-힣]/.test(props.name)) {
    return props.name.slice(0, 2)
  }

  if (words.length >= 2) {
    return words[0][0] + words[1][0]
  }

  return props.name.slice(0, 2).toUpperCase()
})

const avatarClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return `${sizes[props.size]} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden`
})

const textSizeClass = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl',
  }

  return sizes[props.size]
})

const statusClasses = computed(() => {
  const statuses = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400',
  }

  const sizes = {
    xs: 'w-2 h-2',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  }

  return `${statuses[props.status || 'offline']} ${sizes[props.size]}`
})
</script>

