<template>
  <div>
    <h1>Dashboard page</h1>
    <svg-icon icon-class="bug"></svg-icon>
    <svg-icon
      icon-class="404"
      class-name="custom-class"
      @click="sayHi"
    ></svg-icon>
    <br />
    <br />
    <br />

    缓存测试 <input type="text" />
    <el-button v-permission="['super_admin']">按钮</el-button>
  </div>
</template>

<script setup lang="ts">
// import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance()!
const sayHi = () => {
  proxy?.$message.success("恭喜你，这是一条成功消息")
}
defineOptions({ name: "Dashboard" })
</script>
<style lang="scss">
.custom-class {
  // 自定义样式404
  font-size: 200px;
  color: green;
}
</style>
