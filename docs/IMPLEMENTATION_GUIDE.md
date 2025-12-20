# Chat-View 구현 가이드

## 🚀 시작하기

이 문서는 Chat-View 프로젝트를 Slack/Teams 스타일의 전문적인 채팅 플랫폼으로 재구성하는 구체적인 구현 가이드입니다.

---

## 📋 사전 준비 체크리스트

### 개발 환경
- [x] Node.js 18+ 설치
- [x] Git 설치
- [x] IDE (VS Code 권장) 설치
- [ ] Git 브랜치 전략 수립

### 프로젝트 초기화
- [x] 기존 프로젝트 구조 파악
- [ ] 새로운 의존성 설치
- [ ] 디자인 시스템 구축
- [ ] 폴더 구조 재조직

---

## 🔧 Phase 1: 프로젝트 설정 및 기반 구축

### Step 1.1: 추가 패키지 설치

```bash
# UI 라이브러리
npm install @headlessui/vue @vueuse/core @vueuse/motion

# 날짜/시간
npm install date-fns

# 아이콘
npm install @heroicons/vue lucide-vue-next

# 이모지
npm install emoji-mart-vue-fast

# 유틸리티
npm install clsx

# 개발 도구
npm install -D @types/node
```

### Step 1.2: Tailwind 설정 확장

**파일**: `tailwind.config.js` (생성)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Workspace Colors
        workspace: {
          bg: '#1a1d21',
          sidebar: '#232529',
          hover: '#2c2d31',
          active: '#1164a3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Apple SD Gothic Neo', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      gridTemplateColumns: {
        'workspace': '260px 1fr',
        'workspace-full': '260px 1fr 320px',
      },
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.15s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Step 1.3: 글로벌 CSS 설정

**파일**: `assets/css/main.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* 폰트 임포트 */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  html {
    @apply antialiased;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  /* 버튼 스타일 */
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
  }
  
  .btn-ghost {
    @apply bg-transparent hover:bg-gray-100 text-gray-700;
  }
  
  /* 입력 필드 */
  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-brand-500 focus:border-transparent 
           outline-none transition;
  }
  
  /* 사이드바 아이템 */
  .sidebar-item {
    @apply flex items-center px-3 py-1.5 rounded-md text-sm 
           text-gray-700 hover:bg-gray-100 cursor-pointer transition;
  }
  
  .sidebar-item.active {
    @apply bg-brand-50 text-brand-700 font-medium;
  }
  
  /* 메시지 컨테이너 */
  .message-container {
    @apply px-4 py-2 hover:bg-gray-50 transition;
  }
  
  /* 스크롤바 스타일 */
  .scrollbar-custom {
    scrollbar-width: thin;
    scrollbar-color: rgb(203 213 225) transparent;
  }
  
  .scrollbar-custom::-webkit-scrollbar {
    width: 8px;
  }
  
  .scrollbar-custom::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-custom::-webkit-scrollbar-thumb {
    background-color: rgb(203 213 225);
    border-radius: 4px;
  }
  
  .scrollbar-custom::-webkit-scrollbar-thumb:hover {
    background-color: rgb(148 163 184);
  }
}

@layer utilities {
  /* 텍스트 줄임 */
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

### Step 1.4: TypeScript 타입 정의 확장

**파일**: `types/ui.ts` (새로 생성)

```typescript
// UI 관련 타입 정의

export type Theme = 'light' | 'dark'

export type SidebarContent = 'channels' | 'dms' | 'starred' | 'apps'

export type RightPanelContent = 'thread' | 'members' | 'details' | 'files' | 'pinned' | null

export type ModalType = 
  | 'createChannel' 
  | 'editChannel' 
  | 'inviteMember' 
  | 'userProfile' 
  | 'settings'
  | null

export interface UIState {
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  rightPanelContent: RightPanelContent
  activeModal: ModalType
  theme: Theme
  isMobile: boolean
}

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}
```

**파일**: `types/workspace.ts` (새로 생성)

```typescript
// 워크스페이스 관련 타입

