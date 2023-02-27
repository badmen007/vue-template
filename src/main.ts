import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"
import { createPinia } from "pinia"
import "normalize.css/normalize.css"
import "@/styles/index.scss"

import initSvgIcon from "@/icons/index"
import "virtual:svg-icons-register"

// 注册element-plus
import installElementPlus from "./plugins/element"

import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
// 权限指令
import permissionDirective from "./directive/permission/index"

import "./permission"
const pinia = createPinia()
const app = createApp(App)
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
// 安装element-plus插件
app.use(installElementPlus)
app.use(permissionDirective) // 注册权限指令
app.use(router)
app.use(initSvgIcon)
app.mount("#app")
