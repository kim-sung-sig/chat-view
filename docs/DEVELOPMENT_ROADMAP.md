# Chat-View 재구성 개발 프로세스 로드맵
> Slack/Teams 스타일 채팅 플랫폼 단계별 개발 가이드
>
> 작성일: 2025-12-20

---

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [개발 원칙](#개발-원칙)
3. [Phase 1: 기반 구축](#phase-1-기반-구축)
4. [Phase 2: 핵심 기능](#phase-2-핵심-기능)
5. [Phase 3: 고급 기능](#phase-3-고급-기능)
6. [Phase 4: 최적화 및 배포](#phase-4-최적화-및-배포)

---

## 1. 프로젝트 개요

### 목표
Slack/Teams 수준의 현대적인 협업 채팅 플랫폼 웹 클라이언트 구현

### 개발 기간
- **Phase 1**: 2주 (기반 구축)
- **Phase 2**: 3주 (핵심 기능)
- **Phase 3**: 2주 (고급 기능)
- **Phase 4**: 1주 (최적화 및 배포)
- **총 기간**: 8주

### 핵심 기술 스택
- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **UI**: Tailwind CSS
- **State**: Pinia
- **Real-time**: WebSocket

---

## 2. 개발 원칙

### 2.1 UI/UX 우선
- **사용자 경험 최우선**: 기능보다 사용성 우선
- **즉각적 피드백**: Optimistic UI 적용
- **키보드 친화적**: 모든 기능 키보드로 접근 가능

### 2.2 점진적 개발
- **MVP → 고급 기능**: 작동하는 최소 기능 우선
- **컴포넌트 재사용**: DRY 원칙 철저히 준수
- **테스트 주도**: 주요 기능은 테스트 작성

### 2.3 성능 최적화
- **초기 로딩 최소화**: Code Splitting, Lazy Loading
- **런타임 최적화**: Virtual Scrolling, Debounce
- **번들 크기 관리**: 불필요한 라이브러리 배제

---

## Phase 1: 기반 구축 (2주)

### Week 1: 디자인 시스템 & 공통 컴포넌트

#### Day 1-2: 디자인 시스템 완성

**작업 항목**
1. [x] Tailwind Config 색상 팔레트 완성
2. [ ] 디자인 토큰 정리 (`assets/css/tokens.css`)
3. [ ] 타이포그래피 시스템 정의
4. [ ] 스페이싱 시스템 정의
5. [ ] 다크모드 색상 팔레트 완성

**파일 구조**
```
assets/css/
├── main.css              # 메인 CSS (Tailwind import)
├── tokens.css            # 디자인 토큰 (색상, 타이포, 스페이싱)
├── components.css        # 컴포넌트 스타일
└── utilities.css         # 커스텀 유틸리티
```

**체크리스트**
- [ ] 색상 팔레트 문서화 (README)
- [ ] Storybook 또는 스타일 가이드 페이지 생성
- [ ] 다크모드 토글 구현

---

#### Day 3-4: 공통 컴포넌트 라이브러리

**구현할 컴포넌트**

##### 1. Button Component
```vue
<!-- components/common/Button.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string
}
</script>
```

**변형**
- Primary: 메인 액션 (메시지 전송 등)
- Secondary: 보조 액션 (취소 등)
- Ghost: 아이콘 버튼
- Danger: 삭제 등 위험 작업

##### 2. Input Component
```vue
<!-- components/common/Input.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'search'
  placeholder?: string
  error?: string
  disabled?: boolean
  icon?: string
}
</script>
```

##### 3. Modal Component
```vue
<!-- components/common/Modal.vue -->
<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

const emit = defineEmits<{
  'close': []
}>()
</script>
```

##### 4. Dropdown Component
```vue
<!-- components/common/Dropdown.vue -->
<script setup lang="ts">
interface DropdownItem {
  label: string
  value: string
  icon?: string
  disabled?: boolean
}

interface Props {
  items: DropdownItem[]
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}
</script>
```

##### 5. 기타 공통 컴포넌트
- [ ] `Tooltip.vue`: 툴팁
- [ ] `Loading.vue`: 로딩 스피너
- [ ] `Avatar.vue`: 사용자 아바타
- [ ] `Badge.vue`: 알림 뱃지
- [ ] `Icon.vue`: 아이콘 래퍼
- [ ] `EmptyState.vue`: 빈 상태

**체크리스트**
- [ ] 모든 컴포넌트 TypeScript Props 정의
- [ ] Accessibility 속성 (ARIA) 추가
- [ ] 다크모드 지원
- [ ] 스토리북 또는 데모 페이지 생성

---

#### Day 5: 레이아웃 템플릿 구현

**구현할 레이아웃**

##### 1. Default Layout (로그인 후)
```vue
<!-- layouts/default.vue -->
<template>
  <div class="workspace-layout">
    <!-- Header -->
    <AppHeader />
    
    <!-- Workspace Sidebar -->
    <WorkspaceSidebar />
    
    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
    
    <!-- Right Panel (optional) -->
    <RightPanel v-if="uiStore.showRightPanel" />
  </div>
</template>
```

##### 2. Auth Layout
```vue
<!-- layouts/auth.vue -->
<template>
  <div class="auth-layout">
    <div class="auth-container">
      <slot />
    </div>
  </div>
</template>
```

**레이아웃 그리드**
```css
.workspace-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

/* 3-column (우측 패널 포함) */
.workspace-layout.with-right-panel {
  grid-template-columns: 260px 1fr 320px;
}
```

**체크리스트**
- [ ] 반응형 레이아웃 (모바일 대응)
- [ ] 레이아웃 전환 애니메이션
- [ ] Sidebar 접기/펴기 기능

---

### Week 2: 라우팅 & 인증

#### Day 6-7: 라우팅 구조 설정

**페이지 구조**
```
pages/
├── index.vue                    # 랜딩 페이지
├── auth/
│   ├── login.vue                # 로그인
│   └── register.vue             # 회원가입
├── workspace/
│   └── [workspaceId]/
│       ├── index.vue            # 워크스페이스 홈
│       └── channel/
│           └── [channelId].vue  # 채널 상세
└── settings/
    ├── profile.vue              # 프로필 설정
    └── preferences.vue          # 환경 설정
```

**미들웨어 구현**
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }
})
```

**체크리스트**
- [ ] 인증 미들웨어 적용
- [ ] 권한 기반 라우팅
- [ ] 404 페이지
- [ ] 로딩 인디케이터

---

#### Day 8-9: 인증 시스템

**Auth Store 구현**
```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || 'Guest',
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const { user, token } = await authService.login(email, password)
        this.user = user
        this.token = token
        
        // 토큰 저장
        localStorage.setItem('auth_token', token)
        
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      navigateTo('/auth/login')
    },

    async fetchUser() {
      if (!this.token) return
      
      try {
        this.user = await authService.getProfile()
      } catch (error) {
        this.logout()
      }
    },
  },
})
```

**API Client 설정**
```typescript
// services/apiClient.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
})

