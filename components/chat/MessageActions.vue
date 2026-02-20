<template>
  <div class="message-actions" :class="{ visible }">
    <button class="action-btn" title="리액션 추가" @click.stop="$emit('react')">😊</button>
    <button class="action-btn" title="답장" @click.stop="$emit('reply')">↩</button>
    <template v-if="isOwn">
      <button class="action-btn" title="편집" @click.stop="$emit('edit')">✏️</button>
      <button class="action-btn action-btn--danger" title="삭제" @click.stop="$emit('delete')">🗑</button>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean; isOwn: boolean }>()
defineEmits<{
  react: []
  reply: []
  edit: []
  delete: []
}>()
</script>

<style scoped>
.message-actions {
  display: flex;
  gap: 2px;
  background: var(--bg-floating);
  border: 1px solid var(--bg-modifier-accent);
  border-radius: 6px;
  padding: 2px 4px;
  position: absolute;
  top: -20px;
  right: 8px;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.message-actions.visible {
  opacity: 1;
  pointer-events: all;
}
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 6px;
  border-radius: 4px;
  transition: background 0.1s;
  line-height: 1;
}
.action-btn:hover { background: var(--bg-modifier-hover); }
.action-btn--danger:hover { background: #f0434310; }
</style>
