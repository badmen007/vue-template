import { ObjectDirective, DirectiveBinding, App } from "vue"
import { useUserStore } from "@/stores/user"

export interface IDirectiveOptionsWithInstall extends ObjectDirective {
  install?: (app: App) => void
}

const checkPermission = (el: HTMLElement, binding: DirectiveBinding) => {
  const { value } = binding

  const store = useUserStore()
  const roles = computed(() => store.state.roles?.map((item) => item.name))

  if (value && Array.isArray(value)) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.value?.some((role: string) =>
        permissionRoles.includes(role)
      )

      if (!hasPermission) {
        // 指令权限缺点 移除Dom后 无法恢复
        return el.parentNode?.removeChild(el)
      }
    } else {
      // eslint-disable-next-line
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}

// 默认相当于 mounted and updated
const plugin = (el: HTMLElement, binding: DirectiveBinding) => {
  checkPermission(el, binding)
}

export default plugin as IDirectiveOptionsWithInstall