// Request Interceptor (토큰 추가)
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Response Interceptor (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

**로그인 페이지 구현**
```vue
<!-- pages/auth/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const error = ref('')

const handleLogin = async () => {
  error.value = ''
  
  const success = await authStore.login(form.email, form.password)
  
  if (success) {
    router.push('/workspace')
  } else {
    error.value = 'Invalid email or password'
  }
}
</script>

<template>
  <div class="login-page">
    <h1>Sign in to Workspace</h1>
    
    <form @submit.prevent="handleLogin">
      <Input
        v-model="form.email"
        type="email"
        placeholder="you@example.com"
        :error="error"
      />
      
      <Input
        v-model="form.password"
        type="password"
        placeholder="Password"
      />
      
      <Button
        type="submit"
        variant="primary"
        :loading="authStore.loading"
      >
        Sign In
      </Button>
    </form>
  </div>
</template>
```

**체크리스트**
- [ ] 로그인/로그아웃 기능
- [ ] 토큰 저장 및 자동 로그인
- [ ] 에러 핸들링
- [ ] 폼 검증

---

#### Day 10: 에러 핸들링 & 로딩 상태

**글로벌 에러 핸들러**
```vue
<!-- app.vue -->
<script setup>
const handleError = (error: Error) => {
  console.error('Global error:', error)
  // Toast notification
}

onErrorCaptured((error) => {
  handleError(error)
  return false
})
</script>
```

**로딩 상태 관리**
```typescript
// stores/ui.ts
export const useUiStore = defineStore('ui', {
  state: () => ({
    loading: false,
    loadingMessage: '',
    showRightPanel: false,
    showSidebar: true,
  }),

  actions: {
    startLoading(message = 'Loading...') {
      this.loading = true
      this.loadingMessage = message
    },

    stopLoading() {
      this.loading = false
      this.loadingMessage = ''
    },
  },
})
```

**체크리스트**
- [ ] 글로벌 로딩 인디케이터
- [ ] Toast/Notification 시스템
- [ ] 에러 바운더리
- [ ] 네트워크 에러 처리

---

## Phase 2: 핵심 기능 구현 (3주)

### Week 3: 워크스페이스 & 채널

#### Day 11-12: 워크스페이스 구조

**Workspace Store**
```typescript
// stores/workspace.ts
export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    workspaces: [] as Workspace[],
    currentWorkspaceId: null as string | null,
  }),

  getters: {
    currentWorkspace: (state) => 
      state.workspaces.find(w => w.id === state.currentWorkspaceId),
  },

  actions: {
    async fetchWorkspaces() {
      this.workspaces = await workspaceService.getWorkspaces()
    },

    setCurrentWorkspace(id: string) {
      this.currentWorkspaceId = id
    },
  },
})
```

**워크스페이스 사이드바**
```vue
<!-- components/layout/WorkspaceSidebar.vue -->
<script setup lang="ts">
const workspaceStore = useWorkspaceStore()
const channelStore = useChannelStore()

const channels = computed(() => channelStore.channels)
</script>

<template>
  <aside class="workspace-sidebar">
    <!-- Workspace Header -->
    <div class="workspace-header">
      <WorkspaceSwitcher />
    </div>

    <!-- Channel List -->
    <nav class="channel-navigation">
      <ChannelList :channels="channels" />
    </nav>

    <!-- User Profile -->
    <div class="user-profile">
      <UserProfile />
    </div>
  </aside>
</template>
```

**체크리스트**
- [ ] 워크스페이스 목록 조회
- [ ] 워크스페이스 전환
- [ ] 워크스페이스 정보 표시

---

#### Day 13-14: 채널 관리

**Channel Store**
```typescript
// stores/channel.ts
export const useChannelStore = defineStore('channel', {
  state: () => ({
    channels: [] as Channel[],
    currentChannelId: null as string | null,
    loading: false,
  }),

  getters: {
    currentChannel: (state) => 
      state.channels.find(c => c.id === state.currentChannelId),
    
    publicChannels: (state) => 
      state.channels.filter(c => c.type === 'public'),
    
    privateChannels: (state) => 
      state.channels.filter(c => c.type === 'private'),
    
    directMessages: (state) => 
      state.channels.filter(c => c.type === 'dm'),
  },

  actions: {
    async fetchChannels(workspaceId: string) {
      this.loading = true
      try {
        this.channels = await channelService.getChannels(workspaceId)
      } finally {
        this.loading = false
      }
    },

    async createChannel(data: CreateChannelInput) {
      const channel = await channelService.createChannel(data)
      this.channels.push(channel)
      return channel
    },

    async joinChannel(channelId: string) {
      await channelService.joinChannel(channelId)
      // Update channel membership
    },

    setCurrentChannel(channelId: string) {
      this.currentChannelId = channelId
    },
  },
})
```

**채널 리스트 컴포넌트**
```vue
<!-- components/channel/ChannelList.vue -->
<script setup lang="ts">
interface Props {
  channels: Channel[]
}

const props = defineProps<Props>()
const channelStore = useChannelStore()

const publicChannels = computed(() => 
  props.channels.filter(c => c.type === 'public')
)

const privateChannels = computed(() => 
  props.channels.filter(c => c.type === 'private')
)

const directMessages = computed(() => 
  props.channels.filter(c => c.type === 'dm')
)
</script>

<template>
  <div class="channel-list">
    <!-- Public Channels -->
    <section v-if="publicChannels.length">
      <h3 class="channel-section-title">
        Channels
      </h3>
      <ChannelItem
        v-for="channel in publicChannels"
        :key="channel.id"
        :channel="channel"
      />
    </section>

    <!-- Private Channels -->
    <section v-if="privateChannels.length">
      <h3 class="channel-section-title">
        Private Channels
      </h3>
      <ChannelItem
        v-for="channel in privateChannels"
        :key="channel.id"
        :channel="channel"
      />
    </section>

    <!-- Direct Messages -->
    <section v-if="directMessages.length">
      <h3 class="channel-section-title">
        Direct Messages
      </h3>
      <ChannelItem
        v-for="channel in directMessages"
        :key="channel.id"
        :channel="channel"
      />
    </section>
  </div>
</template>
```

**채널 아이템**
```vue
<!-- components/channel/ChannelItem.vue -->
<script setup lang="ts">
interface Props {
  channel: Channel
}

const props = defineProps<Props>()
const channelStore = useChannelStore()
const router = useRouter()

const isActive = computed(() => 
  channelStore.currentChannelId === props.channel.id
)

const handleClick = () => {
  channelStore.setCurrentChannel(props.channel.id)
  router.push(`/workspace/${props.channel.workspaceId}/channel/${props.channel.id}`)
}
</script>

<template>
  <button
    class="channel-item"
    :class="{ active: isActive }"
    @click="handleClick"
  >
    <span class="channel-icon">
      <Icon :name="channel.type === 'dm' ? 'user' : 'hash'" />
    </span>
    <span class="channel-name">
      {{ channel.name }}
    </span>
    <Badge
      v-if="channel.unreadCount"
      :count="channel.unreadCount"
    />
  </button>
</template>
```

**채널 생성 모달**
```vue
<!-- components/channel/CreateChannelModal.vue -->
<script setup lang="ts">
const show = defineModel<boolean>('show')

const form = reactive({
  name: '',
  description: '',
  type: 'public' as 'public' | 'private',
})

const channelStore = useChannelStore()

const handleCreate = async () => {
  await channelStore.createChannel(form)
  show.value = false
}
</script>

<template>
  <Modal
    v-model:show="show"
    title="Create Channel"
  >
    <form @submit.prevent="handleCreate">
      <Input
        v-model="form.name"
        placeholder="channel-name"
        label="Name"
      />
      
      <Input
        v-model="form.description"
        placeholder="What's this channel about?"
        label="Description"
      />
      
      <div class="form-group">
        <label>
          <input
            v-model="form.type"
            type="radio"
            value="public"
          />
          Public
        </label>
        <label>
          <input
            v-model="form.type"
            type="radio"
            value="private"
          />
          Private
        </label>
      </div>
      
      <Button type="submit" variant="primary">
        Create Channel
      </Button>
    </form>
  </Modal>
</template>
```

**체크리스트**
- [ ] 채널 목록 조회 (Public/Private/DM 분류)
- [ ] 채널 생성 모달
- [ ] 채널 참여/나가기
- [ ] 채널 검색
- [ ] 읽지 않은 메시지 카운트 표시

---

### Week 4: 메시징 기본 기능

#### Day 15-16: 메시지 리스트 UI

**Message Store**
```typescript
// stores/message.ts
export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [] as Message[],
    loading: false,
    hasMore: true,
  }),

  getters: {
    messagesByChannel: (state) => (channelId: string) =>
      state.messages.filter(m => m.channelId === channelId),
  },

  actions: {
    async fetchMessages(channelId: string, before?: string) {
      this.loading = true
      try {
        const data = await messageService.getMessages(channelId, before)
        
        if (before) {
          // 이전 메시지 추가 (페이지네이션)
          this.messages.unshift(...data.messages)
        } else {
          // 초기 로드
          this.messages = data.messages
        }
        
        this.hasMore = data.hasMore
      } finally {
        this.loading = false
      }
    },

    addMessage(message: Message) {
      // Optimistic update
      this.messages.push(message)
    },

    async sendMessage(channelId: string, content: string) {
      const tempId = `temp-${Date.now()}`
      
      // Optimistic UI
      const tempMessage: Message = {
        id: tempId,
        channelId,
        content,
        userId: useAuthStore().user!.id,
        createdAt: new Date().toISOString(),
        pending: true,
      }
      
      this.addMessage(tempMessage)
      
      try {
        const message = await messageService.sendMessage(channelId, content)
        
        // Replace temp message
        const index = this.messages.findIndex(m => m.id === tempId)
        if (index !== -1) {
          this.messages[index] = message
        }
      } catch (error) {
        // Mark as failed
        const index = this.messages.findIndex(m => m.id === tempId)
        if (index !== -1) {
          this.messages[index].failed = true
        }
      }
    },
  },
})
```

**메시지 리스트 컴포넌트**
```vue
<!-- components/chat/MessageList.vue -->
<script setup lang="ts">
const channelStore = useChannelStore()
const messageStore = useMessageStore()

const channelId = computed(() => channelStore.currentChannelId!)

const messages = computed(() => 
  messageStore.messagesByChannel(channelId.value)
)

const listRef = ref<HTMLElement>()
const { arrivedState } = useScroll(listRef)

// 스크롤 최하단 도달 시 자동 스크롤
const scrollToBottom = () => {
  if (!listRef.value) return
  listRef.value.scrollTop = listRef.value.scrollHeight
}

// 새 메시지 추가 시 스크롤
watch(() => messages.value.length, () => {
  if (arrivedState.bottom) {
    nextTick(scrollToBottom)
  }
})

// 초기 메시지 로드
onMounted(async () => {
  await messageStore.fetchMessages(channelId.value)
  scrollToBottom()
})

// Infinite scroll (위로 스크롤 시 이전 메시지 로드)
const handleScroll = async () => {
  if (!arrivedState.top || messageStore.loading || !messageStore.hasMore) {
    return
  }
  
  const firstMessage = messages.value[0]
  if (firstMessage) {
    await messageStore.fetchMessages(channelId.value, firstMessage.id)
  }
}
</script>

<template>
  <div
    ref="listRef"
    class="message-list"
    @scroll="handleScroll"
  >
    <!-- Loading indicator (top) -->
    <div v-if="messageStore.loading" class="loading-indicator">
      <Loading />
    </div>

    <!-- Messages -->
    <MessageItem
      v-for="message in messages"
      :key="message.id"
      :message="message"
    />

    <!-- Empty state -->
    <EmptyState
      v-if="!messages.length && !messageStore.loading"
      title="No messages yet"
      description="Be the first to send a message!"
    />
  </div>
</template>

<style scoped>
.message-list {
  @apply flex-1 overflow-y-auto px-4 py-4 space-y-2;
  scroll-behavior: smooth;
}
</style>
```

**메시지 아이템**
```vue
<!-- components/chat/MessageItem.vue -->
<script setup lang="ts">
interface Props {
  message: Message
}

const props = defineProps<Props>()

const formattedTime = computed(() => {
  const date = new Date(props.message.createdAt)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <div class="message-item" :class="{ pending: message.pending, failed: message.failed }">
    <!-- Avatar -->
    <Avatar
      :src="message.user.avatar"
      :name="message.user.name"
      size="md"
    />

    <!-- Content -->
    <div class="message-content">
      <!-- Header -->
      <div class="message-header">
        <span class="message-author">
          {{ message.user.name }}
        </span>
        <span class="message-time">
          {{ formattedTime }}
        </span>
      </div>

      <!-- Body -->
      <div class="message-body">
        {{ message.content }}
      </div>

      <!-- Actions (hover) -->
      <MessageActions
        v-if="!message.pending"
        :message="message"
      />
    </div>
  </div>
</template>
```

**체크리스트**
- [ ] 메시지 리스트 렌더링
- [ ] 무한 스크롤 (페이지네이션)
- [ ] 자동 스크롤 (새 메시지)
- [ ] Optimistic UI
- [ ] 전송 실패 처리

---

#### Day 17-18: 메시지 입력창

**메시지 입력 컴포넌트**
```vue
<!-- components/chat/MessageInput.vue -->
<script setup lang="ts">
const channelStore = useChannelStore()
const messageStore = useMessageStore()

const content = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

// Auto-resize textarea
watch(content, () => {
  if (!textareaRef.value) return
  
  textareaRef.value.style.height = 'auto'
  textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
})

const handleSend = async () => {
  if (!content.value.trim()) return
  
  const channelId = channelStore.currentChannelId!
  
  await messageStore.sendMessage(channelId, content.value)
  
  content.value = ''
}

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Enter: Send
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
  
  // Shift + Enter: New line (기본 동작)
}

// Typing indicator (웹소켓으로 전송)
watchDebounced(content, (newValue) => {
  if (newValue.trim()) {
    // Send typing event
    const websocketStore = useWebsocketStore()
    websocketStore.sendTyping(channelStore.currentChannelId!)
  }
}, { debounce: 500 })
</script>

<template>
  <div class="message-input">
    <div class="input-wrapper">
      <!-- Textarea -->
      <textarea
        ref="textareaRef"
        v-model="content"
        placeholder="Type a message..."
        rows="1"
        class="message-textarea"
        @keydown="handleKeydown"
      />

      <!-- Toolbar -->
      <div class="input-toolbar">
        <button class="toolbar-btn" title="Attach file">
          <Icon name="paperclip" />
        </button>
        <button class="toolbar-btn" title="Emoji">
          <Icon name="smile" />
        </button>
        <button class="toolbar-btn" title="Formatting">
          <Icon name="bold" />
        </button>
      </div>
    </div>

    <!-- Send Button -->
    <Button
      variant="primary"
      size="sm"
      :disabled="!content.trim()"
      @click="handleSend"
    >
      <Icon name="send" />
    </Button>
  </div>
</template>

<style scoped>
.message-input {
  @apply flex items-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700;
}

.input-wrapper {
  @apply flex-1 border border-gray-300 dark:border-gray-600 rounded-lg
         bg-white dark:bg-gray-800 overflow-hidden;
}

.message-textarea {
  @apply w-full px-4 py-3 resize-none outline-none
         bg-transparent text-gray-900 dark:text-gray-100;
  max-height: 200px;
}

.input-toolbar {
  @apply flex items-center gap-1 px-2 pb-2;
}

.toolbar-btn {
  @apply p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700
         text-gray-600 dark:text-gray-400;
}
</style>
```

**체크리스트**
- [ ] 메시지 입력 (textarea)
- [ ] Enter 전송, Shift+Enter 줄바꿈
- [ ] Auto-resize textarea
- [ ] 툴바 (첨부파일, 이모지, 포맷팅)
- [ ] 타이핑 인디케이터 (WebSocket)

---

#### Day 19: 메시지 페이지 연동

**채널 페이지**
```vue
<!-- pages/workspace/[workspaceId]/channel/[channelId].vue -->
<script setup lang="ts">
const route = useRoute()
const channelStore = useChannelStore()
const messageStore = useMessageStore()

const channelId = computed(() => route.params.channelId as string)

// Set current channel
watch(channelId, (id) => {
  if (id) {
    channelStore.setCurrentChannel(id)
  }
}, { immediate: true })

// Fetch channel and messages
onMounted(async () => {
  // TODO: Fetch channel details if needed
})
</script>

<template>
  <div class="channel-page">
    <!-- Channel Header -->
    <ChannelHeader :channel="channelStore.currentChannel" />

    <!-- Message List -->
    <MessageList />

    <!-- Message Input -->
    <MessageInput />
  </div>
</template>

<style scoped>
.channel-page {
  @apply flex flex-col h-full;
}
</style>
```

**체크리스트**
- [ ] 채널 페이지 라우팅
- [ ] 채널 헤더 (제목, 설명, 멤버 수)
- [ ] 메시지 리스트 통합
- [ ] 메시지 입력창 통합

---

### Week 5: WebSocket 통합

#### Day 20-21: WebSocket Manager 구현

**WebSocket Store**
```typescript
// stores/websocket.ts
export const useWebsocketStore = defineStore('websocket', {
  state: () => ({
    socket: null as WebSocket | null,
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
  }),

  actions: {
    connect() {
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        console.error('No auth token available')
        return
      }

      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'
      
      this.socket = new WebSocket(`${wsUrl}?token=${token}`)

      this.socket.onopen = () => {
        console.log('WebSocket connected')
        this.connected = true
        this.reconnecting = false
        this.reconnectAttempts = 0
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      this.socket.onclose = () => {
        console.log('WebSocket disconnected')
        this.connected = false
        this.reconnect()
      }
    },

    handleMessage(data: any) {
      const messageStore = useMessageStore()
      const channelStore = useChannelStore()

      switch (data.type) {
        case 'message':
          messageStore.addMessage(data.payload)
          break
        case 'typing':
          // Handle typing indicator
          break
        case 'read_receipt':
          // Handle read receipt
          break
        default:
          console.warn('Unknown message type:', data.type)
      }
    },

    send(type: string, payload: any) {
      if (!this.socket || !this.connected) {
        console.warn('WebSocket not connected')
        return
      }

      this.socket.send(JSON.stringify({ type, payload }))
    },

    sendTyping(channelId: string) {
      this.send('typing', { channelId })
    },

    reconnect() {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnect attempts reached')
        return
      }

      this.reconnecting = true
      this.reconnectAttempts++

      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      
      setTimeout(() => {
        console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`)
        this.connect()
      }, delay)
    },

    disconnect() {
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
      this.connected = false
    },
  },
})
```

**WebSocket 초기화**
```typescript
// app.vue
const authStore = useAuthStore()
const websocketStore = useWebsocketStore()

