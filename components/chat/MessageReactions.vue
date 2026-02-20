<template>
  <div v-if="Object.keys(reactions).length" class="reactions">
    <button
      v-for="(reaction, emoji) in reactions"
      :key="emoji"
      class="reaction-badge"
      :class="{ 'reaction-badge--me': reaction.me }"
      :title="reaction.userIds.join(', ')"
      @click="$emit('toggle', String(emoji))"
    >
      {{ emoji }} <span class="reaction-count">{{ reaction.count }}</span>
    </button>
    <button class="reaction-add-btn" @click="$emit('add')">😊</button>
  </div>
</template>

<script setup lang="ts">
import type { Reaction } from '~/types'
defineProps<{ reactions: Record<string, Reaction> }>()
defineEmits<{ toggle: [emoji: string]; add: [] }>()
</script>

<style scoped>
.reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
.reaction-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-modifier-accent);
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 2px 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.1s, border-color 0.1s;
}
.reaction-badge:hover { background: var(--bg-modifier-hover); border-color: var(--brand-experiment); }
.reaction-badge--me { background: #5865f220; border-color: var(--brand-experiment); }
.reaction-count { font-size: 12px; color: var(--c-text-muted); }
.reaction-add-btn {
  background: none;
  border: 1px dashed var(--bg-modifier-accent);
  border-radius: 8px;
  padding: 2px 8px;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.15s;
}
.reactions:hover .reaction-add-btn { opacity: 1; }
</style>
