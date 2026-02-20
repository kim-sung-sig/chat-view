<template>
  <div class="skeleton-msg" :class="{ 'skeleton-msg--grouped': grouped }">
    <div v-if="!grouped" class="skeleton-avatar shimmer" />
    <div v-else class="skeleton-avatar-placeholder" />
    <div class="skeleton-content">
      <div v-if="!grouped" class="skeleton-header">
        <div class="shimmer skeleton-name" />
        <div class="shimmer skeleton-time" />
      </div>
      <div class="shimmer skeleton-line" :style="{ width: lineWidth }" />
      <div v-if="multiline" class="shimmer skeleton-line" style="width: 60%" />
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{ grouped?: boolean; multiline?: boolean; lineWidth?: string }>(), { lineWidth: "80%" })
</script>
<style scoped>
@keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
.shimmer { background: linear-gradient(90deg,var(--bg-modifier-accent) 25%,var(--bg-modifier-hover) 50%,var(--bg-modifier-accent) 75%); background-size: 800px 100%; animation: shimmer 1.6s infinite linear; border-radius: 4px; }
.skeleton-msg { display:flex; gap:16px; padding:2px 16px; margin-top:17px; }
.skeleton-msg--grouped { margin-top:2px; }
.skeleton-avatar { width:40px; height:40px; border-radius:50%; flex-shrink:0; }
.skeleton-avatar-placeholder { width:40px; flex-shrink:0; }
.skeleton-content { flex:1; display:flex; flex-direction:column; gap:6px; padding-top:2px; }
.skeleton-header { display:flex; gap:8px; align-items:center; margin-bottom:4px; }
.skeleton-name { height:14px; width:100px; }
.skeleton-time { height:10px; width:60px; }
.skeleton-line { height:14px; }
</style>