// Connect WebSocket after login
watch(() => authStore.isAuthenticated, (authenticated) => {
  if (authenticated) {
    websocketStore.connect()
  } else {
    websocketStore.disconnect()
  }
}, { immediate: true })
```

**체크리스트**
- [ ] WebSocket 연결/해제
- [ ] 자동 재연결 (Exponential Backoff)
- [ ] 메시지 핸들러
- [ ] 에러 처리

---

#### Day 22-23: 실시간 기능

**타이핑 인디케이터**
```vue
<!-- components/chat/TypingIndicator.vue -->
<script setup lang="ts">
const channelStore = useChannelStore()

const typingUsers = ref<string[]>([])

const websocketStore = useWebsocketStore()

// Listen to typing events
// (웹소켓 메시지 핸들러에서 업데이트)

const typingText = computed(() => {
  if (!typingUsers.value.length) return ''
  
  if (typingUsers.value.length === 1) {
    return `${typingUsers.value[0]} is typing...`
  }
  
  return `${typingUsers.value.length} people are typing...`
})
</script>

<template>
  <div v-if="typingUsers.length" class="typing-indicator">
    <span class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </span>
    <span class="typing-text">{{ typingText }}</span>
  </div>
</template>
```

**읽음 상태 (Read Receipt)**
```typescript
// stores/message.ts (추가)
actions: {
  markAsRead(channelId: string, messageId: string) {
    const websocketStore = useWebsocketStore()
    websocketStore.send('read_receipt', {
      channelId,
      messageId,
    })
  },
}
```

**체크리스트**
- [ ] 실시간 메시지 수신
- [ ] 타이핑 인디케이터
- [ ] 읽음 상태 동기화
- [ ] 온라인 상태 표시

---

#### Day 24: API 연동 완료

**Service 구현**
```typescript
// services/messageService.ts
import apiClient from './apiClient'

