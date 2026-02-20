<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';
import { useAuthStore } from '~/store/auth';

const store = useDataStore();
const uiStore = useUIStore();
const authStore = useAuthStore();

// auth store 유저 우선, 없으면 data store fallback
const currentUser = computed(() => authStore.currentUser || store.currentUser);

const statusOptions = ['online', 'idle', 'dnd', 'offline'] as const;
const statusLabels = { online: '온라인', idle: '자리 비움', dnd: '방해 금지', offline: '오프라인' };
const showStatusMenu = ref(false);

const setStatus = (status: string) => {
  if (store.currentUser) store.currentUser.status = status as any;
  showStatusMenu.value = false;
};

const handleLogout = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    await authStore.logout();
  }
};
</script>

<template>
  <div class="user-panel" v-if="currentUser">
    <!-- 상태 변경 메뉴 -->
    <Teleport to="body">
      <div v-if="showStatusMenu" class="status-menu" @click.stop>
        <div
          v-for="s in statusOptions" :key="s"
          class="status-option"
          :class="{ active: currentUser.status === s }"
          @click="setStatus(s)"
        >
          <span class="status-dot-sm" :class="`status-dot-sm--${s}`" />
          {{ statusLabels[s] }}
        </div>
      </div>
    </Teleport>
    <div v-if="showStatusMenu" class="status-overlay" @click="showStatusMenu = false" />

    <!-- 아바타 (클릭 시 상태 메뉴) -->
    <div class="user-avatar-wrapper" @click="showStatusMenu = !showStatusMenu">
      <img
        :src="currentUser.avatarUrl || `https://placehold.co/32/5865f2/fff?text=${currentUser.username[0]}`"
        class="user-avatar"
      />
      <div class="status-indicator" :class="currentUser.status" />
    </div>

    <div class="user-info">
      <div class="username">{{ currentUser.username }}</div>
      <div class="discriminator">#{{ currentUser.discriminator }}</div>
    </div>

    <div class="user-actions">
      <button class="icon-btn" title="설정" @click="uiStore.openSettings('account')">⚙️</button>
      <button class="icon-btn icon-btn--logout" title="로그아웃" @click="handleLogout">🚪</button>
    </div>
  </div>
</template>

<style scoped>
.user-panel {
  height: 52px; background: #232428;
  padding: 0 8px; display: flex; align-items: center;
  flex-shrink: 0; position: relative;
}
.user-avatar-wrapper {
  position: relative; margin-right: 8px;
  cursor: pointer; flex-shrink: 0;
}
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  object-fit: cover; transition: opacity 0.15s;
}
.user-avatar-wrapper:hover .user-avatar { opacity: 0.85; }
.status-indicator {
  position: absolute; bottom: -1px; right: -1px;
  width: 12px; height: 12px; border-radius: 50%;
  border: 2px solid #232428;
}
.status-indicator.online { background: var(--c-online); }
.status-indicator.idle { background: var(--c-idle); }
.status-indicator.dnd { background: var(--c-dnd); }
.status-indicator.offline { background: var(--c-offline); }

.user-info { flex: 1; min-width: 0; }
.username { font-size: 13px; font-weight: 600; color: var(--c-text-header); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.discriminator { font-size: 11px; color: var(--c-text-muted); }

.user-actions { display: flex; gap: 2px; }
.icon-btn {
  background: none; border: none; cursor: pointer;
  font-size: 16px; padding: 4px 6px; border-radius: 4px;
  opacity: 0.6; transition: opacity 0.15s, background 0.15s;
}
.icon-btn:hover { opacity: 1; background: var(--bg-modifier-hover); }
.icon-btn--logout:hover { color: var(--c-danger); }

/* 상태 메뉴 */
.status-overlay {
  position: fixed; inset: 0; z-index: 199;
}
.status-menu {
  position: fixed; bottom: 60px; left: 8px;
  background: var(--bg-floating, #18191c);
  border: 1px solid var(--bg-modifier-accent);
  border-radius: 8px; padding: 4px;
  min-width: 160px; z-index: 200;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.status-option {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 4px;
  cursor: pointer; font-size: 14px; color: var(--c-text-normal);
  transition: background 0.1s;
}
.status-option:hover, .status-option.active { background: var(--bg-modifier-hover); }
.status-dot-sm {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}
.status-dot-sm--online { background: var(--c-online); }
.status-dot-sm--idle { background: var(--c-idle); }
.status-dot-sm--dnd { background: var(--c-dnd); }
.status-dot-sm--offline { background: var(--c-offline); }
</style>
