<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';

const store = useDataStore();
const uiStore = useUIStore();
const activeTab = ref('online'); // online, all, pending, add
const addFriendInput = ref('');
const showSuccess = ref(false);

const friends = computed(() => store.getFriends);
const pending = computed(() => store.getPendingRequests);
const onlineFriends = computed(() => friends.value.filter(f => f.status !== 'offline'));

const setTab = (tab: string) => activeTab.value = tab;

const handleAddFriend = () => {
    if (!addFriendInput.value.trim()) return;
    store.sendFriendRequest(addFriendInput.value);
    addFriendInput.value = '';
    showSuccess.value = true;
    setTimeout(() => showSuccess.value = false, 3000);
};

const startDM = (userId: string) => {
    store.openDM(userId);
};
</script>

<template>
  <div class="friend-list-container">
    <header class="top-bar">
        <!-- Mobile Hamburger (Contextual) -->
        <button class="mobile-menu-btn mobile-only" @click="uiStore.toggleMobileSidebar()">
            ☰
        </button>

        <div class="icon-friends">👋</div>
        <div class="title">Friends</div>
        <div class="divider"></div>
        
        <nav class="tab-nav">
            <button class="tab-btn" :class="{ active: activeTab === 'online' }" @click="setTab('online')">Online</button>
            <button class="tab-btn" :class="{ active: activeTab === 'all' }" @click="setTab('all')">All</button>
            <button class="tab-btn" :class="{ active: activeTab === 'pending' }" @click="setTab('pending')">Pending</button>
            <button class="tab-btn add-btn" :class="{ active: activeTab === 'add' }" @click="setTab('add')">Add Friend</button>
        </nav>
    </header>

    <div class="content">
        <!-- Add Friend View -->
        <div v-if="activeTab === 'add'" class="tab-content add-friend-view">
            <h2>Add Friend</h2>
            <p>You can add friends with their username. It's case sensitive!</p>
            <div class="input-box" :class="{ success: showSuccess }">
                <input 
                  v-model="addFriendInput" 
                  type="text" 
                  placeholder="You can add friends with their username." 
                  @keydown.enter="handleAddFriend"
                />
                <button @click="handleAddFriend">Send Friend Request</button>
            </div>
            <div class="success-msg" v-if="showSuccess">Found user! Friend request sent.</div>
        </div>

        <!-- Lists -->
        <div v-else class="tab-content list-view">
            <h3 class="list-header" v-if="activeTab === 'online'">ONLINE — {{ onlineFriends.length }}</h3>
            <h3 class="list-header" v-if="activeTab === 'all'">ALL FRIENDS — {{ friends.length }}</h3>
            <h3 class="list-header" v-if="activeTab === 'pending'">PENDING — {{ pending.length }}</h3>

            <div class="list-items">
                <!-- List for Friends -->
                <template v-if="activeTab === 'online' || activeTab === 'all'">
                     <div v-for="friend in (activeTab === 'online' ? onlineFriends : friends)" :key="friend.id" class="friend-item" @click="startDM(friend.id)">
                        <div class="user-info">
                            <div class="avatar">
                                <img :src="friend.avatarUrl" />
                                <div class="status-dot" :class="friend.status"></div>
                            </div>
                            <div class="texts">
                                <div class="username text-header">
                                    {{ friend.username }}<span class="disc">#{{ friend.discriminator }}</span>
                                </div>
                                <div class="subtext">{{ friend.status }}</div>
                            </div>
                        </div>
                        <div class="actions">
                            <button class="action-btn chat" title="Message">💬</button>
                            <button class="action-btn more" title="More">⋮</button>
                        </div>
                     </div>
                </template>

                 <!-- List for Pending -->
                 <template v-if="activeTab === 'pending'">
                     <div v-for="user in pending" :key="user.id" class="friend-item">
                        <div class="user-info">
                            <div class="avatar"><img :src="user.avatarUrl" /></div>
                            <div class="texts">
                                <div class="username text-header">{{ user.username }}</div>
                                <div class="subtext">
                                    {{ user.type === 'pending_incoming' ? 'Incoming Friend Request' : 'Outgoing Friend Request' }}
                                </div>
                            </div>
                        </div>
                        <div class="actions" v-if="user.type === 'pending_incoming'">
                             <button class="action-btn accept" @click="store.acceptFriendRequest(user.id)">✓</button>
                             <button class="action-btn ignore">✕</button>
                        </div>
                     </div>
                 </template>

                 <!-- Empty State -->
                 <div class="empty-state" v-if="(activeTab === 'online' && onlineFriends.length === 0) || (activeTab === 'all' && friends.length === 0)">
                     <img src="https://placehold.co/200/313338/5865F2?text=Wumpus" />
                     <p>No one's around to play with Wumpus.</p>
                 </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.friend-list-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-primary);
    min-width: 0;
}

