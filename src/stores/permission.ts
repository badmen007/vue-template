import { RouteRecordRaw } from "vue-router"
import path from "path-browserify"
import { defineStore } from "pinia"

import { asyncRoutes } from "@/router"
import { useMenuStore } from "./menu"
import { MenuData } from "@/api/config/menu"
import { useUserStore } from "./user"

// 定义state类型
export interface IPermissionState {
  routes: Array<RouteRecordRaw>
  accessRoutes: Array<RouteRecordRaw>
}
const generateRoutePaths = (menus: Array<MenuData>): string[] => {
  return menus.map((menu) => menu.path)
}
// 生成可访问路由表

const whiteList = ["/:pathMatch(.*)*"]
// 生成可访问路由表
const generateRoutes = (
  routes: Array<RouteRecordRaw>,
  routePaths: string[],
  basePath = "/"
) => {
  const routerData: Array<RouteRecordRaw> = []
  routes.forEach((route) => {
    const routePath = path.resolve(basePath, route.path)
    if (route.children) {
      // 先看子路由 是否有匹配上的路由
      route.children = generateRoutes(route.children, routePaths, routePath)
    }

    // 如果当前路由子路由 数量大于0有匹配上 或 paths中包含当面路由path 就需要把当前父路由添加上

    if (
      routePaths.includes(routePath) ||
      (route.children && route.children.length >= 1) ||
      whiteList.includes(routePath)
    ) {
      routerData.push(route)
    }
  })
  return routerData
}
const filterAsyncRoutes = (
  menus: Array<MenuData>,
  routes: Array<RouteRecordRaw>
) => {
  // 生成要匹配的路由path数组
  const routePaths = generateRoutePaths(menus)

  // 生成匹配path的路由表
  const routerList = generateRoutes(routes, routePaths)

  return routerList
}

export const usePermissionStore = defineStore("permission", () => {
  // 状态
  const state = reactive<IPermissionState>({
    routes: [],
    accessRoutes: []
  })
  const menuStore = useMenuStore()
  const userStore = useUserStore()
  const generateRoutes = async (type?: number) => {
    // 1 针对菜单排序更新

    let accessedRoutes: Array<RouteRecordRaw> = []
    const roleNames = computed(() => {
      return userStore.state.roles!.map((item) => item.name)
    })

    const roleIds = computed(() => {
      return userStore.state.roles!.map((item) => item.id)
    })

    if (roleNames.value.includes("super_admin")) {
      // 超级管理员角色
      accessedRoutes = asyncRoutes
      await menuStore.getAllMenuListByAdmin()
      return accessedRoutes
    } else {
      // 根据角色过滤菜单, 这里修改下getAccessByRoles返回值
      const menus = await menuStore.getAccessByRoles(roleIds.value)
      if (type !== 1) {
        accessedRoutes = filterAsyncRoutes(menus as MenuData[], asyncRoutes)
      }
      return accessedRoutes
    }
  }
  return { generateRoutes, state }
})
