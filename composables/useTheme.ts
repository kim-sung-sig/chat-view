/**
 * 테마 composable
 */
import { useUIStore } from '~/store/ui'
import type { Theme } from '~/types'

export const useTheme = () => {
  const uiStore = useUIStore()

  const applyTheme = (theme: Theme) => {
    uiStore.setTheme(theme)
  }

  const initTheme = () => {
    uiStore.initTheme()
  }

  return { theme: computed(() => uiStore.theme), applyTheme, initTheme }
}
