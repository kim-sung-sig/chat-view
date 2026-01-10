<script setup lang="ts">
import SettingsModal from '~/components/common/SettingsModal.vue';
import ServerSidebar from '~/components/server/ServerSidebar.vue';
import { useUIStore } from '~/store/ui';

const uiStore = useUIStore();
</script>

<template>
  <div class="main-layout">
    <SettingsModal v-if="uiStore.showSettings" />
    
    <!-- Mobile Backdrop -->
    <div 
      class="mobile-backdrop" 
      :class="{ 'visible': uiStore.mobileSidebarOpen }"
      @click="uiStore.closeMobileSidebar()"
    ></div>


    <div class="sidebar-wrapper" :class="{ 'mobile-open': uiStore.mobileSidebarOpen }">
      <ServerSidebar />
    </div>

    <div class="main-content">
       <slot />
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh; /* Fallback */
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}


.sidebar-wrapper {
  display: flex;
  height: 100%;
  z-index: 50;
  background-color: var(--bg-tertiary);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content {
  flex: 1;
  display: flex;
  min-width: 0;
  background-color: var(--bg-primary);
  height: 100%;
  position: relative;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%); /* Hide by default */
    box-shadow: 4px 0 16px rgba(0,0,0,0.4);
  }

  .sidebar-wrapper.mobile-open {
    transform: translateX(0);
  }
}
</style>

