export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';
export type ChannelType = 'text' | 'voice';

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
}

export interface Server {
    id: string;
    name: string;
    iconUrl?: string;
    ownerId: string;
}
