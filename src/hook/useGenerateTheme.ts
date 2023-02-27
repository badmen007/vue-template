import { useSettingsStore } from "@/stores/settings"
import { generateColors, setColors } from "@/utils/color"

export const useGenerateTheme = () => {
  // 获得settingsStore
  const store = useSettingsStore()
  const theme = computed(() => store.settings.theme) // 默认主题
  const originalTheme = computed(() => store.settings.originalTheme)
  const generateTheme = (primary: string) => {
    const colors = Object.assign(
      // 根据当前主题生成
      {
        primary: theme.value
      },
      generateColors(primary)
    )
    setColors(colors)
  }
  // 用户选择的主题和当前主题不一致，则生成主题
  if (theme.value !== originalTheme.value) {
    generateTheme(theme.value)
    // 同步最新主题
    store.changeSetting({ key: "originalTheme", value: theme.value })
  }
  return {
    generateTheme
  }
}
