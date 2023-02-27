<template>
  <svg-icon
    :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
    @click="handleClick"
  />
</template>

<script lang="ts" setup>
import screenfull from "screenfull"
const { proxy } = getCurrentInstance()!
const isFullscreen = ref(false)
const handleClick = () => {
  if (screenfull.isEnabled) {
    // 浏览器是否允许全屏模式
    screenfull.toggle()
    return
  }
  return proxy?.$message({
    message: "you browser can not work",
    type: "warning"
  })
}

const change = () => {
  // 更新当前全屏状态 根据状态切换对应图标
  isFullscreen.value = screenfull.isFullscreen
}

onMounted(() => {
  if (screenfull.isEnabled) {
    // 浏览器是否允许全屏模式
    // 监听全屏切换状态
    screenfull.on("change", change)
  }
})
</script>
