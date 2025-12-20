import { defineStore } from 'pinia'
import type { CursorPageResponse } from '~/types/api'
import type { Message, SendMessageRequest } from '~/types/message'

interface MessageState {
  messages: Record<string, Message[]> // channelId -> messages
  loading: boolean
  error: string | null
  cursors: Record<string, string | null> // channelId -> cursor
  hasMore: Record<string, boolean> // channelId -> hasMore
}

export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    messages: {},
    loading: false,
    error: null,
    cursors: {},
    hasMore: {}
  }),

  getters: {
    getMessagesByChannel: (state) => (channelId: string) => {
      return state.messages[channelId] || []
    },
    hasMoreMessages: (state) => (channelId: string) => {
      return state.hasMore[channelId] ?? true
    },
    isLoading: (state) => state.loading,

    // 현재 채널의 메시지 (채널 페이지에서 사용)
    messages(): Message[] {
      const channelStore = useChannelStore()
      const currentChannelId = channelStore.currentChannel?.channelId
      return currentChannelId ? (this.messages[currentChannelId] || []) : []
    },

    loading: (state) => state.loading,
  },

  actions: {
    // 메시지 목록 조회
    async fetchMessages(channelId: string, cursor?: string) {
      this.loading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const params: any = { channelId, limit: 50 }
        if (cursor) params.cursor = cursor
        
        const response = await $fetch<any>(`${config.public.systemApiUrl}/api/v1/messages`, {
          params
        })
        
        const pageData: CursorPageResponse<Message> = response.data
        
        if (!this.messages[channelId]) {
          this.messages[channelId] = []
        }
        
        // 커서가 있으면 추가, 없으면 새로 설정
        if (cursor) {
          this.messages[channelId].push(...pageData.content)
        } else {
          this.messages[channelId] = pageData.content
        }
        
        this.cursors[channelId] = pageData.nextCursor
        this.hasMore[channelId] = pageData.hasNext
      } catch (error: any) {
        this.error = error.message || '메시지를 불러오는데 실패했습니다'
        console.error('Failed to fetch messages:', error)
      } finally {
        this.loading = false
      }
    },

    // 메시지 전송
    async sendMessage(request: SendMessageRequest) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<any>(`${config.public.messageApiUrl}/api/messages`, {
          method: 'POST',
          body: request
        })
        
        // 응답에서 메시지를 받아 로컬 상태에 추가
        const message: Message = response
        this.addMessage(request.channelId, message)
        
        return message
      } catch (error: any) {
        this.error = error.message || '메시지 전송에 실패했습니다'
        console.error('Failed to send message:', error)
        throw error
      }
    },

    // 메시지 추가 (WebSocket으로 수신한 메시지)
    addMessage(channelId: string, message: Message) {
      if (!this.messages[channelId]) {
        this.messages[channelId] = []
      }
      
      // 중복 체크
      const exists = this.messages[channelId].some((m: Message) => m.messageId === message.messageId)
      if (!exists) {
        this.messages[channelId].push(message) // 최신 메시지를 마지막에 추가
      }
    },

    // WebSocket 메시지 리스너 등록
    setupMessageListener() {
      if (import.meta.client) {
        window.addEventListener('ws-message', ((event: CustomEvent) => {
          const message = event.detail as Message
          this.addMessage(message.channelId, message)
        }) as EventListener)
      }
    },

    // WebSocket 메시지 리스너 제거
    removeMessageListener() {
      if (import.meta.client) {
        window.removeEventListener('ws-message', this.setupMessageListener as EventListener)
      }
    },

    // 채널 메시지 초기화
    clearMessages(channelId: string) {
      delete this.messages[channelId]
      delete this.cursors[channelId]
      delete this.hasMore[channelId]
    },

    // 에러 초기화
    clearError() {
      this.error = null
    }
  }
})
