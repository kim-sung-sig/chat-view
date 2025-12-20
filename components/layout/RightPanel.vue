<template>
  <aside
    class="w-[var(--right-panel-width)] bg-white dark:bg-workspace-sidebar border-l border-gray-200 dark:border-workspace-border flex flex-col"
  >
    <!-- 헤더 -->
    <div class="h-14 px-4 flex items-center justify-between border-b border-gray-200 dark:border-workspace-border">
      <h2 class="font-semibold text-gray-900 dark:text-workspace-text">
        {{ title }}
      </h2>
      <BaseButton
        variant="ghost"
        size="sm"
        @click="handleClose"
      >
        <BaseIcon name="close" size="sm" />
      </BaseButton>
    </div>

    <!-- 컨텐츠 -->
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
// ============================================
// Props 정의
// ============================================
interface Props {
  /** 패널 제목 */
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '상세 정보',
})

// ============================================
// Emits 정의
// ============================================
const emit = defineEmits<{
  close: []
}>()

// ============================================
// Methods
// ============================================

/**
 * 패널 닫기
 */
const handleClose = () => {
  emit('close')
}
</script>

