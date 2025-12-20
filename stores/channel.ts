import { defineStore } from 'pinia'

export interface Channel {
  channelId: string
  name: string
  description?: string
  type: 'TEXT' | 'VOICE' | 'ANNOUNCEMENT'
  isPrivate: boolean
  memberCount: number
  unreadCount?: number
  lastMessage?: {
    content: string
    timestamp: string
  }
  createdAt: string
  createdBy: string
}

interface ChannelState {
  channels: Channel[]
  currentChannelId: string | null
  directMessages: any[]
  loading: boolean
  error: string | null
}

export const useChannelStore = defineStore('channel', {
  state: (): ChannelState => ({
    channels: [
      // 임시 기본 채널
      {
        channelId: 'general',
        name: 'general',
        description: '일반 대화 채널',
        type: 'TEXT',
        isPrivate: false,
        memberCount: 100,
        unreadCount: 5,
        lastMessage: {
          content: '환영합니다!',
          timestamp: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
      },
      {
        channelId: 'random',
        name: 'random',
        description: '자유로운 잡담',
        type: 'TEXT',
        isPrivate: false,
        memberCount: 50,
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
      },
      {
        channelId: 'announcements',
        name: 'announcements',
        description: '공지사항',
        type: 'ANNOUNCEMENT',
        isPrivate: false,
        memberCount: 200,
        unreadCount: 1,
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
      }
    ],
    currentChannelId: null,
    directMessages: [],
    loading: false,
    error: null
  }),

  getters: {
    currentChannel: (state) => {
      return state.channels.find(c => c.channelId === state.currentChannelId) || null
    },

    textChannels: (state) => {
      return state.channels.filter(c => c.type === 'TEXT')
    },

    voiceChannels: (state) => {
      return state.channels.filter(c => c.type === 'VOICE')
    },

    announcementChannels: (state) => {
      return state.channels.filter(c => c.type === 'ANNOUNCEMENT')
    }
  },

  actions: {
    // 채널 목록 조회 (임시)
    async fetchChannels(userId: string) {
      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 300))
      this.loading = false
    },

    // 채널 상세 조회 (임시)
    async fetchChannelDetail(channelId: string) {
      this.loading = true
      this.currentChannelId = channelId
      await new Promise(resolve => setTimeout(resolve, 300))
      this.loading = false
    },

    // 채널 생성
    async createChannel(data: {
      name: string
      description?: string
      type: 'TEXT' | 'VOICE' | 'ANNOUNCEMENT'
      isPrivate: boolean
    }) {
      this.loading = true

      const authStore = useAuthStore()
      const newChannel: Channel = {
        channelId: `channel-${Date.now()}`,
        name: data.name,
        description: data.description,
        type: data.type,
        isPrivate: data.isPrivate,
        memberCount: 1,
        createdAt: new Date().toISOString(),
        createdBy: authStore.currentUser?.userId || 'unknown'
      }

      this.channels.push(newChannel)

      await new Promise(resolve => setTimeout(resolve, 500))
      this.loading = false

      return newChannel
    },

    // 채널 수정
    async updateChannel(channelId: string, data: Partial<Channel>) {
      this.loading = true

      const index = this.channels.findIndex(c => c.channelId === channelId)
      if (index !== -1) {
        this.channels[index] = { ...this.channels[index], ...data }
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      this.loading = false
    },

    // 채널 삭제
    async deleteChannel(channelId: string) {
      this.loading = true

      this.channels = this.channels.filter(c => c.channelId !== channelId)

      if (this.currentChannelId === channelId) {
        this.currentChannelId = null
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      this.loading = false
    },

    // 채널 참여
    async joinChannel(channelId: string) {
      const channel = this.channels.find(c => c.channelId === channelId)
      if (channel) {
        channel.memberCount++
      }
      await new Promise(resolve => setTimeout(resolve, 300))
    },

    // 채널 나가기
    async leaveChannel(channelId: string) {
      const channel = this.channels.find(c => c.channelId === channelId)
      if (channel && channel.memberCount > 0) {
        channel.memberCount--
      }
      await new Promise(resolve => setTimeout(resolve, 300))
    },

    // 현재 채널 설정
    setCurrentChannel(channelId: string | null) {
      this.currentChannelId = channelId
    },

    // 채널 초기화
    clearChannels() {
      this.channels = []
      this.currentChannelId = null
      this.directMessages = []
    }
  }
})

