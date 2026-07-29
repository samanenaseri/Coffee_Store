<template>
  <Teleport to="body">
    <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-brown/80 backdrop-blur-[20px] p-4 sm:px-4"
    >
      <!-- Overlay click -->
      <div class="absolute inset-0" @click="close" />

      <!-- Modal -->
      <div class="relative z-10 flex w-full max-w-[95vw] md:max-w-2xl max-h-[90vh] flex-col rounded-lg bg-white shadow-xl notifications">

        <!-- Header -->
        <div class="flex shrink-0 items-center justify-between px-6 py-4 cm-header text-xl font-medium">
          <slot name="header" />

          <button type="button" @click="close">✕</button>
        </div>

        <!-- Body (scrollable) -->
        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6 text-base font-medium overscroll-contain">
          <slot name="body" />
        </div>

        <div class="shrink-0 divider-line mt-2 mx-6"></div>

        <!-- Footer -->
        <div class="flex shrink-0 justify-end gap-3 px-6 pb-6 pt-4">
          <slot name="footer" />
        </div>

      </div>
    </div>
  </Teleport>
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
