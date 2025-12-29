<script setup lang="ts">
import { useDataStore } from '~/store/data';
import { computed } from 'vue';

const store = useDataStore();
const activeServer = computed(() => store.getActiveServer);
const channels = computed(() => store.channels); // Mock: all channels
const activeChannelId = computed(() => store.activeChannelId);
const currentUser = computed(() => store.currentUser);

const selectChannel = (id: string) => {
  store.setActiveChannel(id);
};
</script>

<template>
  <aside class="channel-sidebar">
    <header class="server-header" v-if="activeServer">
      <h2 class="server-name">{{ activeServer.name }}</h2>
    </header>
    
    <div class="channels-scroll">
      <div 
        v-for="channel in channels" 
        :key="channel.id"
        class="channel-item"
        :class="{ 'active': activeChannelId === channel.id }"
        @click="selectChannel(channel.id)"
      >
        <span class="channel-hash" v-if="channel.type === 'text'">#</span>
        <span class="channel-voice-icon" v-else>🔊</span>
        <span class="channel-name">{{ channel.name }}</span>
      </div>
    </div>

    <div class="user-panel" v-if="currentUser">
      <div class="user-avatar-wrapper">
         <img :src="currentUser.avatarUrl" class="user-avatar" />
         <div class="status-indicator" :class="currentUser.status"></div>
      </div>
      <div class="user-info">
        <div class="username">{{ currentUser.username }}</div>
        <div class="discriminator">#{{ currentUser.discriminator }}</div>
      </div>
      <div class="user-actions">
        <!-- Icons -->
        <button class="icon-btn">🎤</button>
        <button class="icon-btn">🎧</button>
        <button class="icon-btn">⚙️</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.channel-sidebar {
  width: 240px;
  background-color: var(--bg-secondary);
  display: flex;
  flex-direction: column;
}

.server-header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 0 rgba(0,0,0,0.2);
  cursor: pointer;
  transition: background-color 0.2s;
}
.server-header:hover {
  background-color: var(--bg-hover);
}

.server-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text-header);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.channels-scroll {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
}

.channel-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 2px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--c-text-muted);
}

.channel-item:hover {
  background-color: var(--bg-hover);
  color: var(--c-text-normal);
}

.channel-item.active {
  background-color: #404249; /* Active channel bg */
  color: white;
}

.channel-hash, .channel-voice-icon {
  margin-right: 6px;
  font-size: 20px;
  color: #80848e;
}

.channel-name {
  font-weight: 500;
}

/* User Panel */
.user-panel {
  height: 52px;
  background-color: #232428;
  padding: 0 8px;
  display: flex;
  align-items: center;
}

.user-avatar-wrapper {
  position: relative;
  margin-right: 8px;
}
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: gray;
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

.user-info {
  flex: 1;
  font-size: 12px;
  line-height: 1.2;
}
.username {
  font-weight: 600;
  color: var(--c-text-header);
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
  padding: 4px;
  border-radius: 4px;
  color: var(--c-text-normal);
  font-size: 16px;
}
.icon-btn:hover {
  background-color: var(--bg-hover);
}
</style>
