// 메시지 타입 정의

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM'
}

export interface Message {
  messageId: string
  channelId: string
  senderId: string
  senderName: string
  messageType: MessageType
  content: string
  imageUrl?: string
  sentAt: string
  editedAt?: string
  isDeleted: boolean
}

// 메시지 전송 요청
export interface SendMessageRequest {
  channelId: string
  senderId: string
  senderName: string
  messageType: MessageType
  content: string
  imageUrl?: string
}

// WebSocket 메시지
export interface WebSocketMessage {
  type: 'MESSAGE' | 'TYPING' | 'READ' | 'SYSTEM'
  data: Message | any
}
