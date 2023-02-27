import request from "@/api/config/request"
import { ApiResponse } from "../type"
export interface IRole {
  id: number
  name: string
  description: string
  is_default: boolean
  createdAt: string
  updatedAt: string
}
// 定义state类型
export interface IRoleState {
  roles: IRole[]
  count: number
}

// 获取角色
export interface RoleParams {
  pageNum: number
  pageSize: number
}

export const getRoles = (
  params = { pageNum: 0, pageSize: 10 }
): Promise<ApiResponse<IRoleState>> => {
  return request.get("/role", {
    params
  })
}

// 删除角色
export const removeRole = (id: number): Promise<ApiResponse> => {
  return request.delete(`/role/${id}`)
}

// 添加角色
export const addRole = (data: IRole): Promise<ApiResponse> => {
  return request.post("/role", data)
}

// 编辑角色
export const updateRole = (id: number, data: IRole): Promise<ApiResponse> => {
  return request.put(`/role/${id}`, data)
}
