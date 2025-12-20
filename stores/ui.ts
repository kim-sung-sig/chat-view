/**
 * UI 상태 관리 Store
 * 사이드바, 모달, 테마 등 전역 UI 상태를 관리합니다.
 */

import { defineStore } from 'pinia'
import type {
  UIState,
  RightPanelContent,
  ModalType,
  Theme,
  ToastNotification
} from '~/types/ui'

export const useUIStore = defineStore('ui', {
  // ============================================
  // State
  // ============================================
  state: (): UIState & { toasts: ToastNotification[] } => ({
    // 사이드바 상태
    leftSidebarOpen: true,
    rightSidebarOpen: false,
    rightPanelContent: null,

    // 모달 상태
    activeModal: null,
    modalProps: undefined,

    // 테마
    theme: 'light',

    // 반응형
    isMobile: false,
    isTablet: false,

    // 로딩
    isLoading: false,
    loadingMessage: undefined,

    // 알림
    toasts: [],
  }),

  // ============================================
  // Getters
  // ============================================
  getters: {
    /**
     * 현재 모달이 열려있는지 확인
     */
    isModalOpen: (state): boolean => state.activeModal !== null,

    /**
     * 우측 패널이 열려있는지 확인
     */
    isRightPanelOpen: (state): boolean => state.rightSidebarOpen && state.rightPanelContent !== null,

    /**
     * 다크 모드 활성화 여부
     */
    isDarkMode: (state): boolean => state.theme === 'dark',

    /**
     * 모바일/태블릿 여부
     */
    isMobileOrTablet: (state): boolean => state.isMobile || state.isTablet,
  },

  // ============================================
  // Actions
  // ============================================
  actions: {
    // ---------- 사이드바 관리 ----------

    /**
     * 왼쪽 사이드바 토글
     */
    toggleLeftSidebar() {
      this.leftSidebarOpen = !this.leftSidebarOpen
    },

    /**
     * 왼쪽 사이드바 열기/닫기
     */
    setLeftSidebarOpen(open: boolean) {
      this.leftSidebarOpen = open
    },

    /**
     * 우측 패널 토글
     */
    toggleRightSidebar() {
      this.rightSidebarOpen = !this.rightSidebarOpen
      if (!this.rightSidebarOpen) {
        this.rightPanelContent = null
      }
    },

    /**
     * 우측 패널 열기 (특정 컨텐츠)
     */
    openRightPanel(content: RightPanelContent) {
      this.rightSidebarOpen = true
      this.rightPanelContent = content
    },

    /**
     * 우측 패널 닫기
     */
    closeRightPanel() {
      this.rightSidebarOpen = false
      this.rightPanelContent = null
    },

    // ---------- 모달 관리 ----------

    /**
     * 모달 열기
     */
    openModal(type: ModalType, props?: Record<string, any>) {
      this.activeModal = type
      this.modalProps = props
    },

    /**
     * 모달 닫기
     */
    closeModal() {
      this.activeModal = null
      this.modalProps = undefined
    },

    // ---------- 테마 관리 ----------

    /**
     * 테마 설정
     */
    setTheme(theme: Theme) {
      this.theme = theme

      // HTML 클래스 업데이트
      if (process.client) {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }

        // 로컬 스토리지에 저장
        localStorage.setItem('theme', theme)
      }
    },

    /**
     * 테마 토글
     */
    toggleTheme() {
      const newTheme = this.theme === 'light' ? 'dark' : 'light'
      this.setTheme(newTheme)
    },

    /**
     * 저장된 테마 로드
     */
    loadTheme() {
      if (process.client) {
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme) {
          this.setTheme(savedTheme)
        }
      }
    },

    // ---------- 반응형 관리 ----------

    /**
     * 화면 크기 업데이트
     */
    updateScreenSize() {
      if (process.client) {
        this.isMobile = window.innerWidth < 768
        this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

        // 모바일에서는 자동으로 사이드바 닫기
        if (this.isMobile) {
          this.leftSidebarOpen = false
          this.rightSidebarOpen = false
        }
      }
    },

    // ---------- 로딩 관리 ----------

    /**
     * 로딩 시작
     */
    startLoading(message?: string) {
      this.isLoading = true
      this.loadingMessage = message
    },

    /**
     * 로딩 종료
     */
    stopLoading() {
      this.isLoading = false
      this.loadingMessage = undefined
    },

    // ---------- Toast 알림 관리 ----------

    /**
     * Toast 알림 추가
     */
    addToast(toast: Omit<ToastNotification, 'id'>) {
      const id = `toast-${Date.now()}-${Math.random()}`
      const newToast: ToastNotification = {
        id,
        duration: 3000, // 기본 3초
        ...toast,
      }

      this.toasts.push(newToast)

      // 자동 제거
      if (newToast.duration) {
        setTimeout(() => {
          this.removeToast(id)
        }, newToast.duration)
      }
    },

    /**
     * Toast 알림 제거
     */
    removeToast(id: string) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    /**
     * 성공 알림
     */
    showSuccess(title: string, message?: string) {
      this.addToast({ type: 'success', title, message })
    },

    /**
     * 에러 알림
     */
    showError(title: string, message?: string) {
      this.addToast({ type: 'error', title, message })
    },

    /**
     * 경고 알림
     */
    showWarning(title: string, message?: string) {
      this.addToast({ type: 'warning', title, message })
    },

    /**
     * 정보 알림
     */
    showInfo(title: string, message?: string) {
      this.addToast({ type: 'info', title, message })
    },

    // ---------- 초기화 ----------

    /**
     * UI Store 초기화
     */
    initialize() {
      this.loadTheme()
      this.updateScreenSize()

      // 화면 크기 변경 감지
      if (process.client) {
        window.addEventListener('resize', () => {
          this.updateScreenSize()
        })
      }
    },
  },
})
