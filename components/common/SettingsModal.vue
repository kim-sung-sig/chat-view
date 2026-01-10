<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '~/store/data';
import { useUIStore } from '~/store/ui';

const uiStore = useUIStore();
const dataStore = useDataStore();
const currentUser = computed(() => dataStore.currentUser);

const activeCategory = ref('My Account');
const mobileMenuOpen = ref(false); // If true, show sidebar on mobile. If false, show content.

const categories = [
    { header: 'USER SETTINGS' },
    { name: 'My Account' },
    { name: 'Profiles' },
    { name: 'Privacy & Safety' },
    { name: 'Family Center' },
    { separator: true },
    { header: 'APP SETTINGS' },
    { name: 'Appearance' },
    { name: 'Accessibility' },
    { name: 'Voice & Video' },
    { separator: true },
    { name: 'Log Out', danger: true }
];

const selectCategory = (name: string) => {
    activeCategory.value = name;
    mobileMenuOpen.value = false; // Show content on mobile
};

const close = () => {
    // Reverse animation logic could go here, but for now just close
    uiStore.closeSettings();
};

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<template>
  <div class="settings-overlay" @click.self="close">
    <div class="settings-container">
        <!-- Sidebar -->
        <div class="sidebar" :class="{ 'mobile-hidden': !mobileMenuOpen }">
            <div class="sidebar-scroll">
                <template v-for="(item, idx) in categories" :key="idx">
                    <div v-if="item.header" class="header">{{ item.header }}</div>
                    <div v-else-if="item.separator" class="separator"></div>
                    <div 
                        v-else 
                        class="item" 
                        :class="{ 'active': activeCategory === item.name, 'logout': item.danger }"
                        @click="selectCategory(item.name!)"
                    >
                        {{ item.name }}
                    </div>
                </template>
            </div>
        </div>

        <!-- Content -->
        <div class="content" :class="{ 'mobile-hidden': mobileMenuOpen }">
            <div class="content-scroll">
                 <!-- Mobile Back Button -->
                <div class="mobile-nav mobile-only">
                    <button class="menu-btn" @click="toggleMobileMenu">☰ Menu</button>
                    <h2>{{ activeCategory }}</h2>
                </div>

                <div v-if="activeCategory === 'My Account'">
                    <h2 class="desktop-only">My Account</h2>
                    
                    <div class="profile-card" v-if="currentUser">
                   <div class="banner"></div>
                   <div class="user-details">
                       <div class="avatar-uploader">
                           <img :src="currentUser.avatarUrl" />
                       </div>
                       <div class="name-tag">
                           <h3>{{ currentUser.username }}</h3>
                           <span>#{{ currentUser.discriminator }}</span>
                       </div>
                       <button class="edit-btn">Edit User Profile</button>
                   </div>
                   <div class="info-row">
                       <div class="label">DISPLAY NAME</div>
                       <div class="val">{{ currentUser.username }}</div>
                       <button class="btn-secondary">Edit</button>
                   </div>
                   <div class="info-row">
                       <div class="label">USERNAME</div>
                       <div class="val">{{ currentUser.username }}</div>
                       <button class="btn-secondary">Edit</button>
                   </div>
                   <div class="info-row">
                       <div class="label">EMAIL</div>
                       <div class="val">user@example.com</div>
                       <button class="btn-secondary">Edit</button>
                   </div>
                   <div class="info-row">
                       <div class="label">PHONE NUMBER</div>
                       <div class="val">Not set</div>
                       <button class="btn-secondary">Add</button>
                   </div>
                    </div>
                </div>

                <div v-else class="placeholder-content">
                    <h2>{{ activeCategory }}</h2>
                    <p>Settings for {{ activeCategory }} are not implemented in this demo.</p>
                </div>
            </div>
            
            <div class="close-btn-wrapper">
                <button class="esc-btn" @click="close">
                    <div class="esc-icon">×</div>
                    <div class="esc-text">ESC</div>
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    /* Genie effect origin: roughly where the user panel cog button is (left sidebar width + padding) */
    /* Sidebar is ~312px (72 server + 240 channel) */
    /* Button is near bottom */
    perspective: 1000px;
    overflow: hidden;
}

