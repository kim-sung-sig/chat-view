import { defineStore } from 'pinia'
import type { Message } from '~/types/message'

interface WebSocketState {
  socket: WebSocket | null
  connected: boolean
  reconnectAttempts: number
  maxReconnectAttempts: number
  subscribedChannels: Set<string>
}

export const useWebSocketStore = defineStore('websocket', {
  state: (): WebSocketState => ({
    socket: null,
    connected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    subscribedChannels: new Set()
  }),

  getters: {
    isConnected: (state) => state.connected,
    getSocket: (state) => state.socket
  },

  actions: {
    // WebSocket 연결
    async connect() {
      if (this.socket && this.connected) {
        console.log('WebSocket already connected')
        return
      }

      const authStore = useAuthStore()
      if (!authStore.currentUser) {
        console.error('User not authenticated')
        return
      }

      const config = useRuntimeConfig()
      const accessToken = authStore.accessToken
      const wsUrl = `${config.public.websocketUrl}?token=${accessToken}`

      try {
        this.socket = new WebSocket(wsUrl)
        
        this.socket.onopen = () => {
          console.log('WebSocket connected')
          this.connected = true
          this.reconnectAttempts = 0

          // 이전에 구독했던 채널 재구독
          this.subscribedChannels.forEach(channelId => {
            this.subscribeToChannel(channelId)
          })
        }
        
        this.socket.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data)
            console.log('WebSocket message received:', data)

            // 메시지 타입에 따라 처리
            if (data.type === 'MESSAGE') {
              const message: Message = data.payload
              // 커스텀 이벤트 발생
              if (import.meta.client) {
                window.dispatchEvent(new CustomEvent('ws-message', { detail: message }))
              }
            } else if (data.type === 'TYPING') {
              // 타이핑 이벤트
              if (import.meta.client) {
                window.dispatchEvent(new CustomEvent('ws-typing', { detail: data.payload }))
              }
            } else if (data.type === 'PRESENCE') {
              // 사용자 상태 변경
              if (import.meta.client) {
                window.dispatchEvent(new CustomEvent('ws-presence', { detail: data.payload }))
              }
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }
        
        this.socket.onerror = (error: Event) => {
          console.error('WebSocket error:', error)
        }
        
        this.socket.onclose = () => {
          console.log('WebSocket disconnected')
          this.connected = false
          this.socket = null
          
          // 재연결 시도
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
            setTimeout(() => {
              this.connect()
            }, 3000 * this.reconnectAttempts)
          }
        }
      } catch (error) {
        console.error('Failed to connect WebSocket:', error)
      }
    },

    // WebSocket 연결 해제
    disconnect() {
      if (this.socket) {
        this.socket.close()
        this.socket = null
        this.connected = false
        this.reconnectAttempts = 0
        this.subscribedChannels.clear()
      }
    },

    // 채널 구독
    subscribeToChannel(channelId: string) {
      if (!this.socket || !this.connected) {
        console.warn('WebSocket not connected, queuing subscription')
        this.subscribedChannels.add(channelId)
        return
      }

      this.send({
        type: 'SUBSCRIBE',
        payload: { channelId }
      })

      this.subscribedChannels.add(channelId)
      console.log(`Subscribed to channel: ${channelId}`)
    },

    // 채널 구독 해제
    unsubscribeFromChannel(channelId: string) {
      if (this.socket && this.connected) {
        this.send({
          type: 'UNSUBSCRIBE',
          payload: { channelId }
        })
      }

      this.subscribedChannels.delete(channelId)
      console.log(`Unsubscribed from channel: ${channelId}`)
    },

    // 타이핑 이벤트 전송
    sendTyping(channelId: string, isTyping: boolean) {
      if (!this.socket || !this.connected) return

      this.send({
        type: 'TYPING',
        payload: { channelId, isTyping }
      })
    },

    // 메시지 전송
    send(data: any) {
      if (this.socket && this.connected) {
        this.socket.send(JSON.stringify(data))
      } else {
        console.error('WebSocket is not connected')
      }
    }
  }
})
