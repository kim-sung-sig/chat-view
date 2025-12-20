<template>
  <div class="w-full">
    <!-- 레이블 -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>

    <!-- 입력 필드 컨테이너 -->
    <div class="relative">
      <!-- 왼쪽 아이콘 -->
      <div
        v-if="iconLeft"
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      >
        <component :is="iconLeft" class="w-5 h-5" />
      </div>

      <!-- 입력 필드 -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- 오른쪽 아이콘 또는 클리어 버튼 -->
      <div
        v-if="iconRight || (clearable && modelValue)"
        class="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <!-- 클리어 버튼 -->
        <button
          v-if="clearable && modelValue"
          @click="handleClear"
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="입력 내용 지우기"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>

        <!-- 오른쪽 아이콘 -->
        <component
          v-else-if="iconRight"
          :is="iconRight"
          class="w-5 h-5 text-gray-400"
        />
      </div>
    </div>

    <!-- 에러 메시지 -->
    <p
      v-if="error"
      class="mt-1 text-sm text-danger-500"
    >
      {{ error }}
    </p>

    <!-- 도움말 텍스트 -->
    <p
      v-else-if="hint"
      class="mt-1 text-sm text-gray-500"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

// ============================================
// Props 정의
// ============================================
interface Props {
  /** v-model 바인딩 값 */
  modelValue: string | number
  /** 입력 타입 */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  /** 레이블 */
  label?: string
  /** 플레이스홀더 */
  placeholder?: string
  /** 에러 메시지 */
  error?: string
  /** 도움말 텍스트 */
  hint?: string
  /** 비활성화 */
  disabled?: boolean
  /** 읽기 전용 */
  readonly?: boolean
  /** 필수 입력 */
  required?: boolean
  /** 왼쪽 아이콘 */
  iconLeft?: any
  /** 오른쪽 아이콘 */
  iconRight?: any
  /** 클리어 버튼 표시 */
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
})

// ============================================
// Emits 정의
// ============================================
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// ============================================
// State
// ============================================
const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)

// ============================================
// Computed
// ============================================

/**
 * 입력 필드 클래스
 */
const inputClasses = computed(() => {
  const baseClasses = `
    w-full px-3 py-2 rounded-lg text-sm
    bg-white text-gray-900 placeholder-gray-400
    border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-100 disabled:cursor-not-allowed
    read-only:bg-gray-50 read-only:cursor-default
  `.trim().replace(/\s+/g, ' ')

  // 에러 상태
  const errorClasses = props.error
    ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
    : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'

  // 아이콘에 따른 패딩
  const paddingClasses = []
  if (props.iconLeft) paddingClasses.push('pl-10')
  if (props.iconRight || props.clearable) paddingClasses.push('pr-10')

  return `${baseClasses} ${errorClasses} ${paddingClasses.join(' ')}`
})

// ============================================
// Methods
// ============================================

/**
 * 입력 이벤트 핸들러
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

/**
 * 포커스 아웃 핸들러
 */
const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

/**
 * 포커스 핸들러
 */
const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

/**
 * 클리어 버튼 클릭 핸들러
 */
const handleClear = () => {
  emit('update:modelValue', '')
}
</script>
