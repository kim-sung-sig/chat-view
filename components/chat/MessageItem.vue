<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { Message, User } from '~/types'
import { useChatStore } from '~/store/chat'
import { useUIStore } from '~/store/ui'
import { useDataStore } from '~/store/data'
import MessageActions from './MessageActions.vue'
import MessageReactions from './MessageReactions.vue'
import EmojiPicker from './EmojiPicker.vue'

const props = defineProps<{
  message: Message
  author?: User
  prevMessage?: Message
}>()

const chatStore = useChatStore()
const uiStore = useUIStore()
const dataStore = useDataStore()

const hovered = ref(false)
const showEmojiPicker = ref(false)
const lightboxUrl = ref<string | null>(null)
const isEditing = ref(false)
const editContent = ref('')
const editRef = ref<HTMLTextAreaElement | null>(null)

const isOwn = computed(() => props.message.authorId === dataStore.currentUser?.id || props.message.authorId === 'me')

// 5분 이내 같은 작성자면 그룹핑
const isGrouped = computed(() => {
  if (!props.prevMessage) return false
  if (props.prevMessage.authorId !== props.message.authorId) return false
  const diff = new Date(props.message.timestamp).getTime() - new Date(props.prevMessage.timestamp).getTime()
  return diff < 5 * 60 * 1000
})

const userColor = computed(() => {
  // 간단한 해시로 사용자별 색상
  const colors = ['#f23f42','#f0b132','#23a559','#00aff4','#5865f2','#eb459e','#faa61a']
  const id = props.author?.id || ''
  let hash = 0
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) % colors.length
  return colors[hash] || '#dcddde'
})

const formatTime = (d: Date | string) =>
  new Date(d).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

const formatTimeTiny = (d: Date | string) =>
  new Date(d).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

const parsedContent = computed(() => {
  let html = props.message.content
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/@(\w+)/g, '<span class="mention">@$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
  return html
})

const startEdit = () => {
  editContent.value = props.message.content
  isEditing.value = true
  nextTick(() => editRef.value?.focus())
}
const cancelEdit = () => { isEditing.value = false }
const saveEdit = async () => {
  if (editContent.value.trim() === props.message.content) { cancelEdit(); return }
  await chatStore.editMessage(props.message.id, editContent.value.trim())
  isEditing.value = false
}
const handleDelete = async () => {
  if (confirm('메시지를 삭제하시겠습니까?')) {
    await chatStore.deleteMessage(props.message.id)
  }
}
</script>

