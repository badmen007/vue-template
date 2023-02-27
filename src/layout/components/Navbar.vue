<template>
  <div class="navbar">
    <hambuger @toggleClick="toggleSidebar" :is-active="sidebar.opened" />
    <breadcrumb></breadcrumb>

    <div class="right-menu">
      <div
        @click="openShowSetting"
        class="setting right-menu-item hover-effect"
      >
        <el-icon><Setting /></el-icon>
      </div>

      <screenfull class="right-menu-item hover-effect"></screenfull>

      <!-- element组件size切换 -->
      <el-tooltip content="Global Size" effect="dark" placement="bottom">
        <size-select class="right-menu-item hover-effect" />
      </el-tooltip>
      <avatar />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/app"
import { storeToRefs } from "pinia"
import { Setting } from "@element-plus/icons-vue"
const store = useAppStore()
const { sidebar } = storeToRefs(store)
const toggleSidebar = () => {
  store.toggleSidebar()
}

const emit = defineEmits<{
  (event: "showSetting", isShow: boolean): void
}>()
// 打开设置面板,触发对应的事件
const openShowSetting = () => {
  emit("showSetting", true)
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  display: flex;
  background: #fff;
  border-bottom: 1px solid rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .right-menu {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
    &-item {
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .setting {
      font-size: 26px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
