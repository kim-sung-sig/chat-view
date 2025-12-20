<template>
  <div class="flex items-end gap-2">
    <!-- 파일 첨부 버튼 -->
    <BaseButton
      variant="ghost"
      size="md"
      @click="handleFileClick"
      :disabled="disabled"
    >
      <BaseIcon name="plus" size="sm" />
    </BaseButton>

    <input
      ref="fileInputRef"
      type="file"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <!-- 메시지 입력 영역 -->
    <div class="flex-1 relative">
      <textarea
        ref="textareaRef"
        v-model="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-workspace-border rounded-lg
               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
               resize-none bg-white dark:bg-workspace-sidebar text-gray-900 dark:text-workspace-text
               placeholder-gray-400 dark:placeholder-workspace-text-muted
               disabled:opacity-50 disabled:cursor-not-allowed"
        @keydown.enter.exact="handleEnter"
        @keydown.shift.enter.exact="handleShiftEnter"
        @input="adjustHeight"
      />

      <!-- 이모지 버튼 -->
      <button
        type="button"
        class="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-workspace-text
               transition-colors rounded"
        :disabled="disabled"
        @click="handleEmojiClick"
      >
        <BaseIcon name="emoji" size="sm" />
      </button>
    </div>

    <!-- 전송 버튼 -->
    <BaseButton
      variant="primary"
      size="md"
      :disabled="disabled || !canSend"
      @click="handleSend"
    >
      <BaseIcon name="send" size="sm" />
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

// ============================================
// Props & Emits
// ============================================
interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  maxRows?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '메시지를 입력하세요...',
  disabled: false,
  maxRows: 5,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  upload: [files: File[]]
}>()

// ============================================
// State
// ============================================
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const rows = ref(1)

// ============================================
// Computed
// ============================================
const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const canSend = computed(() => {
  return localValue.value.trim().length > 0
})

// ============================================
// Methods
// ============================================

/**
 * 메시지 전송
 */
const handleSend = () => {
  if (canSend.value) {
    emit('send')
    rows.value = 1
    adjustHeight()
  }
}

/**
 * Enter 키 처리
 */
const handleEnter = (event: KeyboardEvent) => {
  event.preventDefault()
  handleSend()
}

/**
 * Shift+Enter 키 처리 (줄바꿈)
 */
const handleShiftEnter = (event: KeyboardEvent) => {
  // 기본 동작 (줄바꿈) 허용
}

/**
 * 텍스트 영역 높이 자동 조절
 */
const adjustHeight = async () => {
  await nextTick()

  if (!textareaRef.value) return

  // 높이 리셋
  textareaRef.value.style.height = 'auto'

  // 스크롤 높이에 맞춰 조정
  const scrollHeight = textareaRef.value.scrollHeight
  const lineHeight = 24 // px
  const maxHeight = lineHeight * props.maxRows

  if (scrollHeight > maxHeight) {
    textareaRef.value.style.height = `${maxHeight}px`
    textareaRef.value.style.overflowY = 'auto'
  } else {
    textareaRef.value.style.height = `${scrollHeight}px`
    textareaRef.value.style.overflowY = 'hidden'
  }

  // rows 업데이트
  rows.value = Math.min(
    Math.ceil(scrollHeight / lineHeight),
    props.maxRows
  )
}

/**
 * 파일 선택 버튼 클릭
 */
const handleFileClick = () => {
  fileInputRef.value?.click()
}

/**
 * 파일 선택
 */
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (files.length > 0) {
    emit('upload', files)
  }

  // 입력 초기화
  target.value = ''
}

/**
 * 이모지 선택
 */
const handleEmojiClick = () => {
  // TODO: 이모지 피커 표시
  console.log('Show emoji picker')
}

// ============================================
// Watch
// ============================================

// 값 변경 시 높이 조절
watch(() => props.modelValue, () => {
  adjustHeight()
})
</script>

