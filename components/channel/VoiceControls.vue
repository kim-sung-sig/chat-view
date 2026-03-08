<script setup lang="ts">
import { webRtcService } from '~/services/webrtc.service';
import { useChatStore } from '~/store/chat';
import { useVoiceStore } from '~/store/voice';

const voiceStore = useVoiceStore();
const chatStore = useChatStore();

const toggleMute = () => {
    webRtcService.toggleMute();
};

const disconnect = () => {
    webRtcService.stopStreaming();
};

const getChannelName = (id: string) => {
    const ch = chatStore.channels.find(c => c.id === id);
    return ch ? ch.name : id;
};
</script>

<template>
  <div class="voice-controls" v-if="voiceStore.currentRoomId">
    <div class="voice-info">
      <div class="voice-connected">음성 서버 연결됨</div>
      <div class="voice-channel-name">{{ getChannelName(voiceStore.currentRoomId) }}</div>
    </div>
    
    <div class="voice-actions">
      <button class="action-btn" :class="{ muted: voiceStore.isMuted }" @click="toggleMute" title="마이크 음소거">
        {{ voiceStore.isMuted ? '🔇' : '🎤' }}
      </button>
      <button class="action-btn disconnect" @click="disconnect" title="연결 끊기">
        📞
      </button>
    </div>

    <!-- P2P 참여자 오디오 태그들 (보이지 않음) -->
    <div style="display: none;">
      <audio 
        v-for="p in voiceStore.participants" 
        :key="p.userId" 
        :srcObject.prop="p.stream" 
        autoplay
      ></audio>
    </div>
  </div>
</template>

<style scoped>
.voice-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--bg-tertiary, #1e1f22);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.voice-info {
  display: flex;
  flex-direction: column;
}

.voice-connected {
  color: #23a559;
  font-size: 13px;
  font-weight: 700;
}

.voice-channel-name {
  color: var(--c-text-muted, #949ba4);
  font-size: 11px;
}

.voice-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: var(--bg-modifier-accent, #3f4147);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: var(--c-text-normal, #dbdee1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-modifier-hover, #4e5058);
}

.action-btn.muted {
  color: var(--c-danger, #da373c);
}

.action-btn.disconnect {
  color: white;
  background: transparent;
}
.action-btn.disconnect:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--c-danger, #da373c);
}
</style>
