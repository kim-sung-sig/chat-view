export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';
export type ChannelType = 'text' | 'voice' | 'dm' | 'DIRECT' | 'GROUP' | 'PUBLIC' | 'PRIVATE';
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO' | 'AUDIO' | 'SYSTEM' | 'MIXED';
export type RelationshipType = 'friend' | 'pending_incoming' | 'pending_outgoing' | 'blocked';

export interface User {
    id: string;
    username: string;
    discriminator: string;
    avatarUrl?: string;
    status: UserStatus;
    customStatus?: string;
}

export interface Reaction {
    emoji: string;
    count: number;
    userIds: string[];
    me: boolean;
}

export interface MessageAttachment {
    url: string;
    name: string;
    size?: number;
    mimeType?: string;
    width?: number;
    height?: number;
}

export interface Message {
    id: string;
    content: string;
    authorId: string;
    channelId: string;
    timestamp: Date;
    editedAt?: Date;
    edited?: boolean;
    messageType?: MessageType;
    imageUrls?: string[];
    attachments?: MessageAttachment[];
    reactions?: Record<string, Reaction>;
    replyToId?: string;
    isPending?: boolean;
}

export interface Category {
    id: string;
    name: string;
    serverId: string;
    collapsed: boolean;
    position: number;
}

export interface Channel {
    id: string;
    name: string;
    type: ChannelType;
    categoryId?: string;
    unreadCount?: number;
    mentionCount?: number;
    serverId?: string;
    description?: string;
    memberCount?: number;
    lastActivityAt?: Date;
    notificationEnabled?: boolean;
    favorite?: boolean;
    pinned?: boolean;
}

export interface Server {
    id: string;
    name: string;
    iconUrl?: string;
    ownerId: string;
    unreadCount?: number;
    mentionCount?: number;
}

export interface Relationship {
    id?: string;
    userId: string;
    type: RelationshipType;
    nickname?: string;
    favorite?: boolean;
}

// API Response 타입
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: {
        code: string;
        message: string;
    };
}

// 페이지네이션
export interface PagedResponse<T> {
    data: T[];
    nextCursor?: string;
    hasMore: boolean;
}

// 알림 설정
export interface NotificationSettings {
    enabled: boolean;
    mentions: boolean;
    allMessages: boolean;
    sounds: boolean;
}

// 테마
export type Theme = 'dark' | 'light' | 'oled';
export type MessageDensity = 'comfortable' | 'compact';
