<template>
  <button
    :class="itemClasses"
    @click="$emit('click')"
  >
    <UserAvatar :name="dm.name" size="xs" :status="dm.status" show-status />
    <span class="flex-1 truncate">{{ dm.name }}</span>
    <span v-if="unreadCount > 0" class="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
      {{ unreadCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  dm: any
  isActive?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

const itemClasses = computed(() => {
  const base = 'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors'
  const active = props.isActive
    ? 'bg-accent text-accent-foreground font-medium'
    : 'text-foreground hover:bg-accent/50'
  return `${base} ${active}`
})

const unreadCount = computed(() => {
  return props.dm.unreadCount || 0
})
</script>

