<template>
  <div class="right-panel">
    <el-drawer
      :model-value="modelValue"
      :direction="direction"
      :show-close="showClose"
      :custom-class="customClass"
      :with-header="withHeader"
      :title="title"
      :size="size"
      @close="handleClose"
    >
      <slot />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  direction: {
    type: String,
    validator(val: string) {
      return ["rtl", "ltr", "ttb", "btt"].includes(val)
    },
    default: "rtl"
  },
  title: {
    type: String,
    default: "自定义title"
  },
  size: {
    type: [String, Number]
  },
  customClass: {
    type: String,
    default: "setting-panel"
  },
  showClose: {
    type: Boolean,
    default: true
  },
  withHeader: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(["update:modelValue", "close"])
const handleClose = () => {
  emit("update:modelValue", false)
  emit("close")
}
</script>
