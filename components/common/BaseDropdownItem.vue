<template>
  <button
    :class="itemClasses"
    @click="handleClick"
  >
    <BaseIcon v-if="icon" :name="icon" size="sm" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon?: string
  danger?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const itemClasses = computed(() => {
  const base = 'w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors'
  const danger = props.danger ? 'text-red-600 dark:text-red-400' : 'text-foreground'
  return `${base} ${danger}`
})

const handleClick = () => {
  emit('click')
}
</script>

