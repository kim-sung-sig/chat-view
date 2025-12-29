<script setup lang="ts">
import { useDataStore } from '~/store/data';
import { computed } from 'vue';

const store = useDataStore();
const servers = computed(() => store.servers);
const activeServerId = computed(() => store.activeServerId);

const selectServer = (id: string) => {
  store.setActiveServer(id);
};
</script>

<template>
  <nav class="server-sidebar">
    <div 
      v-for="server in servers" 
      :key="server.id"
      class="server-icon-wrapper"
      :class="{ 'active': activeServerId === server.id }"
      @click="selectServer(server.id)"
    >
      <div class="pill"></div>
      <img 
        :src="server.iconUrl" 
        :alt="server.name" 
        class="server-icon"
      />
    </div>
    
    <!-- Add Server Button Mock -->
    <div class="server-icon-wrapper add-server">
      <div class="server-icon flex items-center justify-center">
        <span>+</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.server-sidebar {
  width: 72px;
  background-color: var(--bg-tertiary); /* Darkest */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
  overflow-y: auto;
  gap: 8px;
}

.server-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.server-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  transition: border-radius 0.2s, background-color 0.2s;
  background-color: var(--bg-primary);
  object-fit: cover;
  color: var(--c-success);
  font-size: 24px;
}

.server-icon-wrapper:hover .server-icon {
  border-radius: 16px;
  background-color: var(--bg-accent);
  color: white;
}

.server-icon-wrapper.active .server-icon {
  border-radius: 16px;
}

/* White Pill Indicator */
.pill {
  position: absolute;
  left: -16px; /* Adjust based on wrapper centering */
  width: 8px;
  height: 8px;
  border-radius: 0 4px 4px 0;
  background-color: white;
  transition: all 0.2s;
  opacity: 0;
  transform: translateX(-4px);
}

.server-icon-wrapper:hover .pill {
  height: 20px;
  opacity: 1;
  transform: translateX(0);
}

.server-icon-wrapper.active .pill {
  height: 40px;
  opacity: 1;
  transform: translateX(0);
}

.add-server .server-icon {
  background-color: var(--bg-primary);
  color: var(--c-success);
}
.add-server:hover .server-icon {
  background-color: var(--c-success);
  color: white;
}
</style>
