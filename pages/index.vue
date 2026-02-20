<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';
import ChannelSidebar from '~/components/channel/ChannelSidebar.vue';
import ChannelSearch from '~/components/channel/ChannelSearch.vue';
import DMSidebar from '~/components/server/DMSidebar.vue';
import MemberListPanel from '~/components/server/MemberListPanel.vue';
import ChatArea from '~/components/chat/ChatArea.vue';
import FriendList from '~/components/friends/FriendList.vue';

const store = useDataStore();
const uiStore = useUIStore();
const activeServerId = computed(() => store.activeServerId);
const activeChannelId = computed(() => store.activeChannelId);
const showFriends = computed(() => activeServerId.value === 'home' && activeChannelId.value === 'friends');

onMounted(() => {
  store.initializeMockData();
  uiStore.initTheme();
});
</script>

<template>
  <div class="page-container">
    <!-- 채널/DM 사이드바 -->
    <div
      class="channel-sidebar-wrapper"
      :class="{ 'mobile-open': uiStore.mobileSidebarOpen }"
    >
      <DMSidebar v-if="activeServerId === 'home'" />
      <ChannelSidebar v-else />
    </div>

    <!-- 메인 콘텐츠 -->
    <template v-if="showFriends">
      <FriendList class="main-content" />
    </template>
    <template v-else>
      <ChatArea />
      <MemberListPanel v-if="activeServerId !== 'home'" />
    </template>

    <!-- 채널 검색 모달 (전역) -->
    <ChannelSearch />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}
.main-content { flex: 1; min-width: 0; }
.channel-sidebar-wrapper {
  display: flex;
  flex-shrink: 0;
  height: 100%;
}
@media (max-width: 768px) {
  .channel-sidebar-wrapper {
    position: fixed;
    left: 72px;
    top: 0; bottom: 0;
    z-index: 45;
    transform: translateX(calc(-100% - 72px));
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 16px rgba(0,0,0,0.2);
  }
  .channel-sidebar-wrapper.mobile-open { transform: translateX(0); }
}
</style>
