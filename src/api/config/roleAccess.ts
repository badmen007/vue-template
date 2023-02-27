import request from "@/api/config/request"
import { MenuData } from "./menu"
import { ApiResponse } from "../type"
import { IRole } from "./role"

export interface IRoleAccess {
  id: number
  role_id: number
  access_id: number
}

export type IRoleAccessList = IRoleAccess[]

/**
 * 根据角色分配权限
 * @param id 角色id
 * @param data 权限id列表
 */
export const allocRoleAccess = (
  id: number,
  data: number[]
): Promise<ApiResponse> => {
  return request.post(`/role_access/${id}`, {
    access: data
  })
}

/**
 * 根据角色获取权限
 * @param id 角色id
 * @param data 权限id列表
 */
export const getRoleAccess = (
  id: number
): Promise<ApiResponse<IRoleAccessList>> => {
  return request.get(`/role_access/${id}`)
}

// 根据用户角色获取用户菜单
type RolesAccess = MenuData & {
  roles: IRole[]
}

interface ApiRolesAccess {
  access: RolesAccess[]
}
export const getAccessByRoles = (
  roles: number[]
): Promise<ApiResponse<ApiRolesAccess>> => {
  return request.post("/role_access/role/access", {
    roles
  })
}
