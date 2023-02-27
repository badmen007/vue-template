import { IRole, RoleParams } from "@/api/config/role"
import { defineStore } from "pinia"
import {
  getRoles as getRolesApi,
  addRole as addRoleApi,
  updateRole as updateRoleApi,
  removeRole as removeRoleApi
} from "@/api/config/role"
import { Role } from "@/api/config/user"

export type ActionRoleParams = IRole & {
  pageSize: number
  pageNum: number
}
export const useRoleStore = defineStore("role", () => {
  // 状态
  const state = reactive({
    roles: [] as Role[],
    count: 0
  })
  // 获取角色
  const getRoles = async (params: RoleParams) => {
    const res = await getRolesApi(params)
    const { data } = res
    state.roles = data.roles
    state.count = data.count
  }
  // 添加角色
  const addRole = async (data: ActionRoleParams) => {
    const { pageSize, pageNum, ...params } = data
    const res = await addRoleApi(params)
    if (res.code === 0) {
      getRoles({ pageSize, pageNum })
    }
  }
  // 编辑角色
  const editRole = async (data: ActionRoleParams) => {
    const { pageSize, pageNum, ...params } = data
    const res = await updateRoleApi(params.id, params)
    if (res.code === 0) {
      getRoles({ pageSize, pageNum })
    }
  }
  const removeRole = async (data: ActionRoleParams) => {
    const { pageSize, pageNum, id } = data
    const res = await removeRoleApi(id)
    if (res.code === 0) {
      getRoles({ pageSize, pageNum })
    }
  }
  return { state, getRoles, addRole, editRole, removeRole }
})
