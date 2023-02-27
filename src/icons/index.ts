import { App } from "vue"
import SvgIcon from "@/components/SvgIcon/index.vue"

export default (app: App) => {
  // 全局注册svg-icon组件
  app.component("svg-icon", SvgIcon)
}
