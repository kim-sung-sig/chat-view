import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
    state: () => ({
        mobileSidebarOpen: false,
        mobileServerSidebarOpen: false,
        showSettings: false,
    }),
    actions: {
        toggleMobileSidebar() {
            this.mobileSidebarOpen = !this.mobileSidebarOpen;
        },
        closeMobileSidebar() {
            this.mobileSidebarOpen = false;
        },
        openMobileSidebar() {
            this.mobileSidebarOpen = true;
        },
        openSettings() {
            this.showSettings = true;
        },
        closeSettings() {
            this.showSettings = false;
        }
    }
});

