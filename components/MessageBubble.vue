<template>
  <div :class="['flex gap-3 group', isOwn ? 'flex-row-reverse' : '']">
    <!-- 아바타 -->
    <div class="flex-shrink-0">
      <UserAvatar
        :name="message.senderName"
        size="md"
        status="online"
      />
    </div>

    <!-- 메시지 내용 -->
    <div :class="['flex-1 min-w-0', isOwn ? 'flex flex-col items-end' : '']">
      <!-- 헤더 -->
      <div class="flex items-center gap-2 mb-1">
        <span class="font-semibold text-sm text-foreground">
          {{ message.senderName }}
        </span>
        <span class="text-xs text-muted-foreground">
          {{ formatTime(message.timestamp) }}
        </span>
      </div>

      <!-- 메시지 -->
      <div
        :class="[
          'rounded-lg px-4 py-2 break-words max-w-2xl',
          isOwn
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary dark:bg-discord-hover text-foreground'
        ]"
      >
        <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
      </div>

      <!-- 반응 -->
      <div v-if="message.reactions && message.reactions.length > 0" class="flex gap-1 mt-2">
        <button
          v-for="(reaction, idx) in message.reactions"
          :key="idx"
          class="px-2 py-1 rounded bg-secondary dark:bg-discord-bg text-xs hover:bg-accent transition-colors"
        >
          {{ reaction.emoji }} {{ reaction.count }}
        </button>
      </div>
    </div>

    <!-- 액션 버튼 (hover 시) -->
    <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
      <BaseTooltip text="반응 추가">
        <button class="p-1.5 rounded hover:bg-accent">
          <BaseIcon name="emoji" size="sm" class="text-muted-foreground" />
        </button>
      </BaseTooltip>
      <BaseTooltip text="더보기">
        <button class="p-1.5 rounded hover:bg-accent">
          <BaseIcon name="more" size="sm" class="text-muted-foreground" />
        </button>
      </BaseTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  messageId: string
  channelId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  edited?: boolean
  reactions?: Array<{ emoji: string; count: number }>
}

interface Props {
  message: Message
  isOwn?: boolean
}

defineProps<Props>()

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return '방금 전'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`
  if (diff < 86400000) return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

