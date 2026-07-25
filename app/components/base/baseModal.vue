<template>
  <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-brown/80 backdrop-blur-[20px] px-4"
  >
    <div class="w-full max-w-[95vw] md:max-w-2xl rounded-lg bg-white shadow-xl notifications">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 cm-header text-xl font-medium">
        <slot name="header" />

        <button type="button" @click="close">✕</button>
      </div>

      <!-- Body -->
      <div class="py-6 text-base font-medium">
        <slot name="body" />
      </div>

      <div class="divider-line mt-6 mx-6"></div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 px-6 pb-6 pt-4">
        <slot name="footer" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const close = () => {
  emit('update:modelValue', false)
}
</script>
