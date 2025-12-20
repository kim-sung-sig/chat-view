<template>
  <div class="min-h-screen bg-gray-50 dark:bg-workspace-bg">
    <!-- 헤더 -->
    <AppHeader />

    <!-- 메인 레이아웃 -->
    <div class="flex h-[calc(100vh-var(--header-height))]">
      <!-- 워크스페이스 사이드바 -->
      <WorkspaceSidebar v-if="showSidebar" />

      <!-- 메인 컨텐츠 -->
      <main class="flex-1 overflow-hidden">
        <slot />
      </main>

      <!-- 오른쪽 패널 (옵션) -->
      <RightPanel v-if="showRightPanel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUIStore } from '~/stores/ui'

// ============================================
// Props 정의
// ============================================
interface Props {
  /** 사이드바 표시 여부 */
  showSidebar?: boolean
  /** 오른쪽 패널 표시 여부 */
  showRightPanel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSidebar: true,
  showRightPanel: false,
})

// ============================================
// Store
// ============================================
const UIStore = useUIStore()

</script>

