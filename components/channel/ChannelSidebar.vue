<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import UserPanel from '~/components/common/UserPanel.vue';
import { useChatStore } from '~/store/chat';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';

const chatStore = useChatStore();
const store = useDataStore();
const uiStore = useUIStore();

const activeServer = computed(() => store.getActiveServer);
const activeServerId = computed(() => store.activeServerId);
const collapsedCategories = ref<Record<string, boolean>>({});

const channels = computed(() => {
    if (chatStore.channels.length > 0) return chatStore.channels;
    if (activeServerId.value) return store.getServerChannels(activeServerId.value);
    return [];
});

const textChannels = computed(() => channels.value.filter(c => c.type === 'text'));
const voiceChannels = computed(() => channels.value.filter(c => c.type === 'voice'));
const activeChannelId = computed(() => chatStore.activeChannelId || store.activeChannelId);

const selectChannel = async (id: string) => {
    await chatStore.setActiveChannel(id);
    store.setActiveChannel(id);
    uiStore.clearUnread(id);
    if (typeof window !== 'undefined' && window.innerWidth <= 768) uiStore.closeMobileSidebar();
};

const toggleCategory = (key: string) => { collapsedCategories.value[key] = !collapsedCategories.value[key]; };

const createChannel = (type: 'text' | 'voice') => {
    if (!activeServerId.value) return;
    const name = prompt(`${type === 'text' ? '텍스트' : '음성'} 채널 이름:`);
    if (name) store.addChannel(activeServerId.value, name, type);
};

const deleteChannel = (e: Event, id: string) => {
    e.stopPropagation();
    if (confirm('채널을 삭제하시겠습니까?')) store.deleteChannel(id);
};

onMounted(async () => { try { await chatStore.loadMyChannels(); } catch {} });
</script>

<template>
  <aside class="channel-sidebar">
    <header class="server-header" v-if="activeServer">
      <h2 class="server-name">{{ activeServer.name }}</h2>
    </header>

    <div class="search-hint-bar" @click="uiStore.toggleChannelSearch()">
      <span class="search-hint-text">채널 검색...</span>
      <kbd>Ctrl+K</kbd>
    </div>

    <div class="channels-scroll">
      <!-- 텍스트 채널 -->
      <div class="category">
        <div class="category-header" @click="toggleCategory('text')">
          <span class="collapse-arrow" :class="{ collapsed: collapsedCategories['text'] }">▼</span>
          <span>텍스트 채널</span>
          <button class="add-btn" @click.stop="createChannel('text')">+</button>
        </div>
        <template v-if="!collapsedCategories['text']">
          <div
            v-for="channel in textChannels" :key="channel.id"
            class="channel-item"
            :class="{ active: activeChannelId === channel.id, unread: uiStore.unreadMap[channel.id] > 0 }"
            @click="selectChannel(channel.id)"
          >
            <span class="channel-hash">#</span>
            <span class="channel-name" :class="{ 'channel-name--unread': uiStore.unreadMap[channel.id] > 0 }">{{ channel.name }}</span>
            <span v-if="uiStore.mentionMap[channel.id] > 0" class="mention-badge">@{{ uiStore.mentionMap[channel.id] }}</span>
            <span v-else-if="uiStore.unreadMap[channel.id] > 0 && activeChannelId !== channel.id" class="unread-badge">
              {{ uiStore.unreadMap[channel.id] > 99 ? '99+' : uiStore.unreadMap[channel.id] }}
            </span>
            <button class="delete-btn" @click="deleteChannel($event, channel.id)">×</button>
          </div>
        </template>
      </div>

      <!-- 음성 채널 -->
      <div class="category">
        <div class="category-header" @click="toggleCategory('voice')">
          <span class="collapse-arrow" :class="{ collapsed: collapsedCategories['voice'] }">▼</span>
          <span>음성 채널</span>
          <button class="add-btn" @click.stop="createChannel('voice')">+</button>
        </div>
        <template v-if="!collapsedCategories['voice']">
          <div
            v-for="channel in voiceChannels" :key="channel.id"
            class="channel-item"
            :class="{ active: activeChannelId === channel.id }"
            @click="selectChannel(channel.id)"
          >
            <span class="channel-voice-icon">🔊</span>
            <span class="channel-name">{{ channel.name }}</span>
            <button class="delete-btn" @click="deleteChannel($event, channel.id)">×</button>
          </div>
        </template>
      </div>
    </div>

    <UserPanel />
  </aside>
</template>

<style scoped>
.channel-sidebar { width: 240px; background: var(--bg-secondary); display: flex; flex-direction: column; }
.server-header { height: 48px; padding: 0 16px; display: flex; align-items: center; box-shadow: 0 1px 0 rgba(0,0,0,0.2); cursor: pointer; transition: background 0.15s; }
.server-header:hover { background: var(--bg-hover); }
.server-name { font-size: 16px; font-weight: 700; color: var(--c-text-header); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.search-hint-bar { margin: 8px 8px 0; padding: 6px 10px; background: var(--bg-tertiary); border-radius: 4px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-size: 13px; color: var(--c-text-muted); transition: background 0.1s; }
.search-hint-bar:hover { background: var(--bg-hover); color: var(--c-text-normal); }
kbd { font-size: 10px; background: var(--bg-modifier-accent); border-radius: 3px; padding: 1px 4px; border: 1px solid var(--c-text-muted); }

.channels-scroll { flex: 1; padding: 8px; overflow-y: auto; }
.category { margin-bottom: 16px; }
.category-header { display: flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 11px; font-weight: 700; color: var(--c-text-muted); cursor: pointer; user-select: none; text-transform: uppercase; letter-spacing: 0.4px; }
.category-header:hover { color: var(--c-text-header); }
.collapse-arrow { font-size: 9px; transition: transform 0.2s; flex-shrink: 0; }
.collapse-arrow.collapsed { transform: rotate(-90deg); }
.add-btn { background: none; border: none; color: var(--c-text-muted); font-size: 18px; cursor: pointer; margin-left: auto; line-height: 1; }
.add-btn:hover { color: var(--c-text-header); }

.channel-item { display: flex; align-items: center; padding: 5px 8px; margin-bottom: 1px; border-radius: 4px; cursor: pointer; color: var(--c-text-muted); position: relative; transition: background 0.1s, color 0.1s; }
.channel-item:hover { background: var(--bg-hover); color: var(--c-text-normal); }
.channel-item.active { background: #404249; color: white; }
.channel-item.unread { color: var(--c-text-normal); }
.channel-hash, .channel-voice-icon { margin-right: 6px; font-size: 18px; color: #80848e; flex-shrink: 0; }
.channel-name { font-weight: 500; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; }
.channel-name--unread { font-weight: 700; color: var(--c-text-header); }
.unread-badge { background: var(--c-text-muted); color: var(--bg-primary); font-size: 10px; font-weight: 700; border-radius: 10px; padding: 1px 5px; flex-shrink: 0; }
.mention-badge { background: var(--c-danger); color: #fff; font-size: 10px; font-weight: 700; border-radius: 10px; padding: 1px 5px; flex-shrink: 0; }
.delete-btn { display: none; background: none; border: none; color: var(--c-text-muted); font-size: 18px; cursor: pointer; padding: 0 2px; }
.channel-item:hover .delete-btn { display: block; }
.delete-btn:hover { color: var(--c-danger); }
</style>
