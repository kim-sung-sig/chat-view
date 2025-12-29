<script setup lang="ts">
import ServerSidebar from '~/components/server/ServerSidebar.vue';
</script>

<template>
  <div class="main-layout">
    <ServerSidebar />
    <div class="main-content">
       <slot />
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  min-width: 0;
  background-color: var(--bg-primary);
}
</style>
