<template>
  <div :class="['flex', isOwn ? 'justify-end' : 'justify-start']">
    <div :class="['max-w-lg', isOwn ? 'items-end' : 'items-start']">
      <!-- 발신자 정보 -->
      <div v-if="!isOwn" class="flex items-center space-x-2 mb-1 px-1">
        <span class="text-sm font-medium text-gray-700">{{ message.senderName }}</span>
      </div>

      <!-- 메시지 버블 -->
      <div
        :class="[
          'px-4 py-3 rounded-2xl shadow-sm',
          isOwn
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
        ]"
      >
        <!-- 텍스트 메시지 -->
        <p v-if="message.messageType === 'TEXT'" class="whitespace-pre-wrap break-words">
          {{ message.content }}
        </p>

        <!-- 이미지 메시지 -->
        <div v-else-if="message.messageType === 'IMAGE'" class="space-y-2">
          <img
            v-if="message.imageUrl"
            :src="message.imageUrl"
            :alt="message.content"
            class="max-w-sm rounded-lg"
          />
          <p v-if="message.content" class="whitespace-pre-wrap break-words">
            {{ message.content }}
          </p>
        </div>

        <!-- 시스템 메시지 -->
        <p v-else-if="message.messageType === 'SYSTEM'" class="text-sm italic">
          {{ message.content }}
        </p>
      </div>

      <!-- 메시지 시간 -->
      <div :class="['px-1 mt-1 text-xs text-gray-500', isOwn ? 'text-right' : 'text-left']">
        {{ formatTime(message.sentAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/message';

const props = defineProps<{
  message: Message
  isOwn: boolean
}>()

// 시간 포맷팅
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 1분 이내
  if (diff < 60000) {
    return '방금 전'
  }
  
  // 1시간 이내
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}분 전`
  }
  
  // 오늘
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }
  
  // 이번 주
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}일 전`
  }
  
  // 그 외
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}
</script>
