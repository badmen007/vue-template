import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Layout from "@/layout/index.vue"

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: "/documentation",
    component: Layout, // 布局组件作为一级路由
    redirect: "/documentation/index",
    children: [
      {
        path: "index",
        name: "Documentation",
        component: () =>
          import(
            /* webpackChunkName: "documentation" */ "@/views/documentation/index.vue"
          ),
        meta: {
          title: "Documentation",
          icon: "documentation"
        }
      }
    ]
  },
  {
    path: "/guide",
    component: Layout,
    redirect: "/guide/index",
    children: [
      {
        path: "index",
        name: "Guide",
        component: () =>
          import(/* webpackChunkName: "guide" */ "@/views/guide/index.vue"),
        meta: {
          title: "Guide",
          icon: "guide",
          // 默认加载Guide时，/documentation/index高亮显示
          activeMenu: "/documentation/index"
        }
      }
    ]
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/user",
    meta: {
      title: "System",
      icon: "lock"
    },
    children: [
      {
        path: "menu",
        name: "Menu Management",
        component: () =>
          import(
            /* webpackChunkName: "menu" */ "@/views/system/menu/index.vue"
          ),
        meta: {
          title: "Menu Management"
        }
      },
      {
        path: "role",
        name: "Role Management",
        component: () =>
          import(
            /* webpackChunkName: "role" */ "@/views/system/role/index.vue"
          ),
        meta: {
          title: "Role Management"
        }
      },
      {
        path: "user",
        name: "User Management",
        component: () =>
          import(
            /* webpackChunkName: "user" */ "@/views/system/user/index.vue"
          ),
        meta: {
          title: "User Management"
        }
      }
    ]
  },
  {
    // 外链路由
    path: "/external-link",
    component: Layout,
    children: [
      {
        path: "http://www.zhufengpeixun.com/",
        redirect: "/",
        meta: {
          title: "External Link",
          icon: "link"
        }
      }
    ]
  },
  {
    // 这里我们将匹配全部路由，放到异步路由中。
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    meta: {
      hidden: true
    }
  }
]

const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "@/views/dashboard/index.vue"
          ),
        meta: {
          title: "Dashboard",
          icon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        // 带参数的动态路由正则匹配 文档说明
        // https://next.router.vuejs.org/zh/guide/essentials/route-matching-syntax.html#%E5%8F%AF%E9%87%8D%E5%A4%8D%E7%9A%84%E5%8F%82%E6%95%B0
        path: "/redirect/:path(.*)", // 要匹配多级路由 应该加*号
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true // 404 hidden掉
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue")
  },
  {
    path: "/profile",
    component: Layout,
    redirect: "/profile/index",
    name: "ProfileLayout",
    children: [
      {
        path: "index",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: {
          hidden: true,
          title: "个人中心"
        }
      }
    ]
  }
]
export const routes = constantRoutes // 默认只绑定常量路由

export default createRouter({
  history: createWebHistory(),
  routes
})
