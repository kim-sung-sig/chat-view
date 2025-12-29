<script setup lang="ts">
import type { Message, User } from '~/types';
import { useDataStore } from '~/store/data';

const props = defineProps<{
  message: Message;
  author?: User;
}>();

const formatTime = (date: string | Date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Fallback user if not found
const displayUser = computed(() => props.author || {
  username: 'Unknown',
  avatarUrl: 'https://placehold.co/40',
  color: '#fff'
});
</script>

<template>
  <div class="message-item">
    <img :src="displayUser.avatarUrl || 'https://placehold.co/40'" class="avatar" />
    <div class="content-wrapper">
      <header class="header">
        <span class="username">{{ displayUser.username }}</span>
        <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
      </header>
      <div class="message-content">
        {{ message.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-item {
  display: flex;
  padding: 2px 16px;
  margin-top: 17px; /* Group spacing */
}

.message-item:hover {
  background-color: rgba(2, 2, 2, 0.06); 
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 16px;
  margin-top: 2px;
  cursor: pointer;
}
.avatar:hover {
  opacity: 0.8;
}

.header {
  display: flex;
  align-items: baseline;
}

.username {
  font-weight: 500;
  color: var(--c-text-header);
  margin-right: 8px;
  cursor: pointer;
}
.username:hover {
  text-decoration: underline;
}

.timestamp {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.message-content {
  color: var(--c-text-normal);
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
