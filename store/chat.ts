import { defineStore } from 'pinia';
import { ChannelService } from '~/services/api/channel.service';
import { MessageService } from '~/services/api/message.service';
import { ChatWebSocketService } from '~/services/websocket/chat-websocket.service';
import type { Channel, Message, User } from '~/types';

export const useChatStore = defineStore('chat', {
    state: () => ({
        // 서비스 인스턴스
        channelService: null as ChannelService | null,
        messageService: null as MessageService | null,
        wsService: null as ChatWebSocketService | null,

        // 데이터
        channels: [] as Channel[],
        messages: {} as Record<string, Message[]>,
        activeChannelId: null as string | null,
        users: {} as Record<string, User>,
        currentUser: null as User | null,
        
        // 로딩 상태
        isLoadingChannels: false,
        isLoadingMessages: false,
        isSendingMessage: false,
    }),

    getters: {
        getCurrentChannelMessages: (state) => {
            if (!state.activeChannelId) return [];
            return state.messages[state.activeChannelId] || [];
        },

        getActiveChannel: (state) => {
            if (!state.activeChannelId) return null;
            return state.channels.find(c => c.id === state.activeChannelId);
        }
    },

    actions: {
        /**
         * 서비스 초기화
         */
        initializeServices() {
            if (process.client) {
                this.channelService = new ChannelService();
                this.messageService = new MessageService();
                
                const config = useRuntimeConfig();
                this.wsService = new ChatWebSocketService(config.public.wsBase);

                // WebSocket 메시지 핸들러 등록
                this.wsService.onMessage((message) => {
                    this.handleWebSocketMessage(message);
                });
            }
        },

        /**
         * WebSocket 메시지 처리
         */
        handleWebSocketMessage(wsMessage: any) {
            const message: Message = {
                id: wsMessage.messageId,
                content: wsMessage.textContent || '',
                authorId: wsMessage.userId,
                channelId: wsMessage.channelId,
                timestamp: new Date(wsMessage.sentAt),
                messageType: wsMessage.messageType,
                imageUrls: wsMessage.imageUrls
            };

            // 메시지 배열에 추가
            if (!this.messages[message.channelId]) {
                this.messages[message.channelId] = [];
            }
            this.messages[message.channelId].push(message);
        },

        /**
         * 내 채널 목록 로드
         */
        async loadMyChannels() {
            if (!this.channelService) this.initializeServices();
            
            this.isLoadingChannels = true;
            try {
                const channels = await this.channelService!.getMyChannels();
                
                // 백엔드 타입을 프론트 타입으로 변환
                this.channels = channels.map(ch => ({
                    id: ch.channelId,
                    name: ch.name,
                    type: ch.type === 'DIRECT' ? 'dm' : 'text',
                    description: ch.description,
                    memberCount: ch.memberCount
                }));
            } catch (error) {
                console.error('Failed to load channels:', error);
            } finally {
                this.isLoadingChannels = false;
            }
        },

        /**
         * 채널 메시지 로드
         */
        async loadMessages(channelId: string, cursor?: string) {
            if (!this.messageService) this.initializeServices();

            this.isLoadingMessages = true;
            try {
                const response = await this.messageService!.getMessages(channelId, cursor, 50);
                
                // 메시지 변환
                const messages: Message[] = response.data.map(msg => ({
                    id: msg.messageId,
                    content: msg.textContent || '',
                    authorId: msg.userId,
                    channelId: msg.channelId,
                    timestamp: new Date(msg.sentAt),
                    messageType: msg.messageType as any,
                    imageUrls: msg.imageUrls
                }));

                // 기존 메시지에 추가 (커서 기반이면 앞에 추가)
                if (cursor && this.messages[channelId]) {
                    this.messages[channelId] = [...messages, ...this.messages[channelId]];
                } else {
                    this.messages[channelId] = messages;
                }

                return response.nextCursor;
            } catch (error) {
                console.error('Failed to load messages:', error);
                return null;
            } finally {
                this.isLoadingMessages = false;
            }
        },

        /**
         * 메시지 전송
         */
        async sendMessage(content: string) {
            if (!this.messageService || !this.activeChannelId || !content.trim()) return;

            this.isSendingMessage = true;
            try {
                await this.messageService.sendMessage({
                    channelId: this.activeChannelId,
                    messageType: 'TEXT',
                    textContent: content.trim()
                });
                
                // WebSocket으로 메시지가 브로드캐스트되므로 여기서는 추가하지 않음
            } catch (error) {
                console.error('Failed to send message:', error);
                throw error;
            } finally {
                this.isSendingMessage = false;
            }
        },

        /**
         * 채널 변경
         */
        async setActiveChannel(channelId: string) {
            // 이전 채널 WebSocket 연결 해제
            if (this.wsService && this.activeChannelId) {
                this.wsService.disconnect();
            }

            this.activeChannelId = channelId;

            // 메시지 로드
            if (!this.messages[channelId]) {
                await this.loadMessages(channelId);
            }

            // WebSocket 연결
            if (this.wsService) {
                this.wsService.connect(channelId);
            }
        },

        /**
         * 일대일 채널 생성
         */
        async createDirectChannel(targetUserId: string) {
            if (!this.channelService) this.initializeServices();

            try {
                const channel = await this.channelService!.createDirectChannel({ targetUserId });
                
                // 채널 목록에 추가
                this.channels.push({
                    id: channel.channelId,
                    name: channel.name,
                    type: 'dm'
                });

                // 새 채널로 이동
                await this.setActiveChannel(channel.channelId);
            } catch (error) {
                console.error('Failed to create direct channel:', error);
                throw error;
            }
        },

        /**
         * 정리
         */
        cleanup() {
            if (this.wsService) {
                this.wsService.disconnect();
            }
        }
    }
});
