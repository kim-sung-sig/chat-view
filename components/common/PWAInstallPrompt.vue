<template>
  <!-- 디버그 버튼 (개발 중에만 사용) -->
  <button
    v-if="!showInstallPrompt && showDebugButton"
    @click="forceShowPrompt"
    class="debug-pwa-button"
    title="PWA 설치 프롬프트 강제 표시 (디버그용)"
  >
    📱 PWA
  </button>

  <div v-if="showInstallPrompt" class="pwa-install-prompt">
    <div class="prompt-content">
      <div class="prompt-icon">📱</div>
      <div class="prompt-text">
        <h3>앱 설치</h3>
        <p>Discode를 홈 화면에 추가하여 더 빠르게 접속하세요</p>
      </div>
      <div class="prompt-actions">
        <button @click="install" class="install-btn">설치</button>
        <button @click="dismiss" class="dismiss-btn">나중에</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showInstallPrompt = ref(false)
const showDebugButton = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  // 개발 환경에서 디버그 버튼 표시 (5초 후)
  setTimeout(() => {
    if (!showInstallPrompt.value) {
      showDebugButton.value = true
      console.log('🔍 PWA Debug: beforeinstallprompt 이벤트가 아직 발생하지 않았습니다.')
      console.log('💡 PWA Debug: 디버그 버튼(📱)을 클릭하여 프롬프트를 강제로 표시할 수 있습니다.')
    }
  }, 5000)

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('✅ PWA: beforeinstallprompt 이벤트 발생!')
    e.preventDefault()
    deferredPrompt = e

    // Don't show if user dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      console.log('⚠️ PWA: 사용자가 이전에 설치를 거부했습니다. (localStorage에 저장됨)')
      console.log('💡 PWA: localStorage를 지우거나 디버그 버튼을 클릭하세요.')
      showDebugButton.value = true
    } else {
      showInstallPrompt.value = true
      showDebugButton.value = false
      console.log('🎉 PWA: 설치 프롬프트 표시!')
    }
  })

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA: 앱이 설치되었습니다!')
    showInstallPrompt.value = false
    showDebugButton.value = false
    deferredPrompt = null
  })

  // 이미 설치되었는지 확인
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('✅ PWA: 이미 설치된 앱으로 실행 중입니다.')
  }
})

const install = async () => {
  if (!deferredPrompt) {
    console.log('❌ PWA: deferredPrompt가 없습니다.')
    console.log('📌 PWA: 다음 방법으로 설치를 시도하세요:')
    console.log('  1. Chrome: 주소창 오른쪽의 ⊕ 아이콘 클릭')
    console.log('  2. Chrome: 메뉴(⋮) → "Discode 설치" 선택')
    console.log('  3. Edge: 주소창 오른쪽의 + 아이콘 클릭')
    console.log('  4. 모바일: 브라우저 메뉴 → "홈 화면에 추가"')

    // 브라우저의 기본 설치 UI를 안내하는 alert
    alert('PWA 설치 방법:\n\n' +
          'Desktop:\n' +
          '• Chrome/Edge: 주소창 오른쪽의 설치(+) 아이콘을 클릭하세요\n' +
          '• 또는 브라우저 메뉴에서 "앱 설치" 선택\n\n' +
          'Mobile:\n' +
          '• 브라우저 메뉴 → "홈 화면에 추가"\n\n' +
          '주소창 옆에 설치 아이콘이 보이지 않으면,\n' +
          '브라우저가 PWA 설치 조건을 아직 확인 중일 수 있습니다.')
    return
  }

  try {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('✅ PWA: 사용자가 설치를 수락했습니다.')
    } else {
      console.log('❌ PWA: 사용자가 설치를 거부했습니다.')
    }

    deferredPrompt = null
    showInstallPrompt.value = false
    showDebugButton.value = false
  } catch (error) {
    console.error('❌ PWA 설치 오류:', error)
  }
}

const dismiss = () => {
  console.log('⏭️ PWA: 사용자가 "나중에"를 선택했습니다.')
  showInstallPrompt.value = false
  showDebugButton.value = true
  localStorage.setItem('pwa-install-dismissed', 'true')
}

const forceShowPrompt = () => {
  console.log('🔧 PWA Debug: 프롬프트 강제 표시')
  console.log('ℹ️ PWA: beforeinstallprompt 상태:', deferredPrompt ? '있음' : '없음')
  localStorage.removeItem('pwa-install-dismissed')
  showInstallPrompt.value = true
  showDebugButton.value = false

  // deferredPrompt가 없는 경우에 대한 안내
  if (!deferredPrompt) {
    console.log('⚠️ PWA: beforeinstallprompt 이벤트가 아직 발생하지 않았습니다.')
    console.log('💡 이유:')
    console.log('  • HTTPS 환경이 아닐 수 있음 (localhost는 예외)')
    console.log('  • Service Worker가 아직 등록되지 않음')
    console.log('  • 브라우저가 PWA로 인식하지 못함')
    console.log('  • manifest.json 파일 문제')
    console.log('💡 해결 방법:')
    console.log('  • F12 → Application 탭 → Manifest 확인')
    console.log('  • F12 → Application 탭 → Service Workers 확인')
    console.log('  • F12 → Lighthouse → PWA 점수 확인')
  }
}
</script>

<style scoped>
.debug-pwa-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: #5865f2;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.debug-pwa-button:hover {
  background: #4752c4;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(88, 101, 242, 0.6);
}

.pwa-install-prompt {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.prompt-content {
  background: #2f3136;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 500px;
  border: 1px solid #40444b;
}

.prompt-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.prompt-text {
  flex: 1;
}

.prompt-text h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.prompt-text p {
  margin: 0;
  font-size: 14px;
  color: #b9bbbe;
}

.prompt-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.install-btn,
.dismiss-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.install-btn {
  background: #5865f2;
  color: white;
}

.install-btn:hover {
  background: #4752c4;
}

.dismiss-btn {
  background: transparent;
  color: #b9bbbe;
  border: 1px solid #40444b;
}

.dismiss-btn:hover {
  background: #40444b;
  color: white;
}

@media (max-width: 600px) {
  .pwa-install-prompt {
    left: 10px;
    right: 10px;
    transform: none;
  }

  .prompt-content {
    flex-direction: column;
    text-align: center;
  }

  .prompt-actions {
    width: 100%;
    flex-direction: column;
  }

  .install-btn,
  .dismiss-btn {
    width: 100%;
  }

  .debug-pwa-button {
    bottom: 80px;
    right: 20px;
  }
}
</style>
