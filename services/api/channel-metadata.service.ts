export interface ChannelMetadataResponse {
  channelId: string;
  unreadCount: number;
  mentionCount: number;
  lastReadAt?: string;
  lastActivityAt?: string;
  notificationEnabled: boolean;
  favorite: boolean;
  pinned: boolean;
}
export class ChannelMetadataService {
  private apiFetch: any;
  constructor() { const { apiFetch } = useApi(); this.apiFetch = apiFetch; }
  async getMetadata(channelId: string): Promise<ChannelMetadataResponse> {
    return this.apiFetch(`/api/channels/${channelId}/metadata`);
  }
  async markAsRead(channelId: string, lastMessageId?: string): Promise<void> {
    await this.apiFetch(`/api/channels/${channelId}/read`, { method: 'PUT', body: lastMessageId ? { lastMessageId } : {} });
  }
  async toggleNotification(channelId: string, enabled: boolean): Promise<void> {
    await this.apiFetch(`/api/channels/${channelId}/notification`, { method: 'PUT', body: { enabled } });
  }
  async toggleFavorite(channelId: string): Promise<void> {
    await this.apiFetch(`/api/channels/${channelId}/favorite`, { method: 'PUT' });
  }
  async togglePin(channelId: string): Promise<void> {
    await this.apiFetch(`/api/channels/${channelId}/pin`, { method: 'PUT' });
  }
  async getUnreadChannels(): Promise<ChannelMetadataResponse[]> {
    return this.apiFetch('/api/channels/unread');
  }
}
