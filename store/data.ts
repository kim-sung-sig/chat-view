import { defineStore } from 'pinia';
import type { Channel, Message, Server, User } from '~/types';

export const useDataStore = defineStore('data', {
    state: () => ({
        servers: [] as Server[],
        channels: [] as Channel[], // Flattened for simplicity in this demo, or filtered by server
        activeServerId: '1' as string | null, // Default to first
        activeChannelId: 'general' as string | null,
        users: {} as Record<string, User>,
        messages: {} as Record<string, Message[]>, // channelId -> messages
        currentUser: {
            id: 'me',
            username: 'User',
            discriminator: '0000',
            status: 'online',
            avatarUrl: 'https://placehold.co/100x100'
        } as User
    }),

    getters: {
        getActiveServer: (state) => state.servers.find(s => s.id === state.activeServerId),
        getServerChannels: (state) => (serverId: string) => state.channels.filter(c => true), // Mock: return all for now or filter if we add serverId to channel
        getCurrentChannelMessages: (state) => {
            if (!state.activeChannelId) return [];
            return state.messages[state.activeChannelId] || [];
        }
    },

    actions: {
        initializeMockData() {
            // Servers
            this.servers = [
                { id: '1', name: 'My Community', ownerId: 'me', iconUrl: 'https://placehold.co/150/5865F2/FFF?text=MC' },
                { id: '2', name: 'Gaming Lounge', ownerId: 'other', iconUrl: 'https://placehold.co/150/23a559/FFF?text=GL' }
            ];

            // Channels
            this.channels = [
                { id: 'general', name: 'general', type: 'text' },
                { id: 'random', name: 'random', type: 'text' },
                { id: 'voice-lounge', name: 'Lounge', type: 'voice' }
            ];

            // Messages
            this.messages['general'] = [
                { id: 'm1', content: 'Hello World!', authorId: 'me', channelId: 'general', timestamp: new Date(Date.now() - 100000) },
                { id: 'm2', content: 'Welcome to the server!', authorId: 'bot', channelId: 'general', timestamp: new Date(Date.now() - 50000) }
            ];

            this.users['me'] = this.currentUser;
            this.users['bot'] = { id: 'bot', username: 'WelcomeBot', discriminator: '0000', status: 'online', avatarUrl: 'https://placehold.co/100/grey/white?text=Bot' };
        },

        sendMessage(content: string) {
            if (!this.activeChannelId || !this.currentUser) return;

            // Validation
            if (!content.trim()) return;

            const newMessage: Message = {
                id: Date.now().toString(),
                content: content.trim(),
                authorId: this.currentUser.id,
                channelId: this.activeChannelId,
                timestamp: new Date()
            };

            if (!this.messages[this.activeChannelId]) {
                this.messages[this.activeChannelId] = [];
            }
            this.messages[this.activeChannelId].push(newMessage);
        },

        setActiveServer(serverId: string) {
            this.activeServerId = serverId;
        },

        setActiveChannel(channelId: string) {
            this.activeChannelId = channelId;
        }
    }
});