export const messageService = {
  async getMessages(channelId: string, before?: string) {
    const params = before ? { before } : {}
    const { data } = await apiClient.get(`/channels/${channelId}/messages`, { params })
    return data
  },

  async sendMessage(channelId: string, content: string) {
    const { data } = await apiClient.post(`/channels/${channelId}/messages`, {
      content,
    })
    return data
  },

  async updateMessage(messageId: string, content: string) {
    const { data } = await apiClient.put(`/messages/${messageId}`, {
      content,
    })
    return data
  },

  async deleteMessage(messageId: string) {
    await apiClient.delete(`/messages/${messageId}`)
  },

  async addReaction(messageId: string, emoji: string) {
    const { data } = await apiClient.post(`/messages/${messageId}/reactions`, {
      emoji,
    })
    return data
  },
}
```

**체크리스트**
- [ ] 메시지 조회 API
- [ ] 메시지 전송 API
- [ ] 메시지 수정/삭제 API
- [ ] 리액션 API
- [ ] 에러 핸들링

---

## Phase 3: 고급 기능 (2주)

### Week 6: 메시지 고급 기능

#### Day 25-26: 메시지 수정/삭제

**메시지 액션 컴포넌트**
```vue
<!-- components/message/MessageActions.vue -->
<script setup lang="ts">
interface Props {
  message: Message
}

