<template>
  <div class="login-container">
    <el-form
      class="login-form"
      :model="loginForm"
      :rules="loginRules"
      ref="loginFormRef"
    >
      <div class="admin-logo">
        <img class="logo" src="../../assets/vue.svg" alt="logo" />
        <h1 class="name">Vue3 Admin</h1>
      </div>
      <el-form-item prop="username">
        <el-input
          placeholder="请输入用户名"
          v-model="loginForm.username"
          ref="usernameRef"
          autocomplete="off"
          tabindex="1"
        >
          <template #prepend>
            <span class="svg-container">
              <svg-icon icon-class="user"></svg-icon>
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          placeholder="请输入密码"
          show-password
          v-model="loginForm.password"
          autocomplete="off"
          tabindex="2"
        >
          <template #prepend>
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
          </template>
        </el-input>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        :loading="loading"
        @click="handleLogin"
        >Login</el-button
      >
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import useRouteQuery from "@/hook/useRouteQuery"
import { useUserStore } from "@/stores/user"
import { FormInstance } from "element-plus"
const { redirect, otherQuery } = useRouteQuery()

const loading = ref(false)
// form ref
const loginFormRef = ref<FormInstance | null>(null)
// form username ref
const usernameRef = ref<HTMLInputElement | null>(null)
// form password ref
const passwordRef = ref<HTMLInputElement | null>(null)
// 登录所需信息
const loginState = reactive({
  loginForm: {
    username: "",
    password: ""
  },
  loginRules: {
    username: [
      {
        required: true,
        trigger: "blur",
        message: "请输入用户名！"
      }
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: "请输入密码！"
      }
    ]
  }
})
const userStore = useUserStore()
const router = useRouter()
const { proxy } = getCurrentInstance()!
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginState.loginForm)
        proxy?.$message.success("登录成功")
        router.push({ path: redirect.value || "/", query: otherQuery.value })
      } finally {
        loading.value = false
      }
    } else {
      console.log("error submit")
    }
  })
}
// 解构
const { loginForm, loginRules } = toRefs(loginState)

// 自动获取焦点
onMounted(() => {
  if (loginState.loginForm.username === "") {
    usernameRef.value?.focus()
  } else if (loginState.loginForm.password === "") {
    passwordRef.value?.focus()
  }
})
</script>
<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
.login-container {
  .el-form-item {
    .el-input {
      height: 40px;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  .login-form {
    position: relative;
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
    padding: 140px 35px 0;
    overflow: hidden;
    box-sizing: border-box;
    .admin-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      .logo {
        width: 60px;
        height: 60px;
      }
      .name {
        font-weight: normal;
        margin-left: 10px;
      }
    }
  }
}
</style>
