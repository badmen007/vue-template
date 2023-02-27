import { defineStore } from "pinia"
import {
  getUsers as getUsersApi,
  addUser as addUserApi,
  removeUser as removeUserApi,
  getUserInfo as getUserInfoApi,
  updateUser as updateUserApi,
  login as loginApi
} from "@/api/config/user"
import type { IUserQuery, IUsers, Profile, Role } from "@/api/config/user"
import { removeToken, setToken } from "@/utils/auth"
import { useTagsView } from "./tagsView"
// login params
export interface IUserInfo {
  username: string
  password: string
}

export type IProfileQuery = Profile & {
  pageNum?: number
  pageSize?: number
}
export const useUserStore = defineStore("user", () => {
  // 状态
  const state = reactive({
    token: "",
    userInfo: null as Profile | null,
    users: [] as IUsers["users"],
    count: 0,
    roles: null as Role[] | null
  })
  const login = async (userInfo: IUserInfo) => {
    try {
      const { username, password } = userInfo
      const response = await loginApi({ username: username.trim(), password })
      const { data } = response
      state.token = data.token
      setToken(data.token)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  const { delAllView } = useTagsView()
  const logout = () => {
    // 清空store里token
    state.token = ""
    // 清空localStorage里的token
    removeToken()
    // 清除所有tag views
    delAllView()
  }

  const resetToken = () => {
    // 清空store里token
    state.token = ""
    // 清空localStorage里的token
    removeToken()
  }

  // 获取全部用户
  const getAllUsers = async (params: IUserQuery) => {
    const res = await getUsersApi(params)
    const { data } = res
    state.users = data.users
    state.count = data.count
  }
  // 添加用户
  const addUser = async (data: IProfileQuery) => {
    const { pageSize, pageNum, ...params } = data
    const res = await addUserApi(params)
    if (res.code === 0) {
      getAllUsers({
        pageSize,
        pageNum
      })
    }
  }
  // 编辑用户
  const editUser = async (data: IProfileQuery) => {
    const { pageSize, pageNum, ...params } = data
    const res = await updateUserApi(params.id, params)
    if (res.code === 0) {
      getAllUsers({
        pageSize,
        pageNum
      })
    }
  }

  // 删除用户
  const removeUser = async (data: IProfileQuery) => {
    const { pageSize, pageNum, id } = data
    const res = await removeUserApi(id)
    if (res.code === 0) {
      getAllUsers({
        pageSize,
        pageNum
      })
    }
  }
  // 获取用户
  const getUserInfo = async () => {
    const res = await getUserInfoApi()
    const { data } = res
    const { roles, ...info } = data
    state.userInfo = info as Profile
    state.roles = roles
  }
  return {
    state,
    login,
    logout,
    resetToken,
    getAllUsers, // 获取所有用户
    addUser, // 添加用户
    editUser, // 编辑用户
    removeUser, // 删除用户
    getUserInfo // 获取用户信息
  }
})
