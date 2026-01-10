export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';
export type ChannelType = 'text' | 'voice' | 'dm';

export interface User {
    id: string;
    username: string;
    discriminator: string; // The #1234
    avatarUrl?: string;
    status: UserStatus;
}

export interface Message {
    id: string;
    content: string;
    authorId: string;
    channelId: string;
    timestamp: Date;
    edited?: boolean;
}

export interface Channel {
    id: string;
    name: string;
    type: ChannelType;
    categoryId?: string;
    unreadCount?: number;
    serverId?: string;
}

export interface Server {
    id: string;
    name: string;
    iconUrl?: string;
    ownerId: string;
    unreadCount?: number;
}


export type RelationshipType = 'friend' | 'pending_incoming' | 'pending_outgoing' | 'blocked';

export interface Relationship {
    userId: string;
    type: RelationshipType;
}