const props = defineProps<Props>()
const messageStore = useMessageStore()
const authStore = useAuthStore()

const canEdit = computed(() => 
  props.message.userId === authStore.user?.id
)

const handleEdit = () => {
  // TODO: Show edit modal
}

const handleDelete = async () => {
  if (confirm('Delete this message?')) {
    await messageStore.deleteMessage(props.message.id)
  }
}

const handleReaction = async (emoji: string) => {
  await messageStore.addReaction(props.message.id, emoji)
}
</script>

<template>
  <div class="message-actions">
    <button class="action-btn" @click="handleReaction('👍')">
      <Icon name="thumbs-up" />
    </button>
    <button v-if="canEdit" class="action-btn" @click="handleEdit">
      <Icon name="edit" />
    </button>
    <button v-if="canEdit" class="action-btn" @click="handleDelete">
      <Icon name="trash" />
    </button>
  </div>
</template>
```

**체크리스트**
- [ ] 메시지 수정 UI
- [ ] 메시지 삭제 확인
- [ ] 권한 검증 (본인만 수정/삭제)

---

#### Day 27-28: Emoji 리액션

**리액션 컴포넌트**
```vue
<!-- components/message/MessageReactions.vue -->
<script setup lang="ts">
interface Props {
  reactions: Reaction[]
  messageId: string
}

