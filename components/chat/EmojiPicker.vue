<template>
  <Teleport to="body">
    <div v-if="show" class="emoji-overlay" @click.self="$emit('close')">
      <div class="emoji-picker" :style="pickerStyle">
        <!-- 검색 -->
        <div class="emoji-search">
          <input v-model="searchQuery" placeholder="이모지 검색..." autofocus />
        </div>
        <!-- 카테고리 탭 -->
        <div class="emoji-categories">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="cat-btn"
            :class="{ active: activeCat === cat.id }"
            :title="cat.label"
            @click="activeCat = cat.id"
          >{{ cat.icon }}</button>
        </div>
        <!-- 이모지 그리드 -->
        <div class="emoji-grid">
          <button
            v-for="emoji in filteredEmojis"
            :key="emoji"
            class="emoji-btn"
            @click="select(emoji)"
          >{{ emoji }}</button>
        </div>
        <!-- 자주 쓰는 이모지 -->
        <div v-if="recent.length && !searchQuery" class="emoji-recent">
          <div class="emoji-section-title">최근 사용</div>
          <div class="emoji-grid">
            <button v-for="e in recent" :key="e" class="emoji-btn" @click="select(e)">{{ e }}</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  show: boolean
  anchorEl?: HTMLElement | null
}>()
const emit = defineEmits<{ close: []; select: [emoji: string] }>()

const searchQuery = ref('')
const activeCat = ref('smileys')
const recent = ref<string[]>([])

const RECENT_KEY = 'emoji_recent'

const categories = [
  { id: 'smileys', icon: '😀', label: '표정' },
  { id: 'people', icon: '👋', label: '사람' },
  { id: 'nature', icon: '🌿', label: '자연' },
  { id: 'food', icon: '🍔', label: '음식' },
  { id: 'travel', icon: '✈️', label: '여행' },
  { id: 'objects', icon: '💡', label: '사물' },
  { id: 'symbols', icon: '❤️', label: '기호' },
]

const emojiMap: Record<string, string[]> = {
  smileys: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩'],
  people: ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','💪','🦾','🖐','🦶','👄','🦷','👅','👁️','👀','🧠','🫀','🫁','🦴'],
  nature: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🌱','🌲','🌳','🌴','🌵','🌾','☘️','🍀','🎍','🎋','🍁','🍂','🍃','🌺','🌸','🌼','🌻','🌞','🌝','🌚','🌕','🌙','⭐','🌟','💫','✨'],
  food: ['🍕','🍔','🍟','🌭','🍿','🧂','🥓','🥚','🍳','🧇','🥞','🧈','🍞','🥐','🥖','🥨','🧀','🥗','🥙','🥪','🌮','🌯','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍘','🍥','🥮','🍢','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍩','🍪','🌰','🥜','🍯'],
  travel: ['✈️','🚀','🛸','🚁','🛺','🚂','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚝','🚞','🚋','🚌','🚍','🚎','🚐','🚑','🚒','🚓','🚔','🚕','🚖','🚗','🚘','🚙','🛻','🚚','🚛','🚜','🏎️','🏍️','🛵','🚲','🛴','🛹','🛼','🚏','🛣️','🏖️','🏝️','🏜️','🏔️','🗻','🌋','🗺️'],
  objects: ['💡','🔦','🕯️','🪔','📱','💻','⌨️','🖥️','🖨️','🖱️','🖲️','💾','💿','📀','🎥','📷','📸','📹','📽️','🎬','📞','☎️','📟','📠','📺','📻','🧭','⏱️','⏰','⏲️','🕰️','⌚','📡','🔋','🔌','💰','💳','🪙','💹','📈','📉','📊'],
  symbols: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☯️','🕉️','🔯','🪬','🔱','⚜️','🔰','♻️','✅','❎','🆗','🆙','🆒','🆕','🆓','🔝','🆖','🅰️','🅱️','🆎','🅾️','🆑','🏧','🔞','🔃','🔄'],
}

const filteredEmojis = computed(() => {
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    return Object.values(emojiMap).flat().filter(e => e.includes(q)).slice(0, 60)
  }
  return emojiMap[activeCat.value] || []
})

const pickerStyle = computed(() => {
  if (!props.anchorEl) return { bottom: '60px', right: '8px' }
  const rect = props.anchorEl.getBoundingClientRect()
  return {
    position: 'fixed' as const,
    bottom: `${window.innerHeight - rect.top + 8}px`,
    right: `${window.innerWidth - rect.right}px`,
  }
})

const select = (emoji: string) => {
  // 최근 목록 업데이트
  recent.value = [emoji, ...recent.value.filter(e => e !== emoji)].slice(0, 20)
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(recent.value)) } catch {}
  emit('select', emoji)
  emit('close')
}

onMounted(() => {
  try { recent.value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch {}
})
</script>

<style scoped>
.emoji-overlay {
  position: fixed; inset: 0; z-index: 1000;
}
.emoji-picker {
  position: fixed;
  background: var(--bg-floating, #18191c);
  border: 1px solid var(--bg-modifier-accent, #3a3c40);
  border-radius: 12px;
  width: 360px;
  max-height: 420px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  overflow: hidden;
  bottom: 60px;
  right: 8px;
}
.emoji-search input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  background: var(--bg-secondary, #2f3136);
  border: none;
  color: var(--c-text-normal, #dcddde);
  font-size: 14px;
  outline: none;
  border-bottom: 1px solid var(--bg-modifier-accent, #3a3c40);
}
.emoji-categories {
  display: flex;
  gap: 2px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--bg-modifier-accent, #3a3c40);
  overflow-x: auto;
}
.cat-btn {
  background: none;
  border: none;
  font-size: 18px;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.1s, background 0.1s;
}
.cat-btn:hover, .cat-btn.active { opacity: 1; background: var(--bg-modifier-hover, #ffffff0f); }
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 2px;
  padding: 4px 8px;
}
.emoji-btn {
  background: none;
  border: none;
  font-size: 22px;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background 0.1s, transform 0.1s;
}
.emoji-btn:hover { background: var(--bg-modifier-hover, #ffffff0f); transform: scale(1.2); }
.emoji-recent { padding: 0 8px 8px; overflow-y: auto; }
.emoji-section-title { font-size: 11px; color: var(--c-text-muted, #72767d); text-transform: uppercase; font-weight: 600; padding: 6px 0 2px; }
</style>
