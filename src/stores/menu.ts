import { getAllMenus as getAllMenusApi } from "@/api/config/menu"
import { getAccessByRoles as getAccessByRolesApi } from "@/api/config/roleAccess"
import { MenuData } from "@/api/config/menu"
import { defineStore } from "pinia"
import { generateMenuTree, generateTree } from "@/utils/generateTree"

export interface ITreeItemData extends MenuData {
  children?: ITreeItemData[]
}

// state类型
export interface IMenusState {
  menuTreeData: Array<ITreeItemData> // 树形菜单数据
  menuList: Array<MenuData> // 原始菜单列表数据
  authMenuTreeData: Array<ITreeItemData> // 树形菜单数据
  authMenuList: Array<MenuData> // 原始菜单列表数据
}

export const useMenuStore = defineStore("menu", () => {
  const state = reactive<IMenusState>({
    menuTreeData: [],
    menuList: [],
    authMenuTreeData: [],
    authMenuList: []
  })
  const getAllMenuList = async () => {
    const response = await getAllMenusApi()
    const { data } = response
    state.menuList = data // 获取的菜单列表
    const treeData = generateTree([...data]) // 生成树数据

    state.menuTreeData = treeData // 格式化后菜单树数据
  }
  const getAllMenuListByAdmin = async () => {
    const response = await getAllMenusApi()
    const { data } = response
    state.authMenuList = data // 权限菜单列表
    const treeData = generateMenuTree([...data])

    state.authMenuTreeData = treeData // 权限菜单树数据
  }

  const getAccessByRoles = async (roles: number[]) => {
    const response = await getAccessByRolesApi(roles)

    const { access } = response.data

    const treeData = generateMenuTree([...access])
    state.authMenuTreeData = treeData
    return [...access]
  }

  return { state, getAllMenuList, getAllMenuListByAdmin, getAccessByRoles }
})
