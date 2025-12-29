<script setup lang="ts">
import { onMounted } from 'vue';
import { useDataStore } from '~/store/data';
import ChannelSidebar from '~/components/channel/ChannelSidebar.vue';
import ChatArea from '~/components/chat/ChatArea.vue';

const store = useDataStore();

onMounted(() => {
  store.initializeMockData();
});
</script>

<template>
  <div class="page-container">
    <ChannelSidebar />
    <ChatArea />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