const props = defineProps<Props>()
const messageStore = useMessageStore()
const authStore = useAuthStore()

const groupedReactions = computed(() => {
  const groups: Record<string, Reaction[]> = {}
  
  props.reactions.forEach(reaction => {
    if (!groups[reaction.emoji]) {
      groups[reaction.emoji] = []
    }
    groups[reaction.emoji].push(reaction)
  })
  
  return groups
})

const handleReactionClick = async (emoji: string) => {
  const myReaction = groupedReactions.value[emoji]?.find(
    r => r.userId === authStore.user?.id
  )
  
  if (myReaction) {
    // Remove reaction
    await messageStore.removeReaction(props.messageId, emoji)
  } else {
    // Add reaction
    await messageStore.addReaction(props.messageId, emoji)
  }
}
</script>

<template>
  <div v-if="Object.keys(groupedReactions).length" class="reactions">
    <button
      v-for="(reactions, emoji) in groupedReactions"
      :key="emoji"
      class="reaction-btn"
      :class="{
        active: reactions.some(r => r.userId === authStore.user?.id)
      }"
      @click="handleReactionClick(emoji)"
    >
      <span class="reaction-emoji">{{ emoji }}</span>
      <span class="reaction-count">{{ reactions.length }}</span>
    </button>
  </div>
