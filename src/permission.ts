import router from "@/router"
import { ElMessage } from "element-plus"
import nProgress from "nprogress"
import "nprogress/nprogress.css" // progress bar style
import { usePermissionStore } from "./stores/permission"
import { useUserStore } from "./stores/user"
import { getToken } from "./utils/auth"

nProgress.configure({ showSpinner: false })

const whiteList = ["/login"] // 白名单
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  nProgress.start()
  const hasToken = getToken()

  if (hasToken) {
    // 有token代表已登录
    if (to.path === "/login") {
      nProgress.done()
      return {
        path: "/",
        replace: true
      }
    } else {
      try {
        const hasRoles =
          userStore.state.roles && userStore.state.roles.length > 0

        if (hasRoles) {
          // 有权限
          nProgress.done()
          return true
        }
        // 无用户信息和角色信息 就请求获取
        await userStore.getUserInfo()

        const roles = userStore.state.roles
        // 该用户未分配角色 进行异常提示
        if (!roles || roles.length === 0) {
          throw new Error("该用户未分配角色")
        }

        // 获取权限路由
        const accessRoutes = await permissionStore.generateRoutes()

        // 动态注册路由

        accessRoutes.forEach(router.addRoute)

        return router.push(to.path)

        // return to.path
        // router.push(to.path)
        // 触发重定向
      } catch (error: any) {
        await userStore.resetToken()
        ElMessage.error("登录失败：" + (error.message || "Has Error"))
        nProgress.done()
        return `/login?redirect=${to.path}`
      }
      // 有token 看下是否获取过权限
    }
  } else {
    // 没token 返回login
    if (whiteList.includes(to.path)) {
      nProgress.done()
      return true
    }
    nProgress.done()
    return {
      path: "/login",
      query: {
        redirect: to.path,
        ...to.query
      }
    }
  }
})

router.afterEach(() => {
  nProgress.done()
})
