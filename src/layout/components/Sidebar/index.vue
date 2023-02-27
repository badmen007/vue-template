<template>
  <logo v-if="showLogo" :collapse="isCollapse" />
  <scroll-panel>
    <el-menu
      class="sidebar-container-menu"
      mode="vertical"
      :default-active="activeMenu"
      :background-color="scssVariables.menuBg"
      :text-color="scssVariables.menuText"
      :active-text-color="themeColor"
      :collapse="sidebar.opened"
      :collapse-transition="true"
    >
      <!-- 循环sidebar-item组件 -->
      <sidebar-item
        v-for="route in menuRoutes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </scroll-panel>
</template>
<script lang="ts" setup>
import scssVariables from "@/styles/variables.module.scss"
// 导入路由表

import { useAppStore } from "@/stores/app"
import { storeToRefs } from "pinia"
import { useSettingsStore } from "@/stores/settings"
import { useMenuStore } from "@/stores/menu"
const store = useAppStore()
const { sidebar } = storeToRefs(store)
const menuStore = useMenuStore()

const menuList = computed(() => menuStore.state.authMenuTreeData) // 菜单树 数据
// 渲染路由
const menuRoutes = computed(() => menuList.value)

const route = useRoute()
// 根据路由路径 对应 当前激活的菜单 页面刷新后 激活当前路由匹配的菜单
const activeMenu = computed(() => {
  const { path, meta } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
const settingStore = useSettingsStore()
const themeColor = computed(() => settingStore.settings.theme)

// 是否显示logo
const showLogo = computed(() => settingStore.settings.sidebarLogo)
// 展开收起状态 稍后放store 当前是展开就让它收起
const isCollapse = computed(() => store.sidebar.opened)
const logoHeight = computed(() => (showLogo.value ? 50 : 0) + "px")
</script>
<style lang="scss" scoped>
.sidebar-wrapper {
  .sidebar-container-menu {
    height: calc(100vh - v-bind(logoHeight));
  }
}
</style>
