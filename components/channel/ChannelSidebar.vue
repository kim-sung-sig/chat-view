<script setup lang="ts">
import { computed } from 'vue';
import UserPanel from '~/components/common/UserPanel.vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';

const store = useDataStore();
const uiStore = useUIStore();
const activeServer = computed(() => store.getActiveServer);
const activeServerId = computed(() => store.activeServerId);

// Get channels for current server
const channels = computed(() => {
    if (activeServerId.value) {
        return store.getServerChannels(activeServerId.value);
    }
    return [];
});

const activeChannelId = computed(() => store.activeChannelId);

const selectChannel = (id: string) => {
  store.setActiveChannel(id);
  // Auto-close on mobile selection
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    uiStore.closeMobileSidebar();
  }
};

const createChannel = (type: 'text' | 'voice') => {
    if (!activeServerId.value) return;
    const name = prompt(`Enter ${type} channel name:`);
    if (name) {
        store.addChannel(activeServerId.value, name, type);
    }
};

const deleteChannel = (e: Event, id: string) => {
    e.stopPropagation(); // Prevent selection
    if (confirm('Delete this channel?')) {
        store.deleteChannel(id);
    }
};

</script>

<template>
  <aside class="channel-sidebar">
    <header class="server-header" v-if="activeServer">
      <h2 class="server-name">{{ activeServer.name }}</h2>
    </header>
    
    <div class="channels-scroll">
      <!-- Text Channels Category -->
      <div class="category">
        <div class="category-header">
            <span>TEXT CHANNELS</span>
            <button class="add-btn" @click="createChannel('text')">+</button>
        </div>
        <div 
            v-for="channel in channels.filter(c => c.type === 'text')" 
            :key="channel.id"
            class="channel-item"
            :class="{ 'active': activeChannelId === channel.id }"
            @click="selectChannel(channel.id)"
        >
            <span class="channel-hash">#</span>
            <span class="channel-name">{{ channel.name }}</span>
            <button class="delete-btn" @click="deleteChannel($event, channel.id)">×</button>
        </div>
      </div>

       <!-- Voice Channels Category -->
       <div class="category">
        <div class="category-header">
            <span>VOICE CHANNELS</span>
            <button class="add-btn" @click="createChannel('voice')">+</button>
        </div>
        <div 
            v-for="channel in channels.filter(c => c.type === 'voice')" 
            :key="channel.id"
            class="channel-item"
            :class="{ 'active': activeChannelId === channel.id }"
            @click="selectChannel(channel.id)"
        >
            <span class="channel-voice-icon">🔊</span>
            <span class="channel-name">{{ channel.name }}</span>
             <button class="delete-btn" @click="deleteChannel($event, channel.id)">×</button>
        </div>
      </div>

    </div>

    <UserPanel />
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

/* Categories */
.category {
    margin-bottom: 20px;
}

.category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px 4px 8px;
    font-size: 12px;
    font-weight: 700;
    color: var(--c-text-muted);
    cursor: default;
}
.category-header:hover { color: var(--c-text-header); }

.add-btn {
    background: none;
    border: none;
    color: var(--c-text-muted);
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
}
.add-btn:hover { color: var(--c-text-header); }

.channel-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 2px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--c-text-muted);
  position: relative;
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
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
    display: none;
    background: none;
    border: none;
    color: var(--c-text-muted);
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
}
.channel-item:hover .delete-btn {
    display: block;
}
.delete-btn:hover {
    color: var(--c-danger);
}


</style>
