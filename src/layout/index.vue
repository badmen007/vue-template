<template>
  <div class="app-wrapper">
    <div class="sidebar-container">
      <sidebar></sidebar>
    </div>
    <div class="main-container">
      <div class="header">
        <navbar @showSetting="openSetting"></navbar>
        <tags-view v-if="showTagsView"></tags-view>
      </div>
      <div class="app-main">
        <app-main></app-main>
      </div>

      <!-- 增添right-panel -->
      <right-panel
        v-model="showSetting"
        title="样式风格设置"
        :size="settingsPanelWidth"
      >
        <!-- settings 面板设置组件,稍后实现 -->
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import variables from "@/styles/variables.module.scss"
import { useSettingsStore } from "@/stores/settings"

const showSetting = ref(false)
const openSetting = () => {
  // 控制right-panel弹出
  showSetting.value = true
}
const settingsStore = useSettingsStore()
const settingsPanelWidth = computed(() => variables.settingPanelWidth)
const showTagsView = computed(() => settingsStore.settings.tagsView)
const otherHeight = computed(() => (showSetting.value ? 84 : 50) + "px")
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100%;

  .main-container {
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    .header {
      .navbar {
        height: 50px;
      }
      .tags-view {
        height: 34px;
      }
    }
    .app-main {
      /* main = 100% - navbar  tagsview */
      min-height: calc(100vh - v-bind(otherHeight));
    }
  }
}
</style>
