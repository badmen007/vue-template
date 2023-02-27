<template>
  <el-color-picker
    v-model="theme"
    class="theme-picker"
    :predefine="themeColor"
    popper-class="theme-picker-dropdown"
  />
</template>

<script lang="ts" setup>
// 预设可选颜色
import { useSettingsStore } from "@/stores/settings"

const store = useSettingsStore()
const themeColor = [
  "#409EFF",
  "#1890ff",
  "#304156",
  "#212121",
  "#11a983",
  "#13c2c2",
  "#6959CD",
  "#f5222d"
]
// store中获取默认主题色
const defaultTheme = computed(() => store.settings.theme)
const theme = ref("")

// 监听默认样式
watch(
  defaultTheme,
  (value) => {
    theme.value = value
  },
  {
    immediate: true
  }
)

// 根据theme选择变化 重新生成主题
watch(theme, (value) => {
  // 同步store
  store.changeSetting({ key: "theme", value })

  // 稍后这里生成主题
  // generateTheme(value)
})
</script>

<style lang="scss">
.theme-picker {
  height: 26px !important;
  margin-right: 8px;
  .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
  }
}

.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
