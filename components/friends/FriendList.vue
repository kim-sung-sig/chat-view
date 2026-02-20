<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';

const store = useDataStore();
const uiStore = useUIStore();
const activeTab = ref('online');
const addFriendInput = ref('');
const showSuccess = ref(false);
const pendingSubTab = ref<'incoming' | 'outgoing'>('incoming');
const contextMenu = ref<{ userId: string; x: number; y: number } | null>(null);
const nicknameEdit = ref<{ userId: string; value: string } | null>(null);

const friends = computed(() => store.getFriends);
const pending = computed(() => store.getPendingRequests as any[]);
const onlineFriends = computed(() => friends.value.filter(f => f?.status !== 'offline'));
const pendingIncoming = computed(() => pending.value.filter(r => r.type === 'pending_incoming'));
const pendingOutgoing = computed(() => pending.value.filter(r => r.type === 'pending_outgoing'));
const blockedUsers = computed(() =>
  store.relationships.filter(r => r.type === 'blocked').map(r => store.users[r.userId]).filter(Boolean)
);

const setTab = (tab: string) => { activeTab.value = tab; contextMenu.value = null; };

const handleAddFriend = () => {
  if (!addFriendInput.value.trim()) return;
  store.sendFriendRequest?.(addFriendInput.value);
  addFriendInput.value = '';
  showSuccess.value = true;
  setTimeout(() => showSuccess.value = false, 3000);
};

const startDM = (userId: string) => {
  store.openDM?.(userId);
  contextMenu.value = null;
};

const openCtxMenu = (e: MouseEvent, userId: string) => {
  e.preventDefault();
  contextMenu.value = { userId, x: e.clientX, y: e.clientY };
};
const closeCtxMenu = () => { contextMenu.value = null; };

const removeFriend = (userId: string) => {
  store.removeFriend?.(userId);
  closeCtxMenu();
};

const acceptRequest = (userId: string) => store.acceptFriendRequest?.(userId);
const rejectRequest = (userId: string) => store.rejectFriendRequest?.(userId);
const toggleFavorite = (userId: string) => store.toggleFavorite?.(userId);

const statusLabel = (status: string) => ({ online: '온라인', idle: '자리 비움', dnd: '방해 금지', offline: '오프라인' }[status] || status);
</script>