export interface Workspace {
  id: string
  name: string
  slug: string
  icon?: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkspaceMember {
  userId: string
  workspaceId: string
  role: 'owner' | 'admin' | 'member' | 'guest'
  joinedAt: Date
}
```

---

## 🏗 Phase 2: 폴더 구조 재조직

### 새로운 폴더 구조

```
chat-view/
├── assets/
│   ├── css/
│   │   └── main.css
│   └── images/
├── components/
│   ├── common/           # 공통 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── sidebar/          # 사이드바 컴포넌트
│   ├── channel/          # 채널 관련 컴포넌트
│   ├── chat/             # 채팅 관련 컴포넌트
│   ├── rightPanel/       # 우측 패널 컴포넌트
│   └── modals/           # 모달 컴포넌트
├── composables/          # Vue 컴포저블
│   ├── useWebSocket.ts
│   ├── useChannel.ts
│   ├── useMessage.ts
│   └── useKeyboardShortcuts.ts
├── layouts/
│   ├── default.vue
│   ├── workspace.vue
│   └── auth.vue
├── middleware/
│   └── auth.ts
├── pages/
│   ├── index.vue
│   ├── workspace/
│   └── user/
├── stores/               # Pinia stores
│   ├── auth.ts
│   ├── workspace.ts
│   ├── channel.ts
│   ├── message.ts
│   ├── websocket.ts
│   ├── ui.ts
│   └── notification.ts
├── types/                # TypeScript 타입
│   ├── api.ts
│   ├── channel.ts
│   ├── message.ts
│   ├── ui.ts
│   └── workspace.ts
├── utils/                # 유틸리티 함수
│   ├── format.ts
│   ├── validation.ts
│   └── constants.ts
└── plugins/              # Nuxt 플러그인
```

---

## 🎨 Phase 3: 디자인 시스템 컴포넌트 구현

### 우선순위 1: 기본 컴포넌트

#### 3.1 Button 컴포넌트

**파일**: `components/common/BaseButton.vue`

```vue
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <Spinner v-if="loading" class="w-4 h-4 mr-2" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  
  const width = props.fullWidth ? 'w-full' : ''
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${width}`
})
</script>
```

#### 3.2 Avatar 컴포넌트

**파일**: `components/common/UserAvatar.vue`

```vue
<template>
  <div :class="avatarClasses" :title="name">
    <img 
      v-if="src" 
      :src="src" 
      :alt="name"
      class="w-full h-full object-cover"
    />
    <span v-else class="font-semibold text-white">
      {{ initials }}
    </span>
    
    <!-- 온라인 상태 표시 -->
    <span
      v-if="showStatus && status"
      :class="statusClasses"
      class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  showStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showStatus: false,
})

const initials = computed(() => {
  return props.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const avatarClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  }
  
  return `
    relative inline-flex items-center justify-center 
    rounded-full bg-gradient-to-br from-brand-500 to-brand-600 
    overflow-hidden ${sizes[props.size]}
  `
})

const statusClasses = computed(() => {
  const statuses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  }
  
  return props.status ? statuses[props.status] : ''
})
</script>
```

#### 3.3 Modal 컴포넌트

**파일**: `components/common/BaseModal.vue`

```vue
<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <!-- 배경 오버레이 -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel :class="panelClasses">
              <!-- 헤더 -->
              <div v-if="title" class="flex items-center justify-between mb-4">
                <DialogTitle class="text-lg font-semibold text-gray-900">
                  {{ title }}
                </DialogTitle>
                <button
                  @click="handleClose"
                  class="text-gray-400 hover:text-gray-500 transition"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>

              <!-- 콘텐츠 -->
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeable: true,
})

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  if (props.closeable) {
    emit('close')
  }
}

const panelClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  }
  
  return `
    w-full ${sizes[props.size]} 
    transform overflow-hidden rounded-2xl 
    bg-white p-6 text-left align-middle shadow-xl 
    transition-all
  `
})
</script>
```

---

## 🖥 Phase 4: 메인 레이아웃 구현

### 4.1 Workspace 레이아웃

**파일**: `layouts/workspace.vue`

```vue
<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 상단 헤더 -->
    <AppHeader />
    
    <!-- 메인 컨텐츠 영역 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 왼쪽 사이드바 -->
      <Transition name="slide">
        <LeftSidebar v-if="uiStore.leftSidebarOpen" />
      </Transition>
      
      <!-- 중앙 컨텐츠 -->
      <main class="flex-1 flex flex-col min-w-0">
        <slot />
      </main>
      
      <!-- 오른쪽 사이드바 -->
      <Transition name="slide">
        <RightSidebar v-if="uiStore.rightSidebarOpen" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'

const uiStore = useUIStore()
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease-out;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
```

---

## 📝 다음 단계 체크리스트

### 즉시 시작 가능한 작업

- [ ] **Step 1**: 추가 패키지 설치 실행
- [ ] **Step 2**: Tailwind 설정 파일 생성 및 구성
- [ ] **Step 3**: 글로벌 CSS 업데이트
- [ ] **Step 4**: 타입 정의 파일 생성
- [ ] **Step 5**: 기본 컴포넌트 3개 구현 (Button, Avatar, Modal)
- [ ] **Step 6**: Workspace 레이아웃 구현
- [ ] **Step 7**: UI Store 생성

### 검증 포인트

각 단계 완료 후:
1. ✅ 타입스크립트 에러 없음
2. ✅ 빌드 성공
3. ✅ 브라우저에서 렌더링 확인
4. ✅ 반응형 동작 확인

---

## 🎯 성공 기준

**Phase 1 완료 기준**:
- [ ] 모든 의존성 설치 완료
- [ ] Tailwind 설정 적용 및 테스트
- [ ] 3개 이상의 기본 컴포넌트 동작
- [ ] Workspace 레이아웃 기본 구조 렌더링

**예상 소요 시간**: 2-3일

---

## 💡 개발 팁

### 컴포넌트 개발 시
- Storybook 또는 별도 데모 페이지에서 먼저 테스트
- Props와 Emits를 명확히 정의
- TypeScript 타입을 최대한 활용
- 접근성(a11y) 고려

### 스타일링 시
- Tailwind 유틸리티 클래스 우선 사용
- 반복되는 패턴은 `@apply`로 추출
- 다크 모드를 염두에 두고 색상 선택

### 성능 고려
- 큰 리스트는 가상 스크롤 고려
- 이미지는 레이지 로딩
- 컴포넌트는 필요시 동적 import

---

**다음 문서**: `PHASE2_IMPLEMENTATION.md` (컴포넌트 상세 구현 가이드)
