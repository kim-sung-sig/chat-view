import { defineStore } from 'pinia';
import type { Theme, MessageDensity, NotificationSettings } from '~/types';

export const useUIStore = defineStore('ui', {
    state: () => ({
        // 모바일 패널
        mobileSidebarOpen: false,
        mobileServerSidebarOpen: false,
        activeMobilePanel: 'chat' as 'server' | 'channel' | 'chat' | 'members',

        // 모달/패널 토글
        showSettings: false,
        showMemberList: true,
        showChannelSearch: false,

        // 설정 활성 탭
        settingsTab: 'account' as string,

        // 테마 & 표시 설정
        theme: (typeof localStorage !== 'undefined'
            ? (localStorage.getItem('theme') as Theme) || 'dark'
            : 'dark') as Theme,
        messageDensity: 'comfortable' as MessageDensity,
        fontSize: 16,

        // 알림 설정
        notificationSettings: {
            enabled: false,
            mentions: true,
            allMessages: false,
            sounds: true
        } as NotificationSettings,

        // 스크롤 위치 복원
        scrollPositions: {} as Record<string, number>,

        // 읽지 않은 메시지 카운트
        unreadMap: {} as Record<string, number>,
        mentionMap: {} as Record<string, number>,

        // 답장 대상
        replyToMessageId: null as string | null,

        // 편집 중 메시지
        editingMessageId: null as string | null,
    }),

    getters: {
        totalUnread: (state) => Object.values(state.unreadMap).reduce((a, b) => a + b, 0),
        totalMentions: (state) => Object.values(state.mentionMap).reduce((a, b) => a + b, 0),
    },

    actions: {
        // ── 모바일 ──────────────────────────────
        toggleMobileSidebar() { this.mobileSidebarOpen = !this.mobileSidebarOpen; },
        closeMobileSidebar() { this.mobileSidebarOpen = false; },
        openMobileSidebar() { this.mobileSidebarOpen = true; },
        setActiveMobilePanel(panel: typeof this.activeMobilePanel) {
            this.activeMobilePanel = panel;
        },

        // ── 모달 ────────────────────────────────
        openSettings(tab = 'account') {
            this.settingsTab = tab;
            this.showSettings = true;
        },
        closeSettings() { this.showSettings = false; },
        toggleMemberList() { this.showMemberList = !this.showMemberList; },
        toggleChannelSearch() { this.showChannelSearch = !this.showChannelSearch; },

        // ── 테마 ────────────────────────────────
        setTheme(theme: Theme) {
            this.theme = theme;
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', theme);
            }
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('theme', theme);
            }
        },
        setMessageDensity(density: MessageDensity) { this.messageDensity = density; },
        setFontSize(size: number) { this.fontSize = Math.max(12, Math.min(20, size)); },

        // ── 알림 ────────────────────────────────
        async requestNotificationPermission() {
            if (typeof Notification === 'undefined') return false;
            const permission = await Notification.requestPermission();
            this.notificationSettings.enabled = permission === 'granted';
            return permission === 'granted';
        },
        updateNotificationSettings(settings: Partial<NotificationSettings>) {
            this.notificationSettings = { ...this.notificationSettings, ...settings };
        },

        // ── 읽지 않은 메시지 ─────────────────────
        incrementUnread(channelId: string, isMention = false) {
            this.unreadMap[channelId] = (this.unreadMap[channelId] || 0) + 1;
            if (isMention) {
                this.mentionMap[channelId] = (this.mentionMap[channelId] || 0) + 1;
            }
        },
        clearUnread(channelId: string) {
            this.unreadMap[channelId] = 0;
            this.mentionMap[channelId] = 0;
        },

        // ── 스크롤 위치 ─────────────────────────
        saveScrollPosition(channelId: string, position: number) {
            this.scrollPositions[channelId] = position;
        },
        getScrollPosition(channelId: string): number {
            return this.scrollPositions[channelId] ?? -1;
        },

        // ── 답장/편집 ───────────────────────────
        setReplyTo(messageId: string | null) { this.replyToMessageId = messageId; },
        setEditing(messageId: string | null) { this.editingMessageId = messageId; },

        // ── 초기화 ──────────────────────────────
        initTheme() {
            const saved = typeof localStorage !== 'undefined'
                ? (localStorage.getItem('theme') as Theme) || 'dark'
                : 'dark';
            this.setTheme(saved);
        }
    }
});
