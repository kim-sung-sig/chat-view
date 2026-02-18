/**
 * WebSocket 서비스
 * /ws/chat?roomId={channelId}
 */

export interface WebSocketMessage {
  messageId: string;
  channelId: string;
  userId: string;
  messageType: string;
  textContent?: string;
  imageUrls?: string[];
  sentAt: string;
}

export class ChatWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private messageHandlers: Array<(message: WebSocketMessage) => void> = [];
  private isConnecting = false;

  constructor(
    private wsUrl: string = 'ws://localhost:8082'
  ) {}

  /**
   * WebSocket 연결
   */
  connect(channelId: string) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    const token = localStorage.getItem('access_token');
    const url = `${this.wsUrl}/ws/chat?roomId=${channelId}&token=${token}`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket connected to channel:', channelId);
        this.isConnecting = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.notifyHandlers(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.isConnecting = false;
        this.ws = null;

        // 자동 재연결 (5초 후)
        if (event.code !== 1000) {
          this.reconnectTimer = setTimeout(() => {
            console.log('Attempting to reconnect...');
            this.connect(channelId);
          }, 5000);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.isConnecting = false;
    }
  }

  /**
   * WebSocket 연결 종료
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.isConnecting = false;
  }

  /**
   * 메시지 핸들러 등록
   */
  onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
  }

  /**
   * 메시지 핸들러 제거
   */
  offMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  /**
   * 핸들러들에게 메시지 전달
   */
  private notifyHandlers(message: WebSocketMessage) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Message handler error:', error);
      }
    });
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
