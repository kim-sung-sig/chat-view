/**
 * 채널 검색 composable
 */
import { ref, computed } from 'vue'
import { useDataStore } from '~/store/data'

export const useChannelSearch = () => {
  const store = useDataStore()
  const query = ref('')

  const results = computed(() => {
    if (!query.value.trim()) return []
    const q = query.value.toLowerCase()
    const allChannels = [...store.channels, ...store.dms]
    return allChannels.filter(ch =>
      ch.name.toLowerCase().includes(q)
    ).slice(0, 20)
  })

  const clear = () => { query.value = '' }

  return { query, results, clear }
}
