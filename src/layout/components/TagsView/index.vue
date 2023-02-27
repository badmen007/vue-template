<template>
  <div class="tags-view-container">
    <scroll-panel>
      <div class="tags-view-wrapper">
        <!-- 一个个tag view就是router-link -->
        <router-link
          class="tags-view-item"
          :class="{
            active: isActive(tag)
          }"
          v-for="(tag, index) in visitedViews"
          :key="index"
          :to="{ path: tag.path, query: tag.query }"
          :style="{
            backgroundColor: isActive(tag) ? themeColor : '',
            borderColor: isActive(tag) ? themeColor : ''
          }"
        >
          <el-dropdown
            trigger="contextmenu"
            @command="(command:any) => handleTagCommand(command, tag)"
          >
            <span style="line-height: 26px">{{ tag.meta.title }}</span>
            <!-- affix固定的路由tag是无法删除 -->
            <span
              v-if="!isAffix(tag)"
              class="el-icon-close"
              @click.prevent.stop="closeSelectedTag(tag)"
            ></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                <el-dropdown-item
                  command="self"
                  v-if="!tag.meta || !tag.meta.affix"
                  >关闭</el-dropdown-item
                >
                <el-dropdown-item command="refresh">刷新</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-icon class="icon-close" v-if="!isAffix(tag)">
            <CloseBold @click.prevent.stop="closeSelectedTag(tag)" />
          </el-icon>
        </router-link>
      </div>
    </scroll-panel>
  </div>
</template>

<script lang="ts" setup>
import { useTagsView } from "@/stores/tagsView"
import { storeToRefs } from "pinia"
import { RouteLocationNormalized, RouteRecordRaw } from "vue-router"
import { CloseBold } from "@element-plus/icons-vue"
import path from "path-browserify"
import { routes } from "@/router"
import { useSettingsStore } from "@/stores/settings"
const store = useTagsView()

const { visitedViews } = storeToRefs(store)
const route = useRoute()
// 从store里获取 可显示的tags view
// 添加tag
const addTags = () => {
  const { name } = route
  if (name) {
    store.addView(route)
  }
}
watch(
  () => route.path,
  () => {
    addTags()
  },
  { immediate: true }
)
// 是否是当前应该激活的tag
const isActive = (tag: RouteLocationNormalized) => {
  return tag.path === route.path
}
// 关闭当前右键的tag路由
const closeSelectedTag = (view: RouteLocationNormalized) => {
  store.delView(view)
  // 如果移除的view是当前选中状态view, 就让删除后的集合中最后一个tag view为选中态
  if (isActive(view)) {
    toLastView(visitedViews.value, view)
  }
}
const router = useRouter()
const toLastView = (
  visitedViews: RouteLocationNormalized[],
  view: RouteLocationNormalized
) => {
  // 得到集合中最后一个项tag view 可能没有
  const lastView = visitedViews[visitedViews.length - 1]
  if (lastView) {
    router.push(lastView.path)
  } else {
    // 集合中都没有tag view时
    // 如果刚刚删除的正是Dashboard 就重定向回Dashboard（首页）
    if (view.name === "Dashboard") {
      router.push({ path: view.path })
    } else {
      // tag都没有了 删除的也不是Dashboard 只能跳转首页
      router.push("/")
    }
  }
}
const fillterAffixTags = (routes: RouteRecordRaw[], basePath = "/") => {
  let tags: RouteLocationNormalized[] = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      // 把路由路径解析成完整路径，路由可能是相对路径
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        name: route.name,
        path: tagPath,
        meta: { ...route.meta }
      } as RouteLocationNormalized)
    }

    // 深度优先遍历 子路由（子路由路径可能相对于route.path父路由路径）
    if (route.children) {
      const childTags = fillterAffixTags(route.children, route.path)
      if (childTags.length) {
        tags = [...tags, ...childTags]
      }
    }
  })
  return tags
}
const initTags = () => {
  const affixTags = fillterAffixTags(routes)
  for (const tag of affixTags) {
    if (tag.name) {
      store.addView(tag)
    }
  }
}
const isAffix = (tag: RouteLocationNormalized) => {
  return tag.meta && tag.meta.affix
}
onMounted(() => {
  initTags()
})
const enum TagCommandType {
  All = "all",
  Other = "other",
  Self = "self",
  Refresh = "refresh"
}

const handleTagCommand = (
  command: TagCommandType,
  view: RouteLocationNormalized
) => {
  switch (command) {
    case TagCommandType.All: // 右键删除标签导航所有tag 除了affix为true的
      handleCloseAllTag(view)
      break
    case TagCommandType.Other: // 关闭其他tag 除了affix为true的和当前右键的tag
      handleCloseOtherTag(view)
      break
    case TagCommandType.Self: // 关闭当前右键的tag affix为true的tag下拉菜单中无此项
      closeSelectedTag(view)
      break
    case TagCommandType.Refresh: // 刷新当前右键选中tag对应的路由
      refreshSelectedTag(view)
      break
  }
}
const refreshSelectedTag = async (view: RouteLocationNormalized) => {
  // 刷新前 将该路由名称从缓存列表中移除
  store.delCachedView(view)
  // router.push(view.path) // 无法刷新页面，因为页面没有任何变化

  router.push("/redirect" + view.path) // 跳转重定向路由
}
const handleCloseAllTag = (view: RouteLocationNormalized) => {
  // 对于是affix的tag是不会被删除的
  store.delAllView()
  // 关闭所有后 就让切换到剩下affix中最后一个tag
  toLastView(visitedViews.value, view)
}
const handleCloseOtherTag = (view: RouteLocationNormalized) => {
  store.delOthersViews(view)
  if (!isActive(view)) {
    // 删除其他tag后 让该view路由激活
    router.push(view.path)
  }
}
const settingStore = useSettingsStore()
const themeColor = computed(() => settingStore.settings.theme)
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;
  height: 34px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      background: #fff;
      color: #495060;
      padding: 0 8px;
      box-sizing: border-box;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        .el-dropdown {
          color: #fff;
        }
        &::before {
          position: relative;
          display: inline-block;
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 5px;
          background: #fff;
        }
      }
    }
    span {
      vertical-align: middle;
    }
  }
  .icon-close {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    position: relative;
    left: 2px;
    border-radius: 50%;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transform-origin: 100% 50%;
    &:before {
      transform: scale(0.6);
      display: inline-block;
      vertical-align: -1px;
    }
    &:hover {
      background-color: #b4bccc;
      color: #fff;
    }
  }
}
</style>
