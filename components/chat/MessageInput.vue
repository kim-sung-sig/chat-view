<template>
  <div class="input-container">
    <!-- 답장 미리보기 -->
    <div v-if="replyTo" class="reply-preview">
      <div class="reply-bar"></div>
      <div class="reply-content">
        <span class="reply-label">↩ 답장 중:</span>
        <span class="reply-text">{{ replyTo.content.slice(0, 80) }}</span>
      </div>
      <button class="reply-close" @click="uiStore.setReplyTo(null)">✕</button>
    </div>

    <div class="input-wrapper">
      <!-- 파일 첨부 -->
      <button class="icon-btn" title="파일 첨부" @click="fileInput?.click()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
      </button>
      <input ref="fileInput" type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.zip" hidden @change="onFileChange" />

      <!-- 텍스트 입력 -->
      <textarea
        ref="textareaRef"
        v-model="inputVal"
        :placeholder="placeholder"
        class="chat-input"
        rows="1"
        @keydown="handleKeydown"
        @input="adjustHeight"
        @paste="onPaste"
      />

      <!-- 이모지 버튼 -->
      <button ref="emojiBtnRef" class="icon-btn emoji-toggle" title="이모지" @click.stop="showEmoji = !showEmoji">😊</button>

      <!-- 전송 버튼 (모바일) -->
      <button v-if="inputVal.trim()" class="icon-btn send-btn" @click="handleSend">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>

    <!-- 파일 프리뷰 -->
    <div v-if="pendingFiles.length" class="file-preview-strip">
      <div v-for="(f, i) in pendingFiles" :key="i" class="file-preview-item">
        <img v-if="f.previewUrl" :src="f.previewUrl" class="file-thumb" />
        <span v-else class="file-icon">📄</span>
        <span class="file-name">{{ f.file.name }}</span>
        <button class="file-remove" @click="pendingFiles.splice(i, 1)">✕</button>
      </div>
    </div>

    <!-- 이모지 피커 -->
    <EmojiPicker
      :show="showEmoji"
      :anchor-el="emojiBtnRef"
      @close="showEmoji = false"
      @select="insertEmoji"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useUIStore } from '~/store/ui'
import { useChatStore } from '~/store/chat'
import { useDataStore } from '~/store/data'
import EmojiPicker from './EmojiPicker.vue'

const props = defineProps<{ placeholder?: string }>()
const emit = defineEmits<{ sent: [] }>()

const uiStore = useUIStore()
const chatStore = useChatStore()
const dataStore = useDataStore()

const inputVal = ref('')
const showEmoji = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const emojiBtnRef = ref<HTMLElement | null>(null)

interface PendingFile { file: File; previewUrl?: string }
const pendingFiles = ref<PendingFile[]>([])

const replyTo = computed(() => {
  if (!uiStore.replyToMessageId) return null
  const msgs = chatStore.getCurrentChannelMessages
  return msgs.find(m => m.id === uiStore.replyToMessageId) || null
})

const placeholder = computed(() =>
  props.placeholder || `메시지 보내기 #${chatStore.getActiveChannel?.name || ''}`
)

const handleSend = async () => {
  if (!inputVal.value.trim() && !pendingFiles.value.length) return

  try {
    if (pendingFiles.value.length) {
      // 파일 전송 (현재는 텍스트와 함께 전송)
      for (const pf of pendingFiles.value) {
        if (pf.previewUrl) {
          await chatStore.sendMessage(inputVal.value || ' ', 'IMAGE', pf.previewUrl)
        }
      }
      pendingFiles.value = []
    }

    if (inputVal.value.trim()) {
      await chatStore.sendMessage(inputVal.value, 'TEXT')
    }

    inputVal.value = ''
    uiStore.setReplyTo(null)
    nextTick(() => {
      if (textareaRef.value) textareaRef.value.style.height = 'auto'
    })
    emit('sent')
  } catch (e) {
    console.error('전송 실패:', e)
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
  if (e.key === 'Escape') {
    uiStore.setReplyTo(null)
    showEmoji.value = false
  }
}

const adjustHeight = (e: Event) => {
  const t = e.target as HTMLTextAreaElement
  t.style.height = 'auto'
  t.style.height = `${Math.min(t.scrollHeight, 200)}px`
}

const insertEmoji = (emoji: string) => {
  inputVal.value += emoji
  nextTick(() => textareaRef.value?.focus())
}

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  Array.from(files).forEach(file => {
    const item: PendingFile = { file }
    if (file.type.startsWith('image/')) {
      item.previewUrl = URL.createObjectURL(file)
    }
    pendingFiles.value.push(item)
  })
}

const onPaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of Array.from(items)) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        pendingFiles.value.push({ file, previewUrl: URL.createObjectURL(file) })
      }
    }
  }
}
</script>

<style scoped>
.input-container {
  padding: 0 16px 16px;
  flex-shrink: 0;
}
.reply-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-secondary);
  border-radius: 8px 8px 0 0;
  padding: 8px 12px;
  border-bottom: 1px solid var(--bg-modifier-accent);
}
.reply-bar { width: 3px; height: 100%; background: var(--brand-experiment); border-radius: 2px; align-self: stretch; }
.reply-content { flex: 1; min-width: 0; }
.reply-label { font-size: 12px; color: var(--brand-experiment); font-weight: 600; }
.reply-text { font-size: 12px; color: var(--c-text-muted); margin-left: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.reply-close { background: none; border: none; color: var(--c-text-muted); cursor: pointer; font-size: 14px; padding: 0 4px; }

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: var(--bg-channeltextarea);
  border-radius: 8px;
  padding: 8px 12px;
}
.chat-input {
  flex: 1;
  background: none;
  border: none;
  color: var(--c-text-normal);
  font-size: 15px;
  resize: none;
  outline: none;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
  font-family: inherit;
}
.chat-input::placeholder { color: var(--c-text-muted); }
.icon-btn {
  background: none;
  border: none;
  color: var(--c-icon-normal);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 20px;
  flex-shrink: 0;
  transition: color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-btn:hover { color: var(--c-icon-interactive-hover); }
.send-btn { color: var(--brand-experiment); }
.emoji-toggle { margin-bottom: 2px; }

.file-preview-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 0 4px;
}
.file-preview-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 6px 10px;
  position: relative;
}
.file-thumb { width: 48px; height: 48px; object-fit: cover; border-radius: 4px; }
.file-icon { font-size: 24px; }
.file-name { font-size: 12px; color: var(--c-text-normal); max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-remove {
  background: rgba(0,0,0,0.6);
  border: none;
  color: #fff;
  font-size: 11px;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: -6px;
  right: -6px;
}
</style>
