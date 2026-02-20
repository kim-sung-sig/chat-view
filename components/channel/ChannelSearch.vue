<template>
  <Teleport to="body">
    <Transition name="search-modal">
      <div v-if="uiStore.showChannelSearch" class="search-overlay" @click.self="close">
        <div class="search-box">
          <div class="search-header">
            <span class="search-icon">🔍</span>
            <input
              ref="inputRef"
              v-model="search.query.value"
              class="search-input"
              placeholder="채널 이름으로 검색..."
              @keydown.escape="close"
              @keydown.enter="selectFirst"
              @keydown.arrow-down.prevent="moveDown"
              @keydown.arrow-up.prevent="moveUp"
            />
            <kbd class="esc-key">ESC</kbd>
          </div>

          <div class="search-results">
            <div v-if="!search.query.value" class="search-hint">채널을 검색하세요</div>
            <div v-else-if="!search.results.value.length" class="search-hint">결과 없음</div>
            <button
              v-for="(ch, i) in search.results.value"
              :key="ch.id"
              class="result-item"
              :class="{ 'result-item--active': cursor === i }"
              @click="select(ch)"
              @mouseenter="cursor = i"
            >
              <span class="result-icon">{{ ch.type === 'dm' ? '@' : '#' }}</span>
              <span class="result-name">{{ ch.name }}</span>
              <span v-if="ch.unreadCount" class="result-badge">{{ ch.unreadCount }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '~/store/ui'
import { useDataStore } from '~/store/data'
import { useChannelSearch } from '~/composables/useChannelSearch'
import type { Channel } from '~/types'

const uiStore = useUIStore()
const store = useDataStore()
const search = useChannelSearch()
const inputRef = ref<HTMLInputElement | null>(null)
const cursor = ref(0)

watch(() => uiStore.showChannelSearch, async (v) => {
  if (v) { search.clear(); cursor.value = 0; await nextTick(); inputRef.value?.focus() }
})

const close = () => { uiStore.showChannelSearch = false; search.clear() }

const select = (ch: Channel) => {
  store.setActiveChannel(ch.id)
  if (ch.serverId) store.setActiveServer(ch.serverId)
  close()
}

const selectFirst = () => {
  if (search.results.value.length) select(search.results.value[cursor.value] as Channel)
}
const moveDown = () => { cursor.value = Math.min(cursor.value + 1, search.results.value.length - 1) }
const moveUp = () => { cursor.value = Math.max(cursor.value - 1, 0) }

// Ctrl+K 단축키
const onKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    uiStore.toggleChannelSearch()
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.search-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 500;
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 15vh;
}
.search-box {
  background: var(--bg-floating, #18191c);
  border-radius: 12px;
  width: 560px;
  max-width: 90vw;
  box-shadow: 0 16px 64px rgba(0,0,0,0.6);
  overflow: hidden;
}
.search-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--bg-modifier-accent);
}
.search-icon { font-size: 20px; }
.search-input {
  flex: 1; background: none; border: none;
  color: var(--c-text-normal); font-size: 18px; outline: none;
}
.search-input::placeholder { color: var(--c-text-muted); }
.esc-key {
  font-size: 11px; background: var(--bg-modifier-accent);
  padding: 2px 6px; border-radius: 4px; color: var(--c-text-muted);
  border: 1px solid var(--c-text-muted);
}
.search-results { max-height: 400px; overflow-y: auto; padding: 8px; }
.search-hint { color: var(--c-text-muted); text-align: center; padding: 24px; font-size: 14px; }
.result-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; background: none; border: none;
  padding: 10px 12px; border-radius: 8px;
  color: var(--c-text-normal); cursor: pointer; font-size: 15px;
  transition: background 0.1s;
}
.result-item--active, .result-item:hover { background: var(--bg-modifier-hover); }
.result-icon { color: var(--c-text-muted); font-style: normal; }
.result-name { flex: 1; text-align: left; }
.result-badge {
  background: var(--brand-experiment);
  color: #fff; font-size: 11px; font-weight: 700;
  border-radius: 10px; padding: 1px 6px;
}

.search-modal-enter-active, .search-modal-leave-active { transition: opacity 0.15s; }
.search-modal-enter-from, .search-modal-leave-to { opacity: 0; }
</style>