</template>
```

**체크리스트**
- [ ] 리액션 추가/제거
- [ ] 리액션 그룹화 표시
- [ ] 리액션 피커 모달

---

#### Day 29-30: 스레드 기능

**스레드 뷰**
```vue
<!-- components/chat/ThreadView.vue -->
<script setup lang="ts">
interface Props {
  parentMessage: Message
}

const props = defineProps<Props>()
const messageStore = useMessageStore()

const threadMessages = computed(() =>
  messageStore.messages.filter(m => m.threadId === props.parentMessage.id)
)

const replyContent = ref('')

const handleReply = async () => {
  if (!replyContent.value.trim()) return
  
  await messageStore.sendThreadReply(
    props.parentMessage.id,
    replyContent.value
  )
  
  replyContent.value = ''
}
</script>

<template>
  <aside class="thread-view">
    <!-- Thread Header -->
    <div class="thread-header">
      <h3>Thread</h3>
      <button class="close-btn" @click="$emit('close')">
        <Icon name="x" />
      </button>
    </div>

    <!-- Parent Message -->
    <div class="parent-message">
      <MessageItem :message="parentMessage" />
    </div>

    <!-- Thread Replies -->
    <div class="thread-replies">
      <MessageItem
        v-for="msg in threadMessages"
        :key="msg.id"
        :message="msg"
      />
    </div>

    <!-- Reply Input -->
    <div class="reply-input">
      <MessageInput
        v-model="replyContent"
        placeholder="Reply to thread..."
        @send="handleReply"
      />
    </div>
  </aside>
</template>
```

**체크리스트**
- [ ] 스레드 생성
- [ ] 스레드 답장
- [ ] 스레드 뷰 (우측 패널)
- [ ] 스레드 카운트 표시

---

### Week 7: UX 개선

#### Day 31-32: 검색 기능

**글로벌 검색**
```vue
<!-- components/search/GlobalSearch.vue -->
<script setup lang="ts">
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const loading = ref(false)

const handleSearch = useDebounceFn(async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }
  
  loading.value = true
  
  try {
    const results = await searchService.search(query)
    searchResults.value = results
  } finally {
    loading.value = false
  }
}, 300)

watch(searchQuery, handleSearch)

// Keyboard shortcut: Ctrl+K
useEventListener('keydown', (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    // Open search modal
  }
})
</script>

<template>
  <div class="global-search">
    <Input
      v-model="searchQuery"
      type="search"
      placeholder="Search messages, files, people..."
      icon="search"
    />

    <div v-if="searchResults.length" class="search-results">
      <SearchResultItem
        v-for="result in searchResults"
        :key="result.id"
        :result="result"
      />
    </div>
  </div>
</template>
```

**체크리스트**
- [ ] 글로벌 검색 (메시지/파일/사용자)
- [ ] 검색 결과 표시
- [ ] 검색 키보드 단축키 (Ctrl+K)
- [ ] 최근 검색어

---

#### Day 33: 알림 시스템

**알림 Store**
```typescript
// stores/notification.ts
export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    unreadCount: 0,
  }),

  actions: {
    addNotification(notification: Notification) {
      this.notifications.unshift(notification)
      this.unreadCount++
      
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/logo.png',
        })
      }
    },

    markAsRead(id: string) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification && !notification.read) {
        notification.read = true
        this.unreadCount--
      }
    },

    markAllAsRead() {
      this.notifications.forEach(n => n.read = true)
      this.unreadCount = 0
    },

    async requestPermission() {
      if ('Notification' in window) {
        await Notification.requestPermission()
      }
    },
  },
})
```

**체크리스트**
- [ ] 브라우저 푸시 알림
- [ ] @멘션 알림
- [ ] DM 알림
- [ ] 알림 설정 (채널별 on/off)

---

#### Day 34-35: 성능 최적화

**가상 스크롤 적용**
```vue
<!-- components/chat/MessageList.vue (최적화 버전) -->
<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const messageStore = useMessageStore()
const channelId = computed(() => channelStore.currentChannelId!)

