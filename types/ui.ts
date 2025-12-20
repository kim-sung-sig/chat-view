/**
 * UI 상태 및 인터페이스 타입 정의
 * 전역 UI 상태, 모달, 사이드바 등의 타입을 정의합니다.
 */

// ============================================
// Theme (테마)
// ============================================
export type Theme = 'light' | 'dark'

// ============================================
// Sidebar (사이드바)
// ============================================
export type SidebarContent = 'channels' | 'dms' | 'starred' | 'apps'

export type RightPanelContent =
  | 'thread'      // 스레드 보기
  | 'members'     // 멤버 목록
  | 'details'     // 채널 상세 정보
  | 'files'       // 파일 목록
  | 'pinned'      // 고정된 메시지
  | null          // 패널 닫힘

// ============================================
// Modal (모달)
// ============================================
export type ModalType =
  | 'createChannel'   // 채널 생성
  | 'editChannel'     // 채널 편집
  | 'inviteMember'    // 멤버 초대
  | 'userProfile'     // 사용자 프로필
  | 'settings'        // 설정
  | 'uploadFile'      // 파일 업로드
  | null              // 모달 닫힘

// ============================================
// UI State (UI 상태)
// ============================================
export interface UIState {
  // 사이드바 상태
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  rightPanelContent: RightPanelContent

  // 모달 상태
  activeModal: ModalType
  modalProps?: Record<string, any>

  // 테마
  theme: Theme

  // 반응형
  isMobile: boolean
  isTablet: boolean

  // 로딩
  isLoading: boolean
  loadingMessage?: string
}

// ============================================
// Toast Notification (알림)
// ============================================
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastNotification {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// ============================================
// Button (버튼)
// ============================================
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

// ============================================
// Avatar (아바타)
// ============================================
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type OnlineStatus = 'online' | 'offline' | 'away' | 'busy'

export interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  status?: OnlineStatus
  showStatus?: boolean
}

// ============================================
// Modal (모달 Props)
// ============================================
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  isOpen: boolean
  title?: string
  size?: ModalSize
  closeable?: boolean
  onClose: () => void
}

// ============================================
// Dropdown (드롭다운)
// ============================================
export interface DropdownItem {
  id: string
  label: string
  icon?: any
  onClick: () => void
  disabled?: boolean
  divider?: boolean
}

// ============================================
// Keyboard Shortcuts (키보드 단축키)
// ============================================
export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}
