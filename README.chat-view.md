# Chat Platform - Frontend (chat-view)

Discord 스타일의 실시간 채팅 플랫폼 프론트엔드

## 기술 스택

- **Nuxt 3**: Vue.js 프레임워크
- **TypeScript**: 타입 안정성
- **Pinia**: 상태 관리
- **PWA**: 프로그레시브 웹 앱

## 주요 기능

### 1. 인증
- 로그인/로그아웃
- JWT 토큰 기반 인증
- Refresh Token 자동 갱신

### 2. 채널 관리
- 일대일 채널 (Direct Message)
- 그룹 채널
- 공개/비공개 채널
- 채널 생성/조회

### 3. 실시간 메시징
- WebSocket 연결
- 실시간 메시지 수신
- 메시지 전송
- 커서 기반 페이징

### 4. Discord 스타일 UI
- 서버 사이드바
- 채널 사이드바
- 채팅 영역
- 유저 패널
- 모바일 반응형

## 프로젝트 구조

```
chat-view/
├── components/
│   ├── channel/          # 채널 관련 컴포넌트
│   │   └── ChannelSidebar.vue
│   ├── chat/             # 채팅 관련 컴포넌트
│   │   ├── ChatArea.vue
│   │   └── MessageItem.vue
│   ├── common/           # 공통 컴포넌트
│   │   ├── PWAInstallPrompt.vue
│   │   ├── SettingsModal.vue
│   │   └── UserPanel.vue
│   ├── friends/          # 친구 관련 컴포넌트
│   │   └── FriendList.vue
│   └── server/           # 서버 관련 컴포넌트
│       ├── DMSidebar.vue
│       └── ServerSidebar.vue
├── composables/          # Vue Composables
│   └── useApi.ts         # API 호출 Composable
├── pages/                # 페이지 컴포넌트
│   ├── index.vue         # 메인 페이지
│   └── login.vue         # 로그인 페이지
├── services/             # API 서비스
│   ├── api/
│   │   ├── auth.service.ts      # 인증 API
│   │   ├── channel.service.ts   # 채널 API
│   │   └── message.service.ts   # 메시지 API
│   └── websocket/
│       └── chat-websocket.service.ts  # WebSocket 서비스
├── store/                # Pinia 스토어
│   ├── chat.ts           # 채팅 스토어 (실제 API)
│   ├── data.ts           # 데이터 스토어 (Mock)
│   └── ui.ts             # UI 상태 스토어
├── types/                # TypeScript 타입
│   └── index.ts
└── assets/
    └── css/
        └── main.css      # 전역 스타일
```

## API 엔드포인트

### 인증 API
- `POST /api/v1/auth/authenticate` - 로그인
- `POST /api/v1/auth/refresh` - 토큰 갱신
- `POST /api/v1/auth/logout` - 로그아웃

### 채널 API
- `GET /api/v1/channels/my` - 내 채널 목록
- `GET /api/v1/channels/public-list` - 공개 채널 목록
- `GET /api/v1/channels/{channelId}` - 채널 상세
- `POST /api/v1/channels/direct` - 일대일 채널 생성
- `POST /api/v1/channels/group` - 그룹 채널 생성
- `POST /api/v1/channels/public` - 공개 채널 생성
- `POST /api/v1/channels/private` - 비공개 채널 생성

### 메시지 API
- `POST /api/messages` - 메시지 발송 (Command)
- `GET /api/v1/messages?channelId={id}&cursor={cursor}&limit={limit}` - 메시지 조회 (Query)
- `GET /api/v1/messages/{messageId}` - 특정 메시지 조회
- `GET /api/v1/messages/unread-count?channelId={id}` - 읽지 않은 메시지 수

### WebSocket
- `ws://localhost:8082/ws/chat?roomId={channelId}&token={jwt}` - 실시간 메시지

## 환경 변수

`.env` 파일에 다음 환경 변수를 설정하세요:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8080
NUXT_PUBLIC_WS_BASE=ws://localhost:8082
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

## 주요 스토어

### ChatStore (store/chat.ts)
실제 백엔드 API와 연동된 채팅 스토어:
- 채널 관리
- 메시지 송수신
- WebSocket 연결 관리

### DataStore (store/data.ts)
Mock 데이터를 위한 레거시 스토어 (호환성 유지):
- 서버 관리
- 친구 관리
- Mock 데이터

### UIStore (store/ui.ts)
UI 상태 관리:
- 모바일 사이드바 상태
- 설정 모달 상태

## 서비스 레이어

### AuthService
- 로그인, 로그아웃, 토큰 갱신
- 토큰을 localStorage에 저장

### ChannelService
- 채널 CRUD
- 채널 목록 조회

### MessageService
- 메시지 발송 (Command)
- 메시지 조회 (Query, CQRS)
- 커서 기반 페이징

### ChatWebSocketService
- WebSocket 연결/해제
- 자동 재연결
- 메시지 핸들러 관리

## UI 테마

Discord 스타일의 다크 테마:
- Primary Background: `#36393f`
- Secondary Background: `#2f3136`
- Tertiary Background: `#202225`
- Brand Color: `#5865F2`

## 반응형 디자인

- 데스크톱: 3단 레이아웃 (서버 사이드바 + 채널 사이드바 + 채팅 영역)
- 모바일: 햄버거 메뉴로 사이드바 토글

## PWA 기능

- 오프라인 지원
- 홈 화면에 추가
- 푸시 알림 (향후 구현)

## 다음 단계

- [ ] 이미지 업로드
- [ ] 이모지 선택기
- [ ] 멘션 (@user)
- [ ] 메시지 검색
- [ ] 음성/영상 채팅
- [ ] 푸시 알림
- [ ] 다중 서버 지원
- [ ] 사용자 프로필
- [ ] 친구 관리 API 연동
