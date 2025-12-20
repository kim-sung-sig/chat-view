// 채널 타입 정의

export enum ChannelType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface Channel {
  channelId: string
  channelType: ChannelType
  name?: string
  description?: string
  createdAt: string
  updatedAt: string
  memberCount?: number
  unreadCount?: number
  mentionCount?: number
  lastMessage?: {
    content: string
    sentAt: string
    senderName: string
  }
}

export interface ChannelDetail extends Channel {
  members: ChannelMember[]
}

export interface ChannelMember {
  userId: string
  username: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: string
}

// 채널 생성 요청
export interface CreateDirectChannelRequest {
  currentUserId: string
  targetUserId: string
}

export interface CreateGroupChannelRequest {
  creatorUserId: string
  name: string
  description?: string
  memberUserIds: string[]
}

export interface CreatePublicChannelRequest {
  creatorUserId: string
  name: string
  description?: string
}

export interface CreatePrivateChannelRequest {
  creatorUserId: string
  name: string
  description?: string
  memberUserIds: string[]
}
