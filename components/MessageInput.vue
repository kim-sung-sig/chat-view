<template>
  <div class="relative">
    <div class="flex items-end gap-2">
      <!-- 파일 첨부 버튼 -->
      <BaseTooltip text="파일 첨부">
        <button
          class="p-2 rounded hover:bg-accent transition-colors flex-shrink-0"
          @click="$emit('upload')"
        >
          <BaseIcon name="plus" size="sm" class="text-muted-foreground" />
        </button>
      </BaseTooltip>

      <!-- 입력 영역 -->
      <div class="flex-1 relative">
        <textarea
          ref="inputRef"
          v-model="localValue"
          :placeholder="placeholder"
          :disabled="disabled"
          rows="1"
          class="w-full px-4 py-3 rounded-lg bg-secondary dark:bg-discord-hover border border-transparent focus:border-primary outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground transition-all max-h-32 scrollbar-thin"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.shift.enter="handleNewLine"
          @input="autoResize"
        />
      </div>

      <!-- 이모지 버튼 -->
      <BaseTooltip text="이모지">
        <button
          class="p-2 rounded hover:bg-accent transition-colors flex-shrink-0"
        >
          <BaseIcon name="emoji" size="sm" class="text-muted-foreground" />
        </button>
      </BaseTooltip>

      <!-- 전송 버튼 -->
      <BaseTooltip text="전송 (Enter)">
        <button
          @click="handleSend"
          :disabled="!localValue.trim() || disabled"
          class="p-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BaseIcon name="send" size="sm" />
        </button>
      </BaseTooltip>
    </div>

    <!-- 힌트 텍스트 -->
    <p class="mt-1 text-xs text-muted-foreground px-2">
      <kbd class="px-1.5 py-0.5 rounded bg-secondary dark:bg-discord-bg text-xs">Enter</kbd> 전송,
      <kbd class="px-1.5 py-0.5 rounded bg-secondary dark:bg-discord-bg text-xs">Shift + Enter</kbd> 줄바꿈
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '메시지를 입력하세요...',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  upload: []
}>()

const localValue = ref(props.modelValue)
const inputRef = ref<HTMLTextAreaElement | null>(null)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

watch(localValue, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleSend = () => {
  if (!localValue.value.trim() || props.disabled) return

  emit('send')
  localValue.value = ''

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto'
    }
  })
}

const handleNewLine = (e: KeyboardEvent) => {
  // Shift + Enter는 기본 동작(줄바꿈)을 허용
  autoResize()
}

const autoResize = () => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto'
      inputRef.value.style.height = `${Math.min(inputRef.value.scrollHeight, 128)}px`
    }
  })
}
</script>

