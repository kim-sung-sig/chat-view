<template>
  <aside v-if="uiStore.showMemberList" class="member-panel">
    <div class="section">
      <div class="section-title">온라인 — {{ onlineMembers.length }}</div>
      <div v-for="user in onlineMembers" :key="user.id" class="member-item">
        <div class="avatar-wrap">
          <img :src="user.avatarUrl || `https://placehold.co/32/5865f2/fff?text=${user.username[0]}`" class="avatar" />
          <span class="status-dot" :class="`status-dot--${user.status}`" />
        </div>
        <div class="member-info">
          <span class="member-name">{{ user.username }}</span>
          <span v-if="user.customStatus" class="member-status">{{ user.customStatus }}</span>
        </div>
      </div>
    </div>
    <div class="section" v-if="offlineMembers.length">
      <div class="section-title">오프라인 — {{ offlineMembers.length }}</div>
      <div v-for="user in offlineMembers" :key="user.id" class="member-item member-item--offline">
        <div class="avatar-wrap">
          <img :src="user.avatarUrl || `https://placehold.co/32/72767d/fff?text=${user.username[0]}`" class="avatar" />
          <span class="status-dot status-dot--offline" />
        </div>
        <span class="member-name">{{ user.username }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '~/store/data'
import { useUIStore } from '~/store/ui'

const store = useDataStore()
const uiStore = useUIStore()

const allUsers = computed(() => Object.values(store.users))
const onlineMembers = computed(() => allUsers.value.filter(u => u.status !== 'offline'))
const offlineMembers = computed(() => allUsers.value.filter(u => u.status === 'offline'))
</script>

<style scoped>
.member-panel {
  width: 240px;
  flex-shrink: 0;
  background: var(--bg-secondary);
  overflow-y: auto;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.section { margin-bottom: 12px; }
.section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--c-text-muted);
  padding: 6px 8px;
  letter-spacing: 0.5px;
}
.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s;
}
.member-item:hover { background: var(--bg-modifier-hover); }
.member-item--offline { opacity: 0.5; }
.avatar-wrap { position: relative; flex-shrink: 0; }
.avatar { width: 32px; height: 32px; border-radius: 50%; }
.status-dot {
  position: absolute;
  bottom: -1px; right: -1px;
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 2px solid var(--bg-secondary);
}
.status-dot--online { background: #23a559; }
.status-dot--idle { background: #f0b132; }
.status-dot--dnd { background: #f23f42; }
.status-dot--offline { background: #80848e; }
.member-info { display: flex; flex-direction: column; min-width: 0; }
.member-name { font-size: 14px; color: var(--c-text-normal); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.member-status { font-size: 11px; color: var(--c-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

@media (max-width: 1024px) { .member-panel { display: none; } }
</style>
