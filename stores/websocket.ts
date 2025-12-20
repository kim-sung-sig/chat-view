import { defineStore } from 'pinia'
import type { Message } from '~/types/message'

interface WebSocketState {
  socket: WebSocket | null
  connected: boolean
  reconnectAttempts: number
  maxReconnectAttempts: number
}

export const useWebSocketStore = defineStore('websocket', {
  state: (): WebSocketState => ({
    socket: null,
    connected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  }),

  getters: {
    isConnected: (state) => state.connected,
    getSocket: (state) => state.socket
  },

  actions: {
    // WebSocket 연결
    connect(userId: string) {
      if (this.socket && this.connected) {
        console.log('WebSocket already connected')
        return
      }

      const config = useRuntimeConfig()
      const wsUrl = `${config.public.websocketUrl}?userId=${userId}`
      
      try {
        this.socket = new WebSocket(wsUrl)
        
        this.socket.onopen = () => {
          console.log('WebSocket connected')
          this.connected = true
          this.reconnectAttempts = 0
        }
        
        this.socket.onmessage = (event: MessageEvent) => {
          try {
            const message: Message = JSON.parse(event.data)
            console.log('WebSocket message received:', message)
            
            // 커스텀 이벤트 발생으로 변경 (store 순환 참조 방지)
            if (import.meta.client) {
              window.dispatchEvent(new CustomEvent('ws-message', { detail: message }))
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
              this.connect(userId)
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
      }
    },

    // 메시지 전송 (WebSocket을 통한 전송은 현재 사용하지 않음, REST API 사용)
    send(message: any) {
      if (this.socket && this.connected) {
        this.socket.send(JSON.stringify(message))
      } else {
        console.error('WebSocket is not connected')
      }
    }
  }
})