.settings-container {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: var(--bg-primary);
    
    /* The Genie Animation */
    /* Simple Zoom/Fade Animation */
    animation: dialogOpen 0.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

@keyframes dialogOpen {
    0% {
        transform: scale(0.95);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}


/* Sidebar */
.sidebar {
    width: 360px; /* Wider for settings sidebar style */
    background-color: var(--bg-secondary);
    display: flex;
    justify-content: flex-end;
    padding-top: 60px;
    flex-shrink: 0;
}

.sidebar-scroll {
    width: 192px; /* Content width */
    padding: 0 6px 10px 20px;
    overflow-y: auto;
}

.header {
    font-size: 12px;
    font-weight: 700;
    color: var(--c-text-muted);
    padding: 6px 10px;
    margin-bottom: 2px;
}

.item {
    font-size: 15px;
    color: var(--c-text-normal);
    padding: 6px 10px;
    margin-bottom: 2px;
    border-radius: 4px;
    cursor: pointer;
}
.item:hover { background-color: var(--bg-hover); }
.item.active { background-color: #404249; color: var(--c-text-header); }
.item.logout { color: var(--c-danger); }
.separator { margin: 8px 10px; height: 1px; background-color: var(--bg-hover); }

/* Content */
.content {
    flex: 1;
    background-color: var(--bg-primary);
    padding-top: 60px;
    padding-left: 40px;
    position: relative;
    display: flex;
    min-width: 0;
}

.content-scroll {
    max-width: 660px;
    width: 100%;
    min-width: 460px;
    padding-bottom: 40px;
    overflow-y: auto;
    padding-right: 20px; /* Add padding for scrollbar */
}

h2 { margin-bottom: 20px; font-weight: 600; font-size: 20px; color: var(--c-text-header); }

.profile-card {
    background-color: #111214; /* Deep dark profile bg */
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
}

.banner {
    height: 100px;
    background-color: #5865f2; /* Default banner */
}

.user-details {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 16px 16px 16px 120px;
    position: relative;
    margin-bottom: 16px;
    flex-wrap: wrap; /* responsive wrap */
    gap: 10px;
}

.avatar-uploader {
    position: absolute;
    top: -40px; /* Overlap banner */
    left: 16px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 6px solid #111214;
    background-color: #111214;
}
.avatar-uploader img { width: 100%; height: 100%; border-radius: 50%; }

.name-tag h3 { display: inline; font-size: 20px; font-weight: 600; color: white; }
.name-tag span { font-size: 20px; color: var(--c-text-muted); margin-left: 2px; }

.edit-btn {
    background-color: #5865f2;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.info-row {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    flex-wrap: wrap; /* responsive wrap */
    gap: 8px;
}
.info-row:hover { background-color: rgba(255,255,255,0.03); }

.label { font-size: 11px; font-weight: 700; color: var(--c-text-muted); width: 100px; }
.val { flex: 1; color: var(--c-text-normal); min-width: 150px; }
.btn-secondary {
    background-color: #2b2d31;
    color: var(--c-text-normal);
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
}
.btn-secondary:hover { background-color: var(--bg-hover); }

/* Close Button */
.close-btn-wrapper {
    width: 60px;
    flex-shrink: 0;
    padding-top: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.esc-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
}
.esc-btn:hover { opacity: 1; }

.esc-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid var(--c-text-muted);
    color: var(--c-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 4px;
}
.esc-text {
    font-size: 12px;
    color: var(--c-text-muted);
    font-weight: 600;
}

/* Mobile Utilities & Responsive */
.mobile-nav { display: flex; align-items: center; margin-bottom: 20px; }
.menu-btn {
    background: none; border: none; color: var(--c-text-header); font-size: 16px; font-weight: 600; cursor: pointer; margin-right: 16px;
}

.placeholder-content { padding: 40px; text-align: center; color: var(--c-text-muted); }

/* Hide elements by default and show with media queries */
.mobile-only { display: none; }
.desktop-only { display: block; }

@media (max-width: 768px) {

    .settings-container { transform-origin: center bottom; }
    
    .sidebar {
        width: 100%;
        padding-top: 20px;
        justify-content: center;
        position: absolute; /* Take full width */
        height: 100%;
        z-index: 1;
    }
    .sidebar.mobile-hidden { display: none; }
    .sidebar-scroll { width: 100%; max-width: 400px; padding: 20px; }

    .content {
        padding: 20px 10px;
        flex-direction: column;
        width: 100%; /* Take full width */
        position: absolute;
        height: 100%;
        z-index: 0;
    }
    .content.mobile-hidden { display: none; }
    
    .content-scroll { padding-right: 0; padding-bottom: 80px; min-width: unset; }
    
    /* Mobile specific elements */
    .mobile-only { display: flex; }
    .desktop-only { display: none; }

    /* Move close button to floating bottom or top right */
    .close-btn-wrapper {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: auto;
        padding-top: 0;
        z-index: 20; /* Ensure on top */
    }
    
    .profile-card {
        overflow: visible; /* Allow avatar to float correctly without clipping if needed */
        margin-top: 20px; /* Space from top */
    }

    .user-details { 
        padding: 50px 16px 16px 16px; /* Top padding clears the avatar */
        margin-top: 0;
        flex-direction: column; 
        align-items: center; 
        text-align: center; 
    }
    
    .avatar-uploader { 
        left: 50%; 
        transform: translateX(-50%); 
        top: -40px; 
        z-index: 5;
    } 
    
    .name-tag { margin-bottom: 12px; margin-top: 4px; }
    .name-tag h3 { font-size: 24px; }
    .name-tag span { font-size: 18px; display: block; }

    .edit-btn {
        width: 100%;
        padding: 10px;
        z-index: 2;
        position: relative;
    }
    
    .info-row { flex-direction: column; align-items: flex-start; }
    .label { margin-bottom: 4px; }
    .btn-secondary { align-self: flex-end; margin-top: 8px; }
}

</style>
