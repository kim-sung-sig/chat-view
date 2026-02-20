/**
 * 메시지 API 서비스
 * - Command (발송): /api/messages
 * - Query (조회): /api/v1/messages
 */

import type { ApiResponse } from '~/types';

export interface SendMessageRequest {
  channelId: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'MIXED';
  textContent?: string;
  imageUrls?: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface EditMessageRequest {
  content: string;
}

export interface ReactionRequest {
  emoji: string;
}

export interface MessageResponse {
  messageId: string;
  channelId: string;
  userId: string;
  messageType: string;
  textContent?: string;
  imageUrls?: string[];
  sentAt: string;
}

export interface CursorPageResponse<T> {
  data: T[];
  nextCursor?: string;
  hasNext: boolean;
  totalCount?: number;
}

export class MessageService {
  private apiFetch: any;

  constructor() {
    const { apiFetch } = useApi();
    this.apiFetch = apiFetch;
  }

  /**
   * 메시지 발송 (Command)
   */
  async sendMessage(request: SendMessageRequest): Promise<MessageResponse> {
    const response = await this.apiFetch<MessageResponse>(
      '/api/messages',
      {
        method: 'POST',
        body: request
      }
    );
    return response;
  }

  /**
   * 채널 메시지 목록 조회 (Query, 커서 페이징)
   */
  async getMessages(
    channelId: string,
    cursor?: string,
    limit: number = 50
  ): Promise<CursorPageResponse<MessageResponse>> {
    const params = new URLSearchParams({
      channelId,
      limit: limit.toString()
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await this.apiFetch<ApiResponse<CursorPageResponse<MessageResponse>>>(
      `/api/v1/messages?${params.toString()}`
    );
    
    return response.data;
  }

  /**
   * 특정 메시지 조회
   */
  async getMessage(messageId: string): Promise<MessageResponse> {
    const response = await this.apiFetch<ApiResponse<MessageResponse>>(
      `/api/v1/messages/${messageId}`
    );
    return response.data;
  }

  /**
   * 읽지 않은 메시지 수 조회
   */
  async getUnreadCount(channelId: string): Promise<number> {
    const response = await this.apiFetch<ApiResponse<number>>(
      `/api/v1/messages/unread-count?channelId=${channelId}`
    );
    return response.data;
  }

  /**
   * 메시지 편집
   */
  async editMessage(messageId: string, content: string): Promise<MessageResponse> {
    const response = await this.apiFetch<ApiResponse<MessageResponse>>(
      `/api/messages/${messageId}`,
      { method: 'PUT', body: { content } }
    );
    return response.data ?? response;
  }

  /**
   * 메시지 삭제
   */
  async deleteMessage(messageId: string): Promise<void> {
    await this.apiFetch(`/api/messages/${messageId}`, { method: 'DELETE' });
  }

  /**
   * 리액션 추가/토글
   */
  async toggleReaction(messageId: string, emoji: string): Promise<void> {
    await this.apiFetch(`/api/messages/${messageId}/reactions`, {
      method: 'POST',
      body: { emoji }
    });
  }
}
