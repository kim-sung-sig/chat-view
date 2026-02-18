/**
 * API 사용 예제 및 테스트
 */

// 환경 변수 설정 예제
// .env 파일에 다음 값을 설정:
// NUXT_PUBLIC_API_BASE=http://localhost:8080
// NUXT_PUBLIC_WS_BASE=ws://localhost:8082

// ============================================
// 1. 인증 API 사용 예제
// ============================================

import { AuthService } from '~/services/api/auth.service';

const authService = new AuthService();

// 로그인
async function login() {
  try {
    const response = await authService.authenticate({
      identifier: 'user@example.com',
      credentialType: 'PASSWORD',
      password: 'password123'
    });

    if (response.authenticated) {
      console.log('로그인 성공!');
      console.log('Access Token:', response.token?.accessToken);
    }
  } catch (error) {
    console.error('로그인 실패:', error);
  }
}

// 토큰 갱신
async function refresh() {
  try {
    const response = await authService.refreshToken();
    console.log('토큰 갱신 성공');
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
  }
}

// 로그아웃
async function logout() {
  try {
    await authService.logout();
    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}

// ============================================
// 2. 채널 API 사용 예제
// ============================================

import { ChannelService } from '~/services/api/channel.service';

const channelService = new ChannelService();

// 내 채널 목록 조회
async function getMyChannels() {
  try {
    const channels = await channelService.getMyChannels();
    console.log('내 채널 목록:', channels);
  } catch (error) {
    console.error('채널 목록 조회 실패:', error);
  }
}

// 일대일 채널 생성
async function createDirectChannel(targetUserId: string) {
  try {
    const channel = await channelService.createDirectChannel({
      targetUserId
    });
    console.log('일대일 채널 생성 성공:', channel);
  } catch (error) {
    console.error('채널 생성 실패:', error);
  }
}

// 그룹 채널 생성
async function createGroupChannel() {
  try {
    const channel = await channelService.createGroupChannel({
      name: 'My Group',
      memberIds: ['user1', 'user2', 'user3']
    });
    console.log('그룹 채널 생성 성공:', channel);
  } catch (error) {
    console.error('채널 생성 실패:', error);
  }
}

// ============================================
// 3. 메시지 API 사용 예제
// ============================================

import { MessageService } from '~/services/api/message.service';

const messageService = new MessageService();

// 메시지 발송
async function sendMessage(channelId: string, content: string) {
  try {
    const message = await messageService.sendMessage({
      channelId,
      messageType: 'TEXT',
      textContent: content
    });
    console.log('메시지 발송 성공:', message);
  } catch (error) {
    console.error('메시지 발송 실패:', error);
  }
}

// 메시지 목록 조회
async function getMessages(channelId: string) {
  try {
    const response = await messageService.getMessages(channelId);
    console.log('메시지 목록:', response.data);
    console.log('다음 커서:', response.nextCursor);
    console.log('더 있음:', response.hasNext);
  } catch (error) {
    console.error('메시지 조회 실패:', error);
  }
}

// 페이징으로 이전 메시지 로드
async function loadMoreMessages(channelId: string, cursor: string) {
  try {
    const response = await messageService.getMessages(channelId, cursor, 50);
    console.log('이전 메시지:', response.data);
  } catch (error) {
    console.error('메시지 조회 실패:', error);
  }
}

// ============================================
// 4. WebSocket 사용 예제
// ============================================

import { ChatWebSocketService } from '~/services/websocket/chat-websocket.service';

const wsService = new ChatWebSocketService('ws://localhost:8082');

// WebSocket 연결
function connectWebSocket(channelId: string) {
  // 메시지 핸들러 등록
  wsService.onMessage((message) => {
    console.log('새 메시지 수신:', message);
    // UI 업데이트 로직
  });

  // 연결
  wsService.connect(channelId);
}

// WebSocket 연결 해제
function disconnectWebSocket() {
  wsService.disconnect();
}

// ============================================
// 5. Pinia Store 사용 예제 (Vue 컴포넌트 내에서)
// ============================================

// <script setup lang="ts">
import { useChatStore } from '~/store/chat';

// const chatStore = useChatStore();

// // 초기화
// onMounted(async () => {
//   chatStore.initializeServices();
//   await chatStore.loadMyChannels();
// });

// // 채널 변경
// async function switchChannel(channelId: string) {
//   await chatStore.setActiveChannel(channelId);
// }

// // 메시지 발송
// async function sendMessage(content: string) {
//   await chatStore.sendMessage(content);
// }

// // 현재 메시지 목록
// const messages = computed(() => chatStore.getCurrentChannelMessages);

// // 정리
// onUnmounted(() => {
//   chatStore.cleanup();
// });
// </script>

// ============================================
// 6. 에러 처리 패턴
// ============================================

// Try-catch로 에러 처리
async function handleApiCall() {
  try {
    const result = await channelService.getMyChannels();
    return result;
  } catch (error: any) {
    // 에러 타입별 처리
    if (error.status === 401) {
      console.log('인증 실패 - 로그인 페이지로 이동');
      navigateTo('/login');
    } else if (error.status === 403) {
      console.log('권한 없음');
    } else if (error.status === 404) {
      console.log('리소스를 찾을 수 없음');
    } else {
      console.error('서버 오류:', error.message);
    }
    throw error;
  }
}

// ============================================
// 7. 토큰 자동 갱신 패턴
// ============================================

// useApi.ts에서 이미 구현됨
// onResponseError에서 401 에러 시 자동으로 토큰 갱신 시도

// ============================================
// 8. 실전 사용 예제 - 채팅방 입장
// ============================================

async function joinChannel(channelId: string) {
  const chatStore = useChatStore();
  
  try {
    // 1. 서비스 초기화
    chatStore.initializeServices();
    
    // 2. 채널로 이동 (메시지 로드 + WebSocket 연결)
    await chatStore.setActiveChannel(channelId);
    
    console.log('채널 입장 성공');
  } catch (error) {
    console.error('채널 입장 실패:', error);
  }
}

// ============================================
// 9. 실전 사용 예제 - 새 DM 시작
// ============================================

async function startDirectMessage(targetUserId: string) {
  const chatStore = useChatStore();
  
  try {
    // 일대일 채널 생성 및 입장
    await chatStore.createDirectChannel(targetUserId);
    
    console.log('DM 시작 성공');
  } catch (error) {
    console.error('DM 시작 실패:', error);
  }
}

export {
    connectWebSocket, createDirectChannel, getMessages, getMyChannels, joinChannel, login,
    logout, sendMessage, startDirectMessage
};

