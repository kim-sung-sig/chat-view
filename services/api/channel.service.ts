/**
 * 채널 API 서비스
 * /api/v1/channels
 */

import type { ApiResponse } from '~/types';

export interface ChannelResponse {
  channelId: string;
  name: string;
  type: 'DIRECT' | 'GROUP' | 'PUBLIC' | 'PRIVATE';
  description?: string;
  createdAt: string;
  memberCount?: number;
}

export interface ChannelDetailResponse extends ChannelResponse {
  members?: Array<{
    userId: string;
    role: string;
  }>;
}

export interface CreateDirectChannelRequest {
  targetUserId: string;
}

export interface CreateGroupChannelRequest {
  name: string;
  memberIds: string[];
}

export interface CreatePublicChannelRequest {
  name: string;
  description?: string;
}

export interface CreatePrivateChannelRequest {
  name: string;
  description?: string;
  memberIds: string[];
}

export class ChannelService {
  private apiFetch: any;

  constructor() {
    const { apiFetch } = useApi();
    this.apiFetch = apiFetch;
  }

  /**
   * 내가 속한 채널 목록 조회
   */
  async getMyChannels(): Promise<ChannelResponse[]> {
    const response = await this.apiFetch<ApiResponse<ChannelResponse[]>>(
      '/api/v1/channels/my'
    );
    return response.data || [];
  }

  /**
   * 공개 채널 목록 조회
   */
  async getPublicChannels(): Promise<ChannelResponse[]> {
    const response = await this.apiFetch<ApiResponse<ChannelResponse[]>>(
      '/api/v1/channels/public-list'
    );
    return response.data || [];
  }

  /**
   * 채널 상세 조회
   */
  async getChannel(channelId: string): Promise<ChannelDetailResponse> {
    const response = await this.apiFetch<ApiResponse<ChannelDetailResponse>>(
      `/api/v1/channels/${channelId}`
    );
    return response.data;
  }

  /**
   * 일대일 채널 생성
   */
  async createDirectChannel(request: CreateDirectChannelRequest): Promise<ChannelResponse> {
    const response = await this.apiFetch<ApiResponse<ChannelResponse>>(
      '/api/v1/channels/direct',
      {
        method: 'POST',
        body: request
      }
    );
    return response.data;
  }

  /**
   * 그룹 채널 생성
   */
  async createGroupChannel(request: CreateGroupChannelRequest): Promise<ChannelResponse> {
    const response = await this.apiFetch<ApiResponse<ChannelResponse>>(
      '/api/v1/channels/group',
      {
        method: 'POST',
        body: request
      }
    );
    return response.data;
  }

  /**
   * 공개 채널 생성
   */
  async createPublicChannel(request: CreatePublicChannelRequest): Promise<ChannelResponse> {
    const response = await this.apiFetch<ApiResponse<ChannelResponse>>(
      '/api/v1/channels/public',
      {
        method: 'POST',
        body: request
      }
    );
    return response.data;
  }

  /**
   * 비공개 채널 생성
   */
  async createPrivateChannel(request: CreatePrivateChannelRequest): Promise<ChannelResponse> {
    const response = await this.apiFetch<ApiResponse<ChannelResponse>>(
      '/api/v1/channels/private',
      {
        method: 'POST',
        body: request
      }
    );
    return response.data;
  }
}
