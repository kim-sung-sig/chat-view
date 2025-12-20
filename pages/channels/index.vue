<template>
  <NuxtLayout name="default">
    <div class="h-full flex items-center justify-center bg-background dark:bg-discord-bg">
      <div class="text-center max-w-2xl px-6">
        <!-- 아이콘 -->
        <div class="mb-8">
          <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <BaseIcon name="chat" size="xl" class="text-white w-16 h-16" />
          </div>

          <h1 class="text-4xl font-bold text-foreground mb-4">
            환영합니다! 👋
          </h1>

          <p class="text-lg text-muted-foreground mb-8">
            왼쪽 사이드바에서 채널을 선택하거나<br />
            새로운 채널을 만들어 대화를 시작해보세요
          </p>
        </div>

        <!-- 액션 버튼 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <BaseButton
            variant="primary"
            size="lg"
            @click="handleCreateChannel"
            class="min-w-[200px]"
          >
            <BaseIcon name="plus" size="sm" />
            새 채널 만들기
          </BaseButton>

          <BaseButton
            variant="secondary"
            size="lg"
            @click="handleBrowseChannels"
            class="min-w-[200px]"
          >
            <BaseIcon name="search" size="sm" />
            채널 둘러보기
          </BaseButton>
        </div>

        <!-- 최근 채널 -->
        <div v-if="recentChannels.length > 0" class="mt-16">
          <h2 class="text-xl font-semibold text-foreground mb-6">
            최근 채널
          </h2>

          <div class="grid gap-3 max-w-md mx-auto">
            <button
              v-for="channel in recentChannels"
              :key="channel.channelId"
              @click="goToChannel(channel.channelId)"
              class="group p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent hover:border-primary transition-all duration-200 text-left shadow-sm hover:shadow-md"
            >
              <div class="flex items-center gap-4">
                <!-- 채널 아이콘 -->
                <div class="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span class="text-xl font-bold text-indigo-600 dark:text-indigo-400">#</span>
                </div>

                <!-- 채널 정보 -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {{ channel.name }}
                  </h3>
                  <p v-if="channel.description" class="text-sm text-muted-foreground truncate">
                    {{ channel.description }}
                  </p>
                </div>

                <!-- 화살표 아이콘 -->
                <BaseIcon
                  name="arrow-right"
                  size="sm"
                  class="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </div>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="mt-16 p-8 rounded-lg border bg-card/50">
          <BaseIcon name="chat" size="lg" class="mx-auto mb-4 text-muted-foreground" />
          <p class="text-muted-foreground">
            아직 참여한 채널이 없습니다<br />
            새 채널을 만들거나 기존 채널에 참여해보세요
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChannelStore } from '~/stores/channel'
import { useUIStore } from '~/stores/ui'

definePageMeta({
  middleware: 'auth'
})

const channelStore = useChannelStore()
const UIStore = useUIStore()

const { channels } = storeToRefs(channelStore)

const recentChannels = computed(() => {
  return channels.value.slice(0, 5)
})

const handleCreateChannel = () => {
  UIStore.openModal('createChannel')
}

const handleBrowseChannels = () => {
  console.log('Browse channels')
}

const goToChannel = (channelId: string) => {
  navigateTo(`/channels/${channelId}`)
}

onMounted(async () => {
  const authStore = useAuthStore()
  if (authStore.currentUser) {
    await channelStore.fetchChannels(authStore.currentUser.userId)
  }
})
</script>