const messages = computed(() =>
  messageStore.messagesByChannel(channelId.value)
)

const { list, containerProps, wrapperProps } = useVirtualList(
  messages,
  {
    itemHeight: 80, // 예상 아이템 높이
  }
)
</script>

<template>
  <div v-bind="containerProps" class="message-list">
    <div v-bind="wrapperProps">
      <MessageItem
        v-for="{ data, index } in list"
        :key="data.id"
        :message="data"
      />
    </div>
  </div>
</template>
```

**코드 스플리팅**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ...
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'pinia'],
            'ui': ['@headlessui/vue'],
          },
        },
      },
    },
  },
})
```

**체크리스트**
- [ ] Virtual Scrolling
- [ ] Code Splitting
- [ ] Image Lazy Loading
- [ ] Debounce/Throttle 적용
- [ ] Lighthouse 점수 90+ 달성

---

#### Day 36: 반응형 디자인

**모바일 대응**
```css
/* Mobile Sidebar */
@media (max-width: 768px) {
  .workspace-sidebar {
    @apply fixed inset-y-0 left-0 z-50
           transform -translate-x-full
           transition-transform duration-300;
  }

  .workspace-sidebar.open {
    @apply translate-x-0;
  }

  .workspace-layout {
    @apply grid-cols-1;
  }
}
```

**체크리스트**
- [ ] 모바일 레이아웃
- [ ] 터치 제스처 지원
- [ ] 모바일 네비게이션
- [ ] 반응형 타이포그래피

---

## Phase 4: 최적화 및 배포 (1주)

### Week 8: 품질 보증

#### Day 37-38: 테스트

**컴포넌트 테스트**
```typescript
// components/common/Button.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      props: { variant: 'primary' },
      slots: { default: 'Click me' },
    })
    
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('btn-primary')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('is disabled when loading', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
```

**E2E 테스트**
```typescript
// e2e/chat.spec.ts
import { test, expect } from '@playwright/test'

test('send message flow', async ({ page }) => {
  // Login
  await page.goto('/auth/login')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.fill('input[type="password"]', 'password')
  await page.click('button[type="submit"]')

  // Navigate to channel
  await page.click('text=# general')

  // Send message
  await page.fill('textarea', 'Hello, world!')
  await page.press('textarea', 'Enter')

  // Verify message appears
  await expect(page.locator('text=Hello, world!')).toBeVisible()
})
```

**체크리스트**
- [ ] 단위 테스트 (Vitest)
- [ ] 컴포넌트 테스트
- [ ] E2E 테스트 (Playwright)
- [ ] 테스트 커버리지 80% 이상

---

#### Day 39: 접근성 & 성능

**접근성 테스트**
```bash
# axe-core를 사용한 자동 테스트
npm install -D @axe-core/playwright

# Lighthouse CI
npm install -D @lhci/cli
```

**체크리스트**
- [ ] WCAG 2.1 AA 준수
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 테스트
- [ ] Lighthouse 성능 점수 90+

---

#### Day 40: 문서화 & 배포

**README 작성**
```markdown
# Chat Platform - Web Client

## Features
- Real-time messaging
- Channels & Direct Messages
- Threads & Reactions
- Search & Notifications

## Tech Stack
- Nuxt 3 + Vue 3 + TypeScript
- Tailwind CSS
- Pinia
- WebSocket

## Getting Started
...
```

**배포**
```bash
# Build
npm run build

# Preview
npm run preview

# Deploy (Vercel/Netlify)
npm run deploy
```

**체크리스트**
- [ ] README 작성
- [ ] API 문서화
- [ ] 컴포넌트 스토리북
- [ ] 배포 (Vercel/Netlify)

---

## 부록

### A. 우선순위 기능 (MVP)

**반드시 구현**
1. ✅ 로그인/로그아웃
2. ✅ 채널 목록 조회
3. ✅ 메시지 전송/수신
4. ✅ 실시간 WebSocket 연결
5. ✅ 기본 UI/UX

**선택적 구현**
1. 파일 업로드
2. 이미지 프리뷰
3. 비디오 통화
4. 고급 검색

### B. 트러블슈팅 가이드

**WebSocket 연결 실패**
- CORS 설정 확인
- 토큰 유효성 검사
- 네트워크 방화벽 확인

**성능 이슈**
- Virtual Scrolling 적용
- 이미지 최적화
- 번들 크기 분석 (`nuxt analyze`)

**접근성 문제**
- axe-core로 자동 테스트
- 키보드 네비게이션 수동 테스트
- 색상 대비 검증

---

**문서 버전**: 1.0
**최종 수정**: 2025-12-20
**다음 업데이트**: Phase 1 완료 후
