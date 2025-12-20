import { defineStore } from 'pinia'
import type { Channel, ChannelDetail } from '~/types/channel'

interface ChannelState {
  channels: Channel[]
  currentChannel: ChannelDetail | null
  loading: boolean
  error: string | null
}

export const useChannelStore = defineStore('channel', {
  state: (): ChannelState => ({
    channels: [],
    currentChannel: null,
    loading: false,
    error: null
  }),

  getters: {
    getChannels: (state) => state.channels,
    getCurrentChannel: (state) => state.currentChannel,
    isLoading: (state) => state.loading
  },

  actions: {
    // 채널 목록 조회
    async fetchChannels(userId: string) {
      this.loading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<any>(`${config.public.systemApiUrl}/api/v1/channels`, {
          params: { userId }
        })
        
        this.channels = response.data || []
      } catch (error: any) {
        this.error = error.message || '채널 목록을 불러오는데 실패했습니다'
        console.error('Failed to fetch channels:', error)
      } finally {
        this.loading = false
      }
    },

    // 채널 상세 조회
    async fetchChannelDetail(channelId: string) {
      this.loading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<any>(`${config.public.systemApiUrl}/api/v1/channels/${channelId}`)
        
        this.currentChannel = response.data
      } catch (error: any) {
        this.error = error.message || '채널 정보를 불러오는데 실패했습니다'
        console.error('Failed to fetch channel detail:', error)
      } finally {
        this.loading = false
      }
    },

    // 일대일 채널 생성
    async createDirectChannel(currentUserId: string, targetUserId: string) {
      this.loading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<any>(`${config.public.systemApiUrl}/api/v1/channels/direct`, {
          method: 'POST',
          body: { currentUserId, targetUserId }
        })
        
        const newChannel = response.data
        this.channels.unshift(newChannel)
        return newChannel
      } catch (error: any) {
        this.error = error.message || '채널 생성에 실패했습니다'
        console.error('Failed to create channel:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 그룹 채널 생성
    async createGroupChannel(creatorUserId: string, name: string, memberUserIds: string[], description?: string) {
      this.loading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<any>(`${config.public.systemApiUrl}/api/v1/channels/group`, {
          method: 'POST',
          body: { creatorUserId, name, description, memberUserIds }
        })
        
        const newChannel = response.data
        this.channels.unshift(newChannel)
        return newChannel
      } catch (error: any) {
        this.error = error.message || '그룹 채널 생성에 실패했습니다'
        console.error('Failed to create group channel:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 현재 채널 설정
    setCurrentChannel(channel: ChannelDetail | null) {
      this.currentChannel = channel
    },

    // 에러 초기화
    clearError() {
      this.error = null
    }
  }
})
