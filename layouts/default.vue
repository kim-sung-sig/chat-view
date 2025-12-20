<template>
  <div class="h-screen flex bg-background dark:bg-discord-bg overflow-hidden">
    <!-- 워크스페이스 사이드바 -->
    <WorkspaceSidebar v-if="showSidebar" />

    <!-- 메인 컨텐츠 영역 -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 헤더 -->
      <AppHeader />

      <!-- 메인 컨텐츠 -->
      <main class="flex-1 overflow-hidden">
        <slot />
      </main>
    </div>

    <!-- 오른쪽 패널 (옵션) -->
    <RightPanel v-if="showRightPanel" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUIStore } from '~/stores/ui'

interface Props {
  showSidebar?: boolean
  showRightPanel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSidebar: true,
  showRightPanel: false,
})

const UIStore = useUIStore()

</script>

