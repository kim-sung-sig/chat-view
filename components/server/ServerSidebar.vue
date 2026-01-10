<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '~/store/data';

const store = useDataStore();
const servers = computed(() => store.servers);
const activeServerId = computed(() => store.activeServerId);

const selectServer = (id: string) => {
  store.setActiveServer(id);
};

// Drag and Drop Logic
const draggedId = ref<string | null>(null);

const onDragStart = (e: DragEvent, id: string) => {
  draggedId.value = id;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';
  }
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault(); // Necessary for update
};

const onDrop = (e: DragEvent, targetId: string) => {
  e.preventDefault();
  if (!draggedId.value || draggedId.value === targetId) return;

  const currentOrder = servers.value.map(s => s.id);
  const fromIndex = currentOrder.indexOf(draggedId.value);
  const toIndex = currentOrder.indexOf(targetId);

  if (fromIndex !== -1 && toIndex !== -1) {
    // Reorder locally
    const newOrder = [...currentOrder];
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedId.value);
    
    // Update store
    store.reorderServers(newOrder);
  }
  draggedId.value = null;
};

const createServer = () => {
    const name = window.prompt("Enter server name:");
    if (name) {
        store.addServer(name);
    }
};
</script>

<template>
  <nav class="server-sidebar">
    <!-- Home Button -->
    <div 
      class="server-icon-wrapper"
      :class="{ 'active': activeServerId === 'home' }"
      @click="selectServer('home')"
    >
      <div class="pill"></div>
      <img 
        src="https://placehold.co/100/5865F2/white?text=DM" 
        alt="Home" 
        class="server-icon home-icon"
      />
    </div>

    <div class="separator"></div>

    <!-- Draggable Server List -->
    <div 
      v-for="server in servers" 
      :key="server.id"
      class="server-icon-wrapper"
      :class="{ 'active': activeServerId === server.id, 'dragging': draggedId === server.id }"
      @click="selectServer(server.id)"
      draggable="true"
      @dragstart="onDragStart($event, server.id)"
      @dragover="onDragOver"
      @drop="onDrop($event, server.id)"
    >
      <div class="pill"></div>
      <img 
        :src="server.iconUrl" 
        :alt="server.name" 
        class="server-icon"
      />
      <!-- Unread Badge -->
      <div class="badge" v-if="server.unreadCount && server.unreadCount > 0">
        {{ server.unreadCount }}
      </div>
    </div>
    
    <!-- Add Server Button -->
    <div class="server-icon-wrapper add-server" @click="createServer">
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

.separator {
  height: 2px;
  width: 32px;
  border-radius: 1px;
  background-color: var(--bg-hover);
  margin-bottom: 4px;
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

.server-icon-wrapper.dragging {
  opacity: 0.5;
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

/* Badge */
.badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: var(--c-danger);
  color: white;
  font-size: 11px;
  font-weight: bold;
  height: 22px; 
  min-width: 22px;
  padding: 0 6px;
  border-radius: 11px;
  border: 4px solid var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