<template>
  <div class="friend-list-container" @click="closeCtxMenu">
    <header class="top-bar">
      <button class="mobile-menu-btn mobile-only" @click="uiStore.toggleMobileSidebar()">☰</button>
      <div class="icon-friends">👋</div>
      <div class="title">친구</div>
      <div class="divider"></div>
      <nav class="tab-nav">
        <button class="tab-btn" :class="{ active: activeTab === 'online' }" @click="setTab('online')">온라인</button>
        <button class="tab-btn" :class="{ active: activeTab === 'all' }" @click="setTab('all')">전체</button>
        <button class="tab-btn" :class="{ active: activeTab === 'pending' }" @click="setTab('pending')">
          대기 중
          <span v-if="pendingIncoming.length" class="badge">{{ pendingIncoming.length }}</span>
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'blocked' }" @click="setTab('blocked')">차단</button>
        <button class="tab-btn add-btn" :class="{ active: activeTab === 'add' }" @click="setTab('add')">친구 추가</button>
      </nav>
    </header>

    <!-- 온라인/전체 탭 -->
    <div v-if="activeTab === 'online' || activeTab === 'all'" class="friend-section">
      <div class="section-label">
        {{ activeTab === 'online' ? `온라인 — ${onlineFriends.length}` : `모든 친구 — ${friends.length}` }}
      </div>
      <div
        v-for="friend in (activeTab === 'online' ? onlineFriends : friends)"
        :key="friend?.id"
        class="friend-item"
        @contextmenu.prevent="openCtxMenu($event, friend?.id)"
      >
        <div class="avatar-wrap">
          <img :src="friend?.avatarUrl || `https://placehold.co/32/5865f2/fff?text=${friend?.username?.[0]}`" class="avatar" />
          <span class="status-dot" :class="`status-dot--${friend?.status}`" />
        </div>
        <div class="friend-info">
          <div class="friend-name">
            {{ store.relationships.find(r => r.userId === friend?.id)?.nickname || friend?.username }}
            <span v-if="store.relationships.find(r => r.userId === friend?.id)?.favorite" class="fav-star" title="즐겨찾기">⭐</span>
          </div>
          <div class="friend-status">{{ statusLabel(friend?.status) }}</div>
        </div>
        <div class="friend-actions">
          <button class="action-btn" title="메시지" @click.stop="startDM(friend?.id)">💬</button>
          <button class="action-btn" title="즐겨찾기 토글" @click.stop="toggleFavorite(friend?.id)">⭐</button>
          <button class="action-btn action-btn--more" title="더보기" @click.stop="openCtxMenu($event, friend?.id)">⋯</button>
        </div>
      </div>
      <div v-if="(activeTab === 'online' ? onlineFriends : friends).length === 0" class="empty-state">
        {{ activeTab === 'online' ? '온라인 친구가 없습니다.' : '친구가 없습니다.' }}
      </div>
    </div>

    <!-- 대기 중 탭 -->
    <div v-else-if="activeTab === 'pending'" class="friend-section">
      <div class="sub-tabs">
        <button :class="{ active: pendingSubTab === 'incoming' }" @click="pendingSubTab = 'incoming'">
          받은 요청 <span v-if="pendingIncoming.length" class="badge">{{ pendingIncoming.length }}</span>
        </button>
        <button :class="{ active: pendingSubTab === 'outgoing' }" @click="pendingSubTab = 'outgoing'">
          보낸 요청
        </button>
      </div>
      <template v-if="pendingSubTab === 'incoming'">
        <div class="section-label">받은 친구 요청 — {{ pendingIncoming.length }}</div>
        <div v-for="r in pendingIncoming" :key="r.userId" class="friend-item">
          <img :src="store.users[r.userId]?.avatarUrl || `https://placehold.co/32/f0b132/fff?text=${store.users[r.userId]?.username?.[0]}`" class="avatar" />
          <div class="friend-info">
            <div class="friend-name">{{ store.users[r.userId]?.username || r.userId }}</div>
            <div class="friend-status">친구 요청을 보냈습니다</div>
          </div>
          <div class="friend-actions">
            <button class="action-btn action-btn--accept" title="수락" @click="acceptRequest(r.userId)">✓</button>
            <button class="action-btn action-btn--reject" title="거절" @click="rejectRequest(r.userId)">✗</button>
          </div>
        </div>
        <div v-if="!pendingIncoming.length" class="empty-state">받은 친구 요청이 없습니다.</div>
      </template>
      <template v-else>
        <div class="section-label">보낸 친구 요청 — {{ pendingOutgoing.length }}</div>
        <div v-for="r in pendingOutgoing" :key="r.userId" class="friend-item">
          <img :src="store.users[r.userId]?.avatarUrl || `https://placehold.co/32/5865f2/fff?text=?`" class="avatar" />
          <div class="friend-info">
            <div class="friend-name">{{ store.users[r.userId]?.username || r.userId }}</div>
            <div class="friend-status">요청 대기 중</div>
          </div>
          <div class="friend-actions">
            <button class="action-btn action-btn--reject" title="취소" @click="rejectRequest(r.userId)">✗</button>
          </div>
        </div>
        <div v-if="!pendingOutgoing.length" class="empty-state">보낸 친구 요청이 없습니다.</div>
      </template>
    </div>

    <!-- 차단 탭 -->
    <div v-else-if="activeTab === 'blocked'" class="friend-section">
      <div class="section-label">차단된 사용자 — {{ blockedUsers.length }}</div>
      <div v-for="user in blockedUsers" :key="user.id" class="friend-item friend-item--blocked">
        <img :src="user.avatarUrl || `https://placehold.co/32/da373c/fff?text=${user.username?.[0]}`" class="avatar" />
        <div class="friend-info">
          <div class="friend-name">{{ user.username }}</div>
          <div class="friend-status">차단됨</div>
        </div>
        <button class="action-btn" @click="store.unblockUser?.(user.id)">차단 해제</button>
      </div>
      <div v-if="!blockedUsers.length" class="empty-state">차단된 사용자가 없습니다.</div>
    </div>

    <!-- 친구 추가 탭 -->
    <div v-else-if="activeTab === 'add'" class="add-friend-section">
      <h2>친구 추가하기</h2>
      <p>사용자명으로 친구 요청을 보낼 수 있습니다.</p>
      <div class="add-input-wrap" :class="{ success: showSuccess }">
        <input
          v-model="addFriendInput"
          placeholder="사용자명#0000"
          @keydown.enter="handleAddFriend"
        />
        <button @click="handleAddFriend">친구 요청 보내기</button>
      </div>
      <div v-if="showSuccess" class="success-msg">✓ 친구 요청을 보냈습니다!</div>
    </div>

    <!-- 컨텍스트 메뉴 -->
    <Teleport to="body">
      <div
        v-if="contextMenu"
        class="ctx-menu"
        :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
        @click.stop
      >
        <button @click="startDM(contextMenu.userId)">💬 메시지 보내기</button>
        <button @click="toggleFavorite(contextMenu.userId)">⭐ 즐겨찾기 토글</button>
        <button class="ctx-danger" @click="removeFriend(contextMenu.userId)">친구 삭제</button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.friend-list-container {
  flex: 1; display: flex; flex-direction: column;
  background: var(--bg-primary); min-width: 0;
}
.top-bar {
  height: 48px; padding: 0 16px;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.2); flex-shrink: 0;
}
.mobile-menu-btn { background:none; border:none; color:var(--c-text-normal); font-size:24px; cursor:pointer; display:none; }
@media (max-width:768px) { .mobile-menu-btn { display:block; } }
.icon-friends { font-size: 22px; }
.title { font-weight: 700; color: var(--c-text-header); }
.divider { width: 1px; height: 24px; background: var(--bg-modifier-accent); margin: 0 4px; }
.tab-nav { display: flex; gap: 2px; }
.tab-btn {
  background: none; border: none; color: var(--c-text-muted); cursor: pointer;
  padding: 4px 10px; border-radius: 4px; font-size: 14px; font-weight: 500;
  display: flex; align-items: center; gap: 4px; transition: background 0.1s, color 0.1s;
}
.tab-btn:hover { background: var(--bg-modifier-hover); color: var(--c-text-normal); }
.tab-btn.active { background: var(--bg-modifier-accent); color: var(--c-text-header); }
.add-btn.active { background: var(--c-success); color: #fff; }
.badge { background: var(--c-danger); color: #fff; font-size: 11px; border-radius: 10px; padding: 1px 5px; }

.friend-section { flex: 1; overflow-y: auto; padding: 16px; }
.section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--c-text-muted); margin-bottom: 8px; padding: 0 4px; }
.sub-tabs { display: flex; gap: 4px; margin-bottom: 16px; }
.sub-tabs button { background: var(--bg-secondary); border: none; border-radius: 6px; padding: 6px 14px; color: var(--c-text-muted); cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 4px; }
.sub-tabs button.active { background: var(--brand-experiment); color: #fff; }

.friend-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px; cursor: pointer;
  transition: background 0.1s;
  border-bottom: 1px solid var(--bg-modifier-accent);
}
.friend-item:hover { background: var(--bg-modifier-hover); }
.friend-item--blocked { opacity: 0.6; }
.avatar-wrap { position: relative; flex-shrink: 0; }
.avatar { width: 32px; height: 32px; border-radius: 50%; }
.status-dot { position: absolute; bottom: -1px; right: -1px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--bg-primary); }
.status-dot--online { background: var(--c-online); }
.status-dot--idle { background: var(--c-idle); }
.status-dot--dnd { background: var(--c-dnd); }
.status-dot--offline { background: var(--c-offline); }
.friend-info { flex: 1; min-width: 0; }
.friend-name { font-size: 14px; font-weight: 600; color: var(--c-text-header); display: flex; align-items: center; gap: 4px; }
.fav-star { font-size: 12px; }
.friend-status { font-size: 12px; color: var(--c-text-muted); }
.friend-actions { display: flex; gap: 6px; opacity: 0; transition: opacity 0.15s; }
.friend-item:hover .friend-actions { opacity: 1; }
.action-btn { background: var(--bg-secondary); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; transition: background 0.1s; }
.action-btn:hover { background: var(--bg-hover); }
.action-btn--accept { background: #23a55920; color: var(--c-success); }
.action-btn--reject { background: #da373c20; color: var(--c-danger); }

.empty-state { text-align: center; color: var(--c-text-muted); padding: 40px; }

/* 친구 추가 */
.add-friend-section { padding: 24px; }
.add-friend-section h2 { font-size: 20px; margin-bottom: 8px; }
.add-friend-section p { color: var(--c-text-muted); margin-bottom: 16px; font-size: 14px; }
.add-input-wrap { display: flex; gap: 8px; background: var(--bg-tertiary); padding: 4px 4px 4px 16px; border-radius: 8px; border: 1px solid var(--bg-modifier-accent); transition: border-color 0.15s; }
.add-input-wrap.success { border-color: var(--c-success); }
.add-input-wrap input { flex: 1; background: none; border: none; color: var(--c-text-normal); font-size: 15px; outline: none; }
.add-input-wrap button { background: var(--brand-experiment); color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; flex-shrink: 0; }
.success-msg { margin-top: 8px; color: var(--c-success); font-size: 14px; font-weight: 500; }

/* 컨텍스트 메뉴 */
.ctx-menu {
  position: fixed; z-index: 1000;
  background: var(--bg-floating); border: 1px solid var(--bg-modifier-accent);
  border-radius: 8px; padding: 4px; min-width: 180px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.ctx-menu button { display: block; width: 100%; background: none; border: none; padding: 8px 12px; text-align: left; color: var(--c-text-normal); font-size: 14px; border-radius: 4px; cursor: pointer; }
.ctx-menu button:hover { background: var(--bg-modifier-hover); }
.ctx-danger { color: var(--c-danger) !important; }
</style>
