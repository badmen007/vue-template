<template>
  <div class="editor-container">
    <el-form
      ref="editFormRef"
      :model="editData"
      :rules="menuFormRules"
      label-width="100px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="editData.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="说明" prop="description">
        <el-input v-model="editData.description" placeholder="请输入说明" />
      </el-form-item>
      <el-form-item label="是否默认角色" prop="is_default">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="editData.is_default"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitMenuForm" :loading="loading"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import { ElForm } from "element-plus"
import { IRole } from "@/api/config/role"

type FormInstance = InstanceType<typeof ElForm>

const emit = defineEmits(["submit"])
const props = defineProps({
  type: {
    type: Number,
    required: true
  },
  data: {
    type: Object as PropType<IRole>
  }
})

const loading = ref(false)
const editFormRef = ref<FormInstance | null>(null)
const editData = ref({
  name: "",
  description: "",
  is_default: false
})

// 验证规则
const menuFormRules = {
  name: {
    required: true,
    message: "请输入角色名称",
    trigger: "blur"
  },
  description: {
    required: true,
    message: "请输入说明",
    trigger: "blur"
  }
}

const defaultProps = {
  name: "",
  description: "",
  is_default: false
}

watchEffect(() => {
  // 利用watchEffect自动响应依赖变化
  if (props.data) {
    // 移除之前表单效验结果
    editFormRef.value?.clearValidate()
    editData.value = { ...defaultProps, ...props.data }
  }
})

// 提交编辑菜单
const submitMenuForm = () => {
  ;(editFormRef.value as FormInstance).validate((valid) => {
    if (valid) {
      emit("submit", editData.value)
    }
  })
}
console.log(editData)
</script>

<style>
.editor-container {
  padding: 20px;
}
</style>
