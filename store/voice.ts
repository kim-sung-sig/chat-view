import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useVoiceStore = defineStore('voice', () => {
    const currentRoomId = ref<string | null>(null);
    const isMuted = ref(false);
    const isDeafened = ref(false);

    // 참여자 스트림 관리
    const participants = ref<{ userId: number, stream: MediaStream | null }[]>([]);

    const joinRoom = (roomId: string) => {
        currentRoomId.value = roomId;
        participants.value = [];
    };

    const leaveRoom = () => {
        currentRoomId.value = null;
        participants.value = [];
    };

    const addParticipant = (userId: number) => {
        if (!participants.value.find(p => p.userId === userId)) {
            participants.value.push({ userId, stream: null });
        }
    };

    const removeParticipant = (userId: number) => {
        participants.value = participants.value.filter(p => p.userId !== userId);
    };

    const updateParticipantStream = (userId: number, stream: MediaStream) => {
        const participant = participants.value.find(p => p.userId === userId);
        if (participant) {
            participant.stream = stream;
        } else {
            participants.value.push({ userId, stream });
        }
    };

    return {
        currentRoomId,
        isMuted,
        isDeafened,
        participants,
        joinRoom,
        leaveRoom,
        addParticipant,
        removeParticipant,
        updateParticipantStream
    };
});
