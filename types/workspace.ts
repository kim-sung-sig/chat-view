/**
 * 워크스페이스 관련 타입 정의
 * 워크스페이스, 멤버, 권한 등의 타입을 정의합니다.
 */

// ============================================
// Workspace (워크스페이스)
// ============================================
export interface Workspace {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string

  // 메타데이터
  createdAt: Date
  updatedAt: Date
  createdBy: string

  // 설정
  settings?: WorkspaceSettings
}

export interface WorkspaceSettings {
  allowPublicChannels: boolean
  allowGuestInvites: boolean
  defaultChannelId?: string
  retentionDays?: number
}

// ============================================
// Workspace Member (워크스페이스 멤버)
// ============================================
export type MemberRole = 'owner' | 'admin' | 'member' | 'guest'

export interface WorkspaceMember {
  userId: string
  workspaceId: string
  role: MemberRole

  // 사용자 정보 (조인된 데이터)
  username?: string
  email?: string
  avatar?: string
  displayName?: string

  // 상태
  status?: 'online' | 'offline' | 'away' | 'busy'
  statusMessage?: string

  // 메타데이터
  joinedAt: Date
  lastActiveAt?: Date
}

// ============================================
// Permission (권한)
// ============================================
export interface Permission {
  // 채널 권한
  canCreateChannel: boolean
  canDeleteChannel: boolean
  canEditChannel: boolean
  canInviteMembers: boolean

  // 메시지 권한
  canSendMessage: boolean
  canEditMessage: boolean
  canDeleteMessage: boolean
  canPinMessage: boolean

  // 파일 권한
  canUploadFile: boolean
  canDeleteFile: boolean

  // 관리 권한
  canManageMembers: boolean
  canManageSettings: boolean
}

// 역할별 기본 권한
export const DEFAULT_PERMISSIONS: Record<MemberRole, Permission> = {
  owner: {
    canCreateChannel: true,
    canDeleteChannel: true,
    canEditChannel: true,
    canInviteMembers: true,
    canSendMessage: true,
    canEditMessage: true,
    canDeleteMessage: true,
    canPinMessage: true,
    canUploadFile: true,
    canDeleteFile: true,
    canManageMembers: true,
    canManageSettings: true,
  },
  admin: {
    canCreateChannel: true,
    canDeleteChannel: true,
    canEditChannel: true,
    canInviteMembers: true,
    canSendMessage: true,
    canEditMessage: true,
    canDeleteMessage: true,
    canPinMessage: true,
    canUploadFile: true,
    canDeleteFile: true,
    canManageMembers: true,
    canManageSettings: false,
  },
  member: {
    canCreateChannel: true,
    canDeleteChannel: false,
    canEditChannel: false,
    canInviteMembers: true,
    canSendMessage: true,
    canEditMessage: true,
    canDeleteMessage: false,
    canPinMessage: false,
    canUploadFile: true,
    canDeleteFile: false,
    canManageMembers: false,
    canManageSettings: false,
  },
  guest: {
    canCreateChannel: false,
    canDeleteChannel: false,
    canEditChannel: false,
    canInviteMembers: false,
    canSendMessage: true,
    canEditMessage: true,
    canDeleteMessage: false,
    canPinMessage: false,
    canUploadFile: false,
    canDeleteFile: false,
    canManageMembers: false,
    canManageSettings: false,
  },
}

// ============================================
// Invite (초대)
// ============================================
export interface WorkspaceInvite {
  id: string
  workspaceId: string
  email: string
  role: MemberRole
  invitedBy: string
  expiresAt: Date
  createdAt: Date
}
