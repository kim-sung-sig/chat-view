/**
 * 브라우저 알림 composable
 */
export const useNotification = () => {
  const uiStore = useUIStore()

  const requestPermission = async () => {
    return uiStore.requestNotificationPermission()
  }

  const show = (title: string, body: string, icon?: string) => {
    if (!uiStore.notificationSettings.enabled) return
    if (typeof Notification === 'undefined') return
    if (document.hasFocus()) return // 포커스 있으면 알림 생략

    new Notification(title, {
      body,
      icon: icon || '/pwa-192x192.png',
      badge: '/pwa-64x64.png',
      tag: 'chat-message',
      renotify: true,
    })
  }

  const playSound = () => {
    if (!uiStore.notificationSettings.sounds) return
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch {}
  }

  return { requestPermission, show, playSound }
}
