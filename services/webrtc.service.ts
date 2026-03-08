import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/store/auth';
import { useVoiceStore } from '~/store/voice';

export class WebRTCService {
    private ws: WebSocket | null = null;
    private peerConnections: Map<number, RTCPeerConnection> = new Map();
    private localStream: MediaStream | null = null;
    private roomId: string | null = null;

    private config: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    async startStreaming(roomId: string) {
        this.roomId = roomId;
        const voiceStore = useVoiceStore();
        const authStore = useAuthStore();

        if (!authStore.currentUser) return;

        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        } catch (e) {
            console.error('Failed to get media devices. Please ensure microphone access is allowed.', e);
            return;
        }

        // Connect WebSocket for signaling
        const config = useRuntimeConfig();
        const wsUrl = `${config.public.wsBase}/ws/webrtc`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            this.sendSignalingMessage({
                type: 'join',
                roomId: this.roomId,
                senderId: authStore.currentUser!.id
            });
            voiceStore.joinRoom(roomId);
        };

        this.ws.onmessage = async (event) => {
            const msg = JSON.parse(event.data);
            if (msg.roomId !== this.roomId) return;

            const senderId = msg.senderId;
            if (senderId === authStore.currentUser!.id) return; // ignore self

            switch (msg.type) {
                case 'join':
                    // New user joined, let's create an offer
                    await this.createOffer(senderId);
                    break;
                case 'leave':
                    this.closePeerConnection(senderId);
                    voiceStore.removeParticipant(senderId);
                    break;
                case 'offer':
                    await this.handleOffer(senderId, msg.data);
                    break;
                case 'answer':
                    await this.handleAnswer(senderId, msg.data);
                    break;
                case 'ice':
                    await this.handleIceCandidate(senderId, msg.data);
                    break;
            }
        };

        this.ws.onclose = () => {
            this.cleanup();
        };
    }

    stopStreaming() {
        const authStore = useAuthStore();
        if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId && authStore.currentUser) {
            this.sendSignalingMessage({
                type: 'leave',
                roomId: this.roomId,
                senderId: authStore.currentUser.id
            });
            this.ws.close();
        }
        this.cleanup();
    }

    private cleanup() {
        const voiceStore = useVoiceStore();
        this.ws = null;
        this.roomId = null;

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        for (const [userId, pc] of this.peerConnections.entries()) {
            pc.close();
        }
        this.peerConnections.clear();
        voiceStore.leaveRoom();
    }

    toggleMute() {
        if (this.localStream) {
            const audioTracks = this.localStream.getAudioTracks();
            if (audioTracks.length > 0) {
                const track = audioTracks[0];
                track.enabled = !track.enabled;
                const voiceStore = useVoiceStore();
                voiceStore.isMuted = !track.enabled;
                return voiceStore.isMuted;
            }
        }
        return false;
    }

    private getOrCreatePeerConnection(userId: number): RTCPeerConnection {
        let pc = this.peerConnections.get(userId);
        if (!pc) {
            pc = new RTCPeerConnection(this.config);
            this.peerConnections.set(userId, pc);

            if (this.localStream) {
                this.localStream.getTracks().forEach(track => {
                    pc!.addTrack(track, this.localStream!);
                });
            }

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    const authStore = useAuthStore();
                    this.sendSignalingMessage({
                        type: 'ice',
                        roomId: this.roomId!,
                        senderId: authStore.currentUser!.id,
                        targetId: userId,
                        data: event.candidate
                    });
                }
            };

            pc.ontrack = (event) => {
                const voiceStore = useVoiceStore();
                if (event.streams && event.streams[0]) {
                    voiceStore.updateParticipantStream(userId, event.streams[0]);
                }
            };
        }
        return pc;
    }

    private closePeerConnection(userId: number) {
        const pc = this.peerConnections.get(userId);
        if (pc) {
            pc.close();
            this.peerConnections.delete(userId);
        }
    }

    private async createOffer(targetId: number) {
        const pc = this.getOrCreatePeerConnection(targetId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const authStore = useAuthStore();
        this.sendSignalingMessage({
            type: 'offer',
            roomId: this.roomId!,
            senderId: authStore.currentUser!.id,
            targetId,
            data: offer
        });
    }

    private async handleOffer(senderId: number, offerData: any) {
        const pc = this.getOrCreatePeerConnection(senderId);
        await pc.setRemoteDescription(new RTCSessionDescription(offerData));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        const authStore = useAuthStore();
        this.sendSignalingMessage({
            type: 'answer',
            roomId: this.roomId!,
            senderId: authStore.currentUser!.id,
            targetId: senderId,
            data: answer
        });
    }

    private async handleAnswer(senderId: number, answerData: any) {
        const pc = this.peerConnections.get(senderId);
        if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answerData));
        }
    }

    private async handleIceCandidate(senderId: number, iceData: any) {
        const pc = this.peerConnections.get(senderId);
        if (pc) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(iceData));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    }

    private sendSignalingMessage(msg: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }
}

export const webRtcService = new WebRTCService();
