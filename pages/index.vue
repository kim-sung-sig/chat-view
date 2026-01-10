<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';
import ChannelSidebar from '~/components/channel/ChannelSidebar.vue';
import DMSidebar from '~/components/server/DMSidebar.vue';
import ChatArea from '~/components/chat/ChatArea.vue';
import FriendList from '~/components/friends/FriendList.vue';

const store = useDataStore();
const uiStore = useUIStore();
const activeServerId = computed(() => store.activeServerId);
const activeChannelId = computed(() => store.activeChannelId);

onMounted(() => {
  store.initializeMockData();
});
</script>

<template>
  <div class="page-container">
    <!-- Sidebar Area -->
    <div 
      class="channel-sidebar-wrapper" 
      :class="{ 'mobile-open': uiStore.mobileSidebarOpen }"
    >
      <DMSidebar v-if="activeServerId === 'home'" />
      <ChannelSidebar v-else />
    </div>
    
    <!-- Main Content Area -->
    <template v-if="activeServerId === 'home' && activeChannelId === 'friends'">
        <FriendList />
    </template>
    <ChatArea v-else />
  </div>
</template>


<style scoped>
.page-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative; 
}

.channel-sidebar-wrapper {
  display: flex;
  flex-shrink: 0;
  height: 100%;
}

@media (max-width: 768px) {
  .channel-sidebar-wrapper {
    position: fixed;
    left: 72px; /* Width of ServerSidebar */
    top: 0;
    bottom: 0;
    z-index: 45; /* Below ServerSidebar (50) but above content */
    transform: translateX(calc(-100% - 72px)); /* Hide completely */
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 16px rgba(0,0,0,0.2);
  }

  .channel-sidebar-wrapper.mobile-open {
    transform: translateX(0);
  }
}
</style>

