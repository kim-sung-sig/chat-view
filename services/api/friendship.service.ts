/**
 * 친구 관계 API 서비스
 * 백엔드 /api/friendships 엔드포인트 12개 래핑
 */
export interface FriendshipResponse {
  id: string;
  userId: string;
  friendId: string;
  status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
  nickname?: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export class FriendshipService {
  private apiFetch: any;

  constructor() {
    const { apiFetch } = useApi();
    this.apiFetch = apiFetch;
  }

  /** 친구 목록 조회 */
  async getFriends(): Promise<FriendshipResponse[]> {
    return this.apiFetch('/api/friendships');
  }

  /** 보낸 친구 요청 목록 */
  async getSentRequests(): Promise<FriendshipResponse[]> {
    return this.apiFetch('/api/friendships/sent');
  }

  /** 받은 친구 요청 목록 */
  async getPendingRequests(): Promise<FriendshipResponse[]> {
    return this.apiFetch('/api/friendships/pending');
  }

  /** 차단 목록 */
  async getBlocked(): Promise<FriendshipResponse[]> {
    return this.apiFetch('/api/friendships/blocked');
  }

  /** 즐겨찾기 목록 */
  async getFavorites(): Promise<FriendshipResponse[]> {
    return this.apiFetch('/api/friendships/favorites');
  }

  /** 친구 요청 전송 */
  async sendRequest(targetUserId: string): Promise<FriendshipResponse> {
    return this.apiFetch('/api/friendships/request', {
      method: 'POST',
      body: { targetUserId }
    });
  }

  /** 친구 요청 수락 */
  async acceptRequest(requestId: string): Promise<FriendshipResponse> {
    return this.apiFetch(`/api/friendships/${requestId}/accept`, { method: 'PUT' });
  }

  /** 친구 요청 거절 */
  async rejectRequest(requestId: string): Promise<void> {
    await this.apiFetch(`/api/friendships/${requestId}/reject`, { method: 'DELETE' });
  }

  /** 친구 삭제 */
  async removeFriend(friendId: string): Promise<void> {
    await this.apiFetch(`/api/friendships/${friendId}`, { method: 'DELETE' });
  }

  /** 차단 */
  async blockUser(friendId: string): Promise<FriendshipResponse> {
    return this.apiFetch(`/api/friendships/${friendId}/block`, { method: 'PUT' });
  }

  /** 차단 해제 */
  async unblockUser(friendId: string): Promise<FriendshipResponse> {
    return this.apiFetch(`/api/friendships/${friendId}/unblock`, { method: 'PUT' });
  }

  /** 별칭 설정 */
  async setNickname(friendId: string, nickname: string): Promise<FriendshipResponse> {
    return this.apiFetch(`/api/friendships/${friendId}/nickname`, {
      method: 'PUT',
      body: { nickname }
    });
  }

  /** 즐겨찾기 토글 */
  async toggleFavorite(friendId: string): Promise<FriendshipResponse> {
    return this.apiFetch(`/api/friendships/${friendId}/favorite`, { method: 'PUT' });
  }
}
