<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';
import UserPanel from '~/components/common/UserPanel.vue';

const store = useDataStore();
const uiStore = useUIStore();
const dms = computed(() => store.dms);
const activeChannelId = computed(() => store.activeChannelId);

const selectDM = (id: string) => {
  store.setActiveChannel(id);
  if (window.innerWidth <= 768) {
    uiStore.closeMobileSidebar();
  }
};
</script>

<template>
  <aside class="dm-sidebar">
    <div class="search-bar-wrapper">
      <button class="search-btn">Find conversation</button>
    </div>
    
    <div class="dm-scroller">
        <div 
          class="dm-item" 
          :class="{ 'active': activeChannelId === 'friends' }" 
          @click="selectDM('friends')"
        >
            <div class="friend-icon-wrapper">
              <span>👋</span>
            </div>
            <span class="dm-name">Friends</span>
        </div>

        <div class="dm-header">
            DIRECT MESSAGES <span class="plus">+</span>
        </div>

        <div 
         v-for="dm in dms"
         :key="dm.id"
         class="dm-item"
         :class="{ 'active': activeChannelId === dm.id }"
         @click="selectDM(dm.id)"
        >
             <div class="dm-avatar">
                 <img :src="`https://placehold.co/32?text=${dm.name[0]}`" alt="" />
             </div>
             <span class="dm-name">{{ dm.name }}</span>
             <span class="close-icon">×</span>
        </div>
    </div>
    
    <!-- User Panel (Copy from ChannelSidebar or componentize it? Copy for speed now) -->
    <!-- Ideally UserPanel should be a shared component, but let's just leave it out or duplicate later if needed. -->
    <!-- Adding a minimal user panel at bottom -->
    <UserPanel />
  </aside>
</template>

<style scoped>
.dm-sidebar {
  width: 240px;
  background-color: var(--bg-secondary);
  display: flex;
  flex-direction: column;
}

.search-bar-wrapper {
  height: 48px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 0 rgba(0,0,0,0.2);
}

.search-btn {
  width: 100%;
  text-align: left;
  background-color: #1e1f22;
  color: var(--c-text-muted);
  border: none;
  border-radius: 4px;
  padding: 6px;
  font-size: 13px;
  cursor: pointer;
}

.dm-scroller {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
}

.dm-item {
  display: flex;
  align-items: center;
  padding: 10px 8px; /* Bigger touch target */
  margin-bottom: 2px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--c-text-muted);
}
.dm-item:hover {
  background-color: var(--bg-hover);
  color: var(--c-text-normal);
}
.dm-item.active {
  background-color: #404249;
  color: white;
}

.friend-icon-wrapper {
  margin-right: 12px;
  font-size: 18px;
}

.dm-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
  overflow: hidden;
}
.dm-avatar img { width: 100%; height: 100%; object-fit: cover; }

.dm-name {
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dm-header {
  margin-top: 16px;
  padding: 8px 8px 4px 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--c-text-muted);
  display: flex;
  justify-content: space-between;
}
.dm-header:hover { color: var(--c-text-header); }
.plus { cursor: pointer; }

.close-icon {
  display: none;
  font-size: 16px;
  color: var(--c-text-muted);
}
.dm-item:hover .close-icon {
  display: block;
}
</style>