.top-bar {
    height: 48px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 0 rgba(0,0,0,0.2);
    /* Improve scrollbar handling on mobile horizontally */
    overflow-x: auto;
}

/* Tab Nav */
.tab-nav { display: flex; align-items: center; }
.divider { width: 1px; height: 24px; background-color: var(--bg-hover); margin: 0 16px; }

.tab-btn {
    background: none;
    border: none;
    color: var(--c-text-muted);
    padding: 2px 8px;
    margin: 0 4px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    white-space: nowrap;
}
.tab-btn:hover { background-color: var(--bg-hover); color: var(--c-text-normal); }
.tab-btn.active { background-color: #404249; color: var(--c-text-header); }
.tab-btn.add-btn { background-color: var(--c-success); color: white; }
.tab-btn.add-btn.active { background-color: transparent; color: var(--c-success); }


.icon-friends { margin-right: 8px; color: var(--c-text-muted); }
.title { font-weight: 700; color: var(--c-text-header); margin-right: 8px; }

.content {
    flex: 1;
    padding: 24px 32px;
    overflow-y: auto;
}

/* Add Friend View */
.add-friend-view h2 { color: var(--c-text-header); margin-bottom: 8px; }
.add-friend-view p { color: var(--c-text-muted); font-size: 14px; margin-bottom: 16px; }

.input-box {
    background-color: #1e1f22;
    border: 1px solid black;
    border-radius: 8px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    height: 50px;
}
.input-box.success { border-color: var(--c-success); }

.input-box input {
    flex: 1;
    background: none;
    border: none;
    color: var(--c-text-normal);
    outline: none;
    height: 100%;
}

.input-box button {
    background-color: #5865f2;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}
.success-msg { color: var(--c-success); margin-top: 8px; font-size: 14px; }


/* Lists */
.list-header {
    font-size: 12px;
    font-weight: 700;
    color: var(--c-text-muted);
    margin-bottom: 16px;
    border-bottom: 1px solid var(--bg-hover);
    padding-bottom: 8px;
}

.friend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-top: 1px solid var(--bg-hover);
    cursor: pointer;
    border-radius: 8px;
}
.friend-item:hover {
    background-color: var(--bg-hover);
}

.user-info { display: flex; align-items: center; }
.avatar { 
    width: 32px; height: 32px; 
    position: relative; 
    margin-right: 12px;
}
.avatar img { width: 100%; height: 100%; border-radius: 50%; }
.status-dot {
    position: absolute; bottom: -2px; right: -2px;
    width: 10px; height: 10px; border-radius: 50%;
    border: 2px solid var(--bg-primary);
}
.status-dot.online { background-color: var(--c-success); }
.status-dot.idle { background-color: #f0b232; }
.status-dot.dnd { background-color: var(--c-danger); }
.status-dot.offline { background-color: #747f8d; }

.texts { display: flex; flex-direction: column; }
.username { font-weight: 600; font-size: 16px; }
.disc { color: var(--c-text-muted); font-size: 14px; margin-left: 4px; display: none; }
.friend-item:hover .disc { display: inline; }
.subtext { font-size: 12px; color: var(--c-text-muted); }

.actions { display: flex; gap: 8px; }
.action-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    background-color: #2b2d31;
    border: none;
    color: var(--c-text-normal);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
}
.action-btn:hover { color: var(--c-text-header); }
.action-btn.accept { color: var(--c-success); }
.action-btn.ignore { color: var(--c-danger); }

/* Mobile Menu Button Override */
.mobile-menu-btn {
    margin-right: 12px;
}

.empty-state {
    text-align: center;
    margin-top: 40px;
}
</style>
