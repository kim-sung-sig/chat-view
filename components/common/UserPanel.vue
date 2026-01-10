<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';

const store = useDataStore();
const uiStore = useUIStore();
const currentUser = computed(() => store.currentUser);

const openSettings = () => {
  uiStore.openSettings();
};
</script>

<template>
  <div class="user-panel" v-if="currentUser">
    <div class="user-avatar-wrapper">
       <img :src="currentUser.avatarUrl" class="user-avatar" />
       <div class="status-indicator" :class="currentUser.status"></div>
    </div>
    <div class="user-info">
      <div class="username text-header">{{ currentUser.username }}</div>
      <div class="discriminator">#{{ currentUser.discriminator }}</div>
    </div>
    <div class="user-actions">
      <!-- Icons -->
      <button class="icon-btn" title="Mute">🎤</button>
      <button class="icon-btn" title="Deafen">🎧</button>
      <button class="icon-btn" title="User Settings" @click="openSettings">⚙️</button>
    </div>
  </div>
</template>


<style scoped>
.user-panel {
  height: 52px;
  background-color: #232428;
  padding: 0 8px;
  display: flex;
  align-items: center;
  flex-shrink: 0; 
}

.user-avatar-wrapper {
  position: relative;
  margin-right: 8px;
  cursor: pointer;
}
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: gray;
  object-fit: cover;
}
.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #232428;
}
.status-indicator.online { background-color: var(--c-success); }
.status-indicator.idle { background-color: #f0b232; }
.status-indicator.dnd { background-color: var(--c-danger); }
.status-indicator.offline { background-color: #747f8d; }

.user-info {
  flex: 1;
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
}
.username {
  font-weight: 600;
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.discriminator {
  color: var(--c-text-muted);
}

.user-actions {
  display: flex;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  color: var(--c-text-normal);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-btn:hover {
  background-color: var(--bg-hover);
}
</style>