<template>
  <div
    class="message-item"
    :class="{
      'message-item--grouped': isGrouped,
      'message-item--pending': message.isPending,
      'message-item--own': isOwn,
    }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- 액션 버튼 (hover 시) -->
    <MessageActions
      :visible="hovered && !isEditing"
      :is-own="isOwn"
      @react="showEmojiPicker = true"
      @reply="uiStore.setReplyTo(message.id)"
      @edit="startEdit"
      @delete="handleDelete"
    />

    <!-- 그룹핑: 이전과 같은 유저면 아바타 숨김 -->
    <div class="avatar-col">
      <img
        v-if="!isGrouped"
        :src="author?.avatarUrl || `https://placehold.co/40/5865f2/fff?text=${(author?.username || '?')[0]}`"
        class="avatar"
        :alt="author?.username"
      />
      <span v-else class="timestamp-tiny">{{ formatTimeTiny(message.timestamp) }}</span>
    </div>

    <div class="content-wrapper">
      <!-- 작성자 / 시간 헤더 -->
      <header v-if="!isGrouped" class="header">
        <span class="username" :style="{ color: userColor }">{{ author?.username || 'Unknown' }}</span>
        <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
        <span v-if="message.edited" class="edited-label">(수정됨)</span>
      </header>

      <!-- 편집 모드 -->
      <div v-if="isEditing" class="edit-form">
        <textarea
          ref="editRef"
          v-model="editContent"
          class="edit-textarea"
          @keydown.enter.exact.prevent="saveEdit"
          @keydown.escape="cancelEdit"
        />
        <div class="edit-actions">
          <span class="edit-hint">ESC 취소 · Enter 저장</span>
          <button class="btn-cancel" @click="cancelEdit">취소</button>
          <button class="btn-save" @click="saveEdit">저장</button>
        </div>
      </div>

      <!-- 일반 메시지 내용 -->
      <template v-else>
        <!-- 텍스트 -->
        <div v-if="message.content" class="message-content" v-html="parsedContent" />

        <!-- 이미지 -->
        <div v-if="message.imageUrls?.length" class="image-grid">
          <img
            v-for="(url, i) in message.imageUrls"
            :key="i"
            :src="url"
            class="message-image"
            @click="lightboxUrl = url"
          />
        </div>

        <!-- 리액션 -->
        <MessageReactions
          v-if="message.reactions && Object.keys(message.reactions).length"
          :reactions="message.reactions"
          @toggle="(e) => chatStore.toggleReaction(message.id, e)"
          @add="showEmojiPicker = true"
        />
      </template>
    </div>

    <!-- 이모지 피커 -->
    <EmojiPicker
      :show="showEmojiPicker"
      @close="showEmojiPicker = false"
      @select="(e) => { chatStore.toggleReaction(message.id, e); showEmojiPicker = false }"
    />

    <!-- 이미지 라이트박스 -->
    <Teleport to="body">
      <div v-if="lightboxUrl" class="lightbox" @click="lightboxUrl = null">
        <img :src="lightboxUrl" class="lightbox-img" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.message-item {
  position: relative;
  display: flex;
  gap: 16px;
  padding: 2px 16px;
  margin-top: 17px;
  transition: background 0.1s;
}
.message-item--grouped { margin-top: 1px; }
.message-item--pending { opacity: 0.6; }
.message-item:hover { background: rgba(0,0,0,0.06); }

.avatar-col {
  width: 40px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}
.avatar:hover { opacity: 0.85; }
.timestamp-tiny {
  font-size: 11px;
  color: var(--c-text-muted);
  align-self: center;
  opacity: 0;
  transition: opacity 0.15s;
}
.message-item:hover .timestamp-tiny { opacity: 1; }

.content-wrapper { flex: 1; min-width: 0; }
.header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 2px; }
.username { font-weight: 600; font-size: 15px; cursor: pointer; }
.username:hover { text-decoration: underline; }
.timestamp { font-size: 12px; color: var(--c-text-muted); }
.edited-label { font-size: 11px; color: var(--c-text-muted); }

.message-content {
  color: var(--c-text-normal);
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}
.message-content :deep(.mention) {
  color: var(--brand-experiment);
  background: #5865f220;
  border-radius: 3px;
  padding: 0 2px;
  cursor: pointer;
}
.message-content :deep(code) {
  background: var(--bg-secondary);
  border-radius: 3px;
  padding: 0 4px;
  font-family: monospace;
  font-size: 13px;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
.message-image {
  max-width: 400px;
  max-height: 300px;
  border-radius: 4px;
  cursor: pointer;
  object-fit: contain;
  background: var(--bg-secondary);
}

/* 편집 */
.edit-form { display: flex; flex-direction: column; gap: 4px; }
.edit-textarea {
  background: var(--bg-channeltextarea);
  border: 1px solid var(--brand-experiment);
  border-radius: 6px;
  color: var(--c-text-normal);
  font-size: 15px;
  padding: 8px 12px;
  resize: none;
  outline: none;
  min-height: 40px;
  font-family: inherit;
}
.edit-actions { display: flex; align-items: center; gap: 8px; }
.edit-hint { font-size: 12px; color: var(--c-text-muted); flex: 1; }
.btn-cancel, .btn-save {
  padding: 4px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}
.btn-cancel { background: var(--bg-modifier-hover); color: var(--c-text-normal); }
.btn-save { background: var(--brand-experiment); color: #fff; }

/* 라이트박스 */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}
.lightbox-img { max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 4px; }
</style>
