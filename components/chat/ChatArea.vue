<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';
import MessageItem from './MessageItem.vue';

const store = useDataStore();
const uiStore = useUIStore();
const activeChannel = computed(() => {
  const c = store.channels.find(c => c.id === store.activeChannelId);
  return c || { name: 'unknown', type: 'text' };
});

const messages = computed(() => store.getCurrentChannelMessages);
const users = computed(() => store.users);

const inputVal = ref('');
const messagesEndRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesEndRef.value) {
    messagesEndRef.value.scrollIntoView({ behavior: 'smooth' });
  }
};

watch(() => messages.value.length, scrollToBottom);
watch(() => store.activeChannelId, scrollToBottom);

onMounted(() => {
  scrollToBottom();
});

const handleSend = () => {
  if (!inputVal.value.trim()) return;
  store.sendMessage(inputVal.value);
  inputVal.value = '';
  
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto';
    }
  });
};


const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

const adjustHeight = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = `${Math.min(target.scrollHeight, 300)}px`; // Max height cap
};
</script>

<template>
  <main class="chat-area">
    <header class="chat-header">
      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn mobile-only" @click="uiStore.toggleMobileSidebar()">
        ☰
      </button>

      <div class="header-icon">{{ activeChannel.type === 'dm' ? '@' : '#' }}</div>
      <h3 class="header-title">{{ activeChannel.name }}</h3>
      <div class="header-desc" v-if="activeChannel.type === 'text'">
        <!-- Description could go here -->
      </div>
    </header>

    <div class="messages-list">
      <div class="empty-channel-placeholder" v-if="messages.length === 0">
        <div class="hashtag-circle">{{ activeChannel.type === 'dm' ? '@' : '#' }}</div>
        <h1>Welcome to {{ activeChannel.type === 'dm' ? '' : '#' }}{{ activeChannel.name }}!</h1>
        <p>This is the start of the {{ activeChannel.type === 'dm' ? 'conversation with' : 'channel #' }} {{ activeChannel.name }}.</p>
      </div>

      
      <MessageItem 
        v-for="msg in messages" 
        :key="msg.id" 
        :message="msg"
        :author="users[msg.authorId]"
      />
      <div ref="messagesEndRef" class="scroll-anchor"></div>
    </div>

    <div class="input-area">
      <div class="input-wrapper">
        <div class="upload-btn">+</div>
        <textarea 
          ref="textareaRef"
          v-model="inputVal"
          @keydown="handleKeydown"
          @input="adjustHeight"
          rows="1"
          :placeholder="`Message #${activeChannel.name}`"
          class="chat-input"
        ></textarea>

        <div class="emoji-btn">😊</div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  min-width: 0; /* Prevent flex overflow */
}

.chat-header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 0 rgba(0,0,0,0.2);
  flex-shrink: 0;
  background-color: var(--bg-primary); /* Ensure bg is opaque */
}

/* Mobile Menu Button */
.mobile-menu-btn {
  background: none;
  border: none;
  color: var(--c-text-normal);
  font-size: 24px;
  cursor: pointer;
  margin-right: 16px;
  padding: 0;
  display: none; /* Hidden by default (desktop) */
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }
}

.header-icon {
  color: var(--c-text-muted);
  font-size: 24px;
  margin-right: 8px;
}
.header-title {
  color: var(--c-text-header);
  font-weight: 700;
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.messages-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
}

.scroll-anchor { height: 1px; }

.empty-channel-placeholder {
  margin-top: auto;
  padding: 16px;
  margin-bottom: 20px;
}
.hashtag-circle {
  width: 68px;
  height: 68px;
  background-color: #41434a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  margin-bottom: 8px;
}
.empty-channel-placeholder h1 {
  color: var(--c-text-header);
  margin-bottom: 8px;
}

/* Input Area */
.input-area {
  padding: 0 16px 24px;
  flex-shrink: 0;
}

.input-wrapper {
  background-color: #383a40;
  border-radius: 8px;
  display: flex;
  /* Align items to bottom so icons stay at bottom when textarea grows */
  align-items: flex-end; 
  padding: 10px 16px;
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--c-text-normal);
  /* Remove fixed padding, rely on wrapper or minimal padding */
  padding: 0;
  font-size: 1rem;
  outline: none;
  resize: none;
  max-height: 50vh;
  min-height: 24px;
  line-height: 1.5;
  font-family: inherit;
}

/* Scrollbar for textarea */
.chat-input::-webkit-scrollbar {
  width: 4px;
}
.chat-input::-webkit-scrollbar-thumb {
  background-color: #202225;
}

.upload-btn, .emoji-btn {
  color: var(--c-text-muted);
  cursor: pointer;
  font-size: 20px;
  margin: 0 16px 0 0;
  /* Adjust line-height or padding to align with text baseline */
  line-height: 24px; 
}
.emoji-btn { margin: 0 0 0 16px; }

.upload-btn:hover, .emoji-btn:hover {
  color: var(--c-text-normal);
}
</style>

