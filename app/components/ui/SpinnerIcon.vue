<template>
  <span
      class="inline-block w-4 h-4 border-2 border-t-2 spinner-bg-color rounded-full animate-spin"
      :class="color"
      :style="{
      width: size + 'px',
      height: size + 'px',
    }"
  ></span>
</template>

<script setup lang="ts">
const props = defineProps({
  color: { type: String, default: 'spinner-default-color' },
  size: { type: Number, default: 16 } // رنگ دلخواه اسپینر
});
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>