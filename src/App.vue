<template>
  <el-config-provider :size="size" :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useAppStore } from "./stores/app"
import zhCn from "element-plus/dist/locale/zh-cn.mjs"
import { useGenerateTheme } from "@/hook/useGenerateTheme"
const store = useAppStore()
useGenerateTheme()
const { size } = storeToRefs(store)
</script>
