<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue';
import { useChatStore } from '~/store/chat';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';
import MessageItem from './MessageItem.vue';
import MessageInput from './MessageInput.vue';

const chatStore = useChatStore();
const store = useDataStore();
const uiStore = useUIStore();

const activeChannel = computed(() => chatStore.getActiveChannel || { name: 'unknown', type: 'text' });
const messages = computed(() => chatStore.getCurrentChannelMessages);
const users = computed(() => store.users);

const messagesContainer = ref<HTMLElement | null>(null);
const messagesEndRef = ref<HTMLElement | null>(null);
const isAtBottom = ref(true);
const showScrollBtn = ref(false);

const scrollToBottom = async (force = false) => {
  await nextTick();
  if (force || isAtBottom.value) {
    messagesEndRef.value?.scrollIntoView({ behavior: force ? 'auto' : 'smooth' });
    showScrollBtn.value = false;
  } else {
    showScrollBtn.value = true;
  }
};

const onScroll = () => {
  if (!messagesContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  isAtBottom.value = scrollHeight - scrollTop - clientHeight < 80;
  if (isAtBottom.value) showScrollBtn.value = false;

  // 스크롤 위치 저장
  if (chatStore.activeChannelId) {
    uiStore.saveScrollPosition(chatStore.activeChannelId, scrollTop);
  }

  // 상단 도달 시 이전 메시지 로드
  if (scrollTop < 80) loadOlderMessages();
};

let loadingOlder = false;
const loadOlderMessages = async () => {
  if (loadingOlder || !chatStore.activeChannelId) return;
  loadingOlder = true;
  // cursor 기반 이전 메시지 로드는 스토어 구현에 따라 연동
  loadingOlder = false;
};

watch(() => messages.value.length, () => scrollToBottom());
watch(() => chatStore.activeChannelId, async (newId) => {
  if (!newId) return;
  await nextTick();
  // 저장된 스크롤 위치 복원
  const saved = uiStore.getScrollPosition(newId);
  if (saved >= 0 && messagesContainer.value) {
    messagesContainer.value.scrollTop = saved;
  } else {
    scrollToBottom(true);
  }
  // 읽음 처리
  uiStore.clearUnread(newId);
});

onMounted(() => {
  chatStore.initializeServices();
  scrollToBottom(true);
  uiStore.initTheme();
});
onUnmounted(() => chatStore.cleanup());
</script>

<template>
  <main class="chat-area">
    <!-- 헤더 -->
    <header class="chat-header">
      <button class="mobile-menu-btn mobile-only" @click="uiStore.toggleMobileSidebar()">☰</button>
      <div class="header-icon">{{ activeChannel.type === 'dm' ? '@' : '#' }}</div>
      <h3 class="header-title">{{ activeChannel.name }}</h3>
      <div class="header-spacer" />
      <!-- 채널 검색 단축키 표시 -->
      <button class="header-btn" title="채널 검색 (Ctrl+K)" @click="uiStore.toggleChannelSearch()">🔍</button>
      <!-- 멤버 목록 토글 -->
      <button
        class="header-btn"
        :class="{ active: uiStore.showMemberList }"
        title="멤버 목록"
        @click="uiStore.toggleMemberList()"
      >👥</button>
    </header>

    <!-- 메시지 목록 -->
    <div ref="messagesContainer" class="messages-list" @scroll="onScroll">
      <div class="empty-channel-placeholder" v-if="messages.length === 0">
        <div class="hashtag-circle">{{ activeChannel.type === 'dm' ? '@' : '#' }}</div>
        <h1>{{ activeChannel.type === 'dm' ? '' : '#' }}{{ activeChannel.name }} 에 오신 것을 환영합니다!</h1>
        <p>{{ activeChannel.type === 'dm' ? activeChannel.name + '과의 대화 시작입니다.' : '#' + activeChannel.name + ' 채널의 첫 메시지입니다.' }}</p>
      </div>

      <MessageItem
        v-for="(msg, i) in messages"
        :key="msg.id"
        :message="msg"
        :author="users[msg.authorId]"
        :prev-message="i > 0 ? messages[i - 1] : undefined"
      />
      <div ref="messagesEndRef" class="scroll-anchor" />
    </div>

    <!-- 스크롤 다운 버튼 -->
    <Transition name="fade">
      <button v-if="showScrollBtn" class="scroll-down-btn" @click="scrollToBottom(true)">
        ↓ 새 메시지
      </button>
    </Transition>

    <!-- 입력 영역 -->
    <MessageInput @sent="scrollToBottom(true)" />
  </main>
</template>

<style scoped>
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  min-width: 0;
  position: relative;
}
.chat-header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.2);
  flex-shrink: 0;
  background: var(--bg-primary);
}
.mobile-menu-btn {
  background: none; border: none; color: var(--c-text-normal);
  font-size: 24px; cursor: pointer; margin-right: 8px; display: none;
}
@media (max-width: 768px) { .mobile-menu-btn { display: block; } }
.header-icon { color: var(--c-text-muted); font-size: 24px; }
.header-title { color: var(--c-text-header); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.header-spacer { flex: 1; }
.header-btn {
  background: none; border: none; font-size: 20px; cursor: pointer;
  padding: 4px 6px; border-radius: 4px; opacity: 0.6; transition: opacity 0.15s;
}
.header-btn:hover, .header-btn.active { opacity: 1; }

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
}
.scroll-anchor { height: 1px; }
.empty-channel-placeholder {
  margin-top: auto;
  padding: 24px 16px 16px;
}
.hashtag-circle {
  width: 68px; height: 68px;
  background: #41434a;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 40px; color: white; margin-bottom: 12px;
}
.empty-channel-placeholder h1 { font-size: 24px; margin-bottom: 8px; }
.empty-channel-placeholder p { color: var(--c-text-muted); }

/* 스크롤 다운 버튼 */
.scroll-down-btn {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--brand-experiment);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 10;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
