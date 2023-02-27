import request from "./request"
import { ApiResponse } from "../type"

export interface MenuData {
  id: number
  title: string
  path: string
  name: string
  icon: string
  parent_id: string | number
  sort_id: number
}

// 添加新菜单
export const addNewMenu = (
  data: Omit<MenuData, "id">
): Promise<ApiResponse> => {
  return request.post("/access/menu", data)
}

// 获取全部菜单
export const getAllMenus = (): Promise<ApiResponse<MenuData[]>> => {
  return request.get("/access/menu")
}

// 删除指定菜单
export const removeMenuByID = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/access/menu/${id}`)
}

// 更新指定菜单
type UpdateMenuData = Omit<MenuData, "id" | "parent_id" | "sort_id">
export const updateMenuByID = (
  id: number,
  data: UpdateMenuData
): Promise<ApiResponse<null>> => {
  return request.put(`/access/menu/${id}`, data)
}

// 批量更新菜单
export const updateBulkMenu = (
  data: MenuData[]
): Promise<ApiResponse<null>> => {
  return request.patch("/access/menu/update", {
    access: data
  })
}
