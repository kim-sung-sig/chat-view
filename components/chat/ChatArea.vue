<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import { useDataStore } from '~/store/data';
import MessageItem from './MessageItem.vue';

const store = useDataStore();
const activeChannel = computed(() => {
  const c = store.channels.find(c => c.id === store.activeChannelId);
  return c || { name: 'unknown', type: 'text' };
});

const messages = computed(() => store.getCurrentChannelMessages);
const users = computed(() => store.users);

const inputVal = ref('');
const messagesEndRef = ref<HTMLElement | null>(null);

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
};

// Auto focus logic could be added here
</script>

<template>
  <main class="chat-area">
    <header class="chat-header">
      <div class="header-icon">#</div>
      <h3 class="header-title">{{ activeChannel.name }}</h3>
      <div class="header-desc" v-if="activeChannel.type === 'text'">
        <!-- Description could go here -->
      </div>
    </header>

    <div class="messages-list">
      <div class="empty-channel-placeholder" v-if="messages.length === 0">
        <div class="hashtag-circle">#</div>
        <h1>Welcome to #{{ activeChannel.name }}!</h1>
        <p>This is the start of the #{{ activeChannel.name }} channel.</p>
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
        <input 
          v-model="inputVal"
          @keydown.enter.prevent="handleSend"
          type="text" 
          :placeholder="`Message #${activeChannel.name}`"
          class="chat-input"
        />
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
  align-items: center;
  padding: 0 16px;
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--c-text-normal);
  padding: 11px 0;
  font-size: 1rem;
  outline: none;
}

.upload-btn, .emoji-btn {
  color: var(--c-text-muted);
  cursor: pointer;
  font-size: 20px;
  margin: 0 16px 0 0;
}
.emoji-btn { margin: 0 0 0 16px; }

.upload-btn:hover, .emoji-btn:hover {
  color: var(--c-text-normal);
}
</style>
