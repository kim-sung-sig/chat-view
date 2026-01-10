import { defineStore } from 'pinia';
import type { Channel, Message, Relationship, Server, User } from '~/types';

export const useDataStore = defineStore('data', {
    state: () => ({
        servers: [] as Server[],
        channels: [] as Channel[], // Server channels
        dms: [] as Channel[], // DM channels
        relationships: [] as Relationship[],
        activeServerId: 'home' as string | null, // Default to home
        activeChannelId: 'friends' as string | null, // 'friends' or a DM channel ID
        users: {} as Record<string, User>,
        messages: {} as Record<string, Message[]>,
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

        getServerChannels: (state) => (serverId: string) => {
            if (serverId === 'home') return state.dms;
            // Filter channels by serverId. 
            // Note: If serverId is missing in early mock data, we might need a fallback, 
            // but we will update mock data to include it.
            return state.channels.filter(c => c.serverId === serverId);
        },

        getCurrentChannelMessages: (state) => {
            if (!state.activeChannelId || state.activeChannelId === 'friends') return [];
            return state.messages[state.activeChannelId] || [];
        },

        getFriends: (state) => {
            return state.relationships
                .filter(r => r.type === 'friend')
                .map(r => state.users[r.userId])
                .filter(Boolean);
        },

        getPendingRequests: (state) => {
            return state.relationships
                .filter(r => r.type === 'pending_incoming' || r.type === 'pending_outgoing')
                .map(r => ({ ...state.users[r.userId], type: r.type }));
        }
    },

    actions: {
        initializeMockData() {
            // Servers
            this.servers = [
                { id: '1', name: 'My Community', ownerId: 'me', iconUrl: 'https://placehold.co/150/5865F2/FFF?text=MC', unreadCount: 0 },
                { id: '2', name: 'Gaming Lounge', ownerId: 'other', iconUrl: 'https://placehold.co/150/23a559/FFF?text=GL', unreadCount: 3 }
            ];

            // Channels
            const server1Channels: Channel[] = [
                { id: 'general', name: 'general', type: 'text', serverId: '1' },
                { id: 'random', name: 'random', type: 'text', serverId: '1' },
                { id: 'voice-lounge', name: 'Lounge', type: 'voice', serverId: '1' }
            ];

            const server2Channels: Channel[] = [
                { id: 'gl-general', name: 'general', type: 'text', serverId: '2' },
                { id: 'gl-clips', name: 'clips', type: 'text', serverId: '2' },
                { id: 'gl-voice', name: 'Voice 1', type: 'voice', serverId: '2' }
            ];

            this.channels = [...server1Channels, ...server2Channels];

            // Mock Users
            this.users['me'] = this.currentUser;
            this.users['bot'] = { id: 'bot', username: 'WelcomeBot', discriminator: '0000', status: 'online', avatarUrl: 'https://placehold.co/100/grey/white?text=Bot' };
            this.users['f1'] = { id: 'f1', username: 'CoolFriend', discriminator: '1234', status: 'idle', avatarUrl: 'https://placehold.co/100/green/white?text=CF' };
            this.users['f2'] = { id: 'f2', username: 'GamerPro', discriminator: '9999', status: 'dnd', avatarUrl: 'https://placehold.co/100/red/white?text=GP' };
            this.users['p1'] = { id: 'p1', username: 'PendingUser', discriminator: '5555', status: 'offline', avatarUrl: 'https://placehold.co/100/blue/white?text=PU' };

            // Relationships
            this.relationships = [
                { userId: 'f1', type: 'friend' },
                { userId: 'f2', type: 'friend' },
                { userId: 'p1', type: 'pending_incoming' }
            ];

            // DMs
            this.dms = [
                { id: 'dm-f1', name: 'CoolFriend', type: 'dm', unreadCount: 1 }
            ];

            // Messages
            this.messages['general'] = [
                { id: 'm1', content: 'Hello World!', authorId: 'me', channelId: 'general', timestamp: new Date(Date.now() - 100000) },
                { id: 'm2', content: 'Welcome to the server!', authorId: 'bot', channelId: 'general', timestamp: new Date(Date.now() - 50000) }
            ];

            this.messages['dm-f1'] = [
                { id: 'dm1', content: 'Hey, want to play later?', authorId: 'f1', channelId: 'dm-f1', timestamp: new Date(Date.now() - 300000) }
            ];

            // Set active channel to something valid if needed, or default logic applies
        },

        sendMessage(content: string) {
            if (!this.activeChannelId || !this.currentUser || this.activeChannelId === 'friends') return;

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
            if (serverId === 'home') {
                this.activeChannelId = 'friends';
            } else {
                // Find first channel of this server
                const firstChannel = this.channels.find(c => c.serverId === serverId);
                this.activeChannelId = firstChannel ? firstChannel.id : null;
            }
        },

        setActiveChannel(channelId: string) {
            this.activeChannelId = channelId;
            // Clear unread count mock
            const dm = this.dms.find(d => d.id === channelId);
            if (dm) dm.unreadCount = 0;
            const server = this.servers.find(s => s.id === this.activeServerId);
            if (server && this.activeServerId !== 'home') server.unreadCount = 0;
        },

        reorderServers(newOrderIds: string[]) {
            const reordered = [] as Server[];
            newOrderIds.forEach(id => {
                const s = this.servers.find(srv => srv.id === id);
                if (s) reordered.push(s);
            });
            // Append any missing ones properly (safety)
            this.servers.forEach(s => {
                if (!newOrderIds.includes(s.id)) reordered.push(s);
            });
            this.servers = reordered;
        },


        addServer(name: string) {
            const newServer: Server = {
                id: Date.now().toString(),
                name: name,
                ownerId: this.currentUser.id,
                iconUrl: `https://placehold.co/150/7289da/FFF?text=${name.substring(0, 2).toUpperCase()}`
            };
            this.servers.push(newServer);

            // Add default channel
            const defaultChannel: Channel = {
                id: `gen-${newServer.id}`,
                name: 'general',
                type: 'text',
                serverId: newServer.id
            };
            this.channels.push(defaultChannel);

            this.activeServerId = newServer.id;
            this.activeChannelId = defaultChannel.id;
        },

        addChannel(serverId: string, name: string, type: 'text' | 'voice') {
            const newChannel: Channel = {
                id: `${type}-${Date.now()}`,
                name: name,
                type: type,
                serverId: serverId
            };
            this.channels.push(newChannel);
            // Optionally switch to it
            this.activeChannelId = newChannel.id;
        },

        deleteChannel(channelId: string) {
            const index = this.channels.findIndex(c => c.id === channelId);
            if (index !== -1) {
                const channel = this.channels[index];
                this.channels.splice(index, 1);

                // If we deleted the active channel, switch to another one in the same server
                if (this.activeChannelId === channelId) {
                    const nextChannel = this.channels.find(c => c.serverId === channel.serverId);
                    this.activeChannelId = nextChannel ? nextChannel.id : null;
                }
            }
        },


        sendFriendRequest(username: string) {
            // Mock logic: find if user exists in our "db" (this.users)
            // In real app this would be an API call
            const targetUser = Object.values(this.users).find(u => u.username === username);
            if (targetUser && targetUser.id !== this.currentUser.id) {
                // Check if already related
                const existing = this.relationships.find(r => r.userId === targetUser.id);
                if (!existing) {
                    this.relationships.push({ userId: targetUser.id, type: 'pending_outgoing' });
                }
            }
        },

        acceptFriendRequest(userId: string) {
            const rel = this.relationships.find(r => r.userId === userId);
            if (rel && rel.type === 'pending_incoming') {
                rel.type = 'friend';
            }
        },

        openDM(userId: string) {
            const user = this.users[userId];
            if (!user) return;

            // Check if DM exists
            let dm = this.dms.find(d => d.name === user.username); // Simplified matching

            if (!dm) {
                dm = {
                    id: `dm-${userId}`,
                    name: user.username,
                    type: 'dm'
                };
                this.dms.push(dm);
            }

            this.activeServerId = 'home';
            this.activeChannelId = dm.id;
        }
    }
});

