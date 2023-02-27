<template>
  <div>
    <button @click="handClick">计数器</button>
    <span>{{ counter.count }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useCounterStore } from "@/stores/counter"

const counter = useCounterStore()
const handClick = () => {
  counter.increment()
}
</script>
