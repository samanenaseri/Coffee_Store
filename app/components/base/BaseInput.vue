<template>
  <div class="flex flex-col gap-1" :class="wrapperClass">
    <label v-if="label" :for="id" class="text-sm font-semibold txt-label">
      {{ label }}
    </label>

    <div class="relative w-full">
      <input
          :value="modelValue"
          :type="type"
          :id="id"
          :placeholder="placeholder"
          @input="onInput"
          @focus="isFocused = true"
          @blur="handleBlur"
          :class="inputClasses"
          :disabled="disabled"
      />

      <div
          v-if="tooltip"
          v-show="isFocused"
          class="absolute bottom-full right-0 mb-2 button-danger-bg text-white text-xs px-3 py-2 rounded-md max-w-sm leading-5 shadow-lg z-50"
      >
        {{ tooltip }}
      </div>
    </div>

    <div class="flex" v-if="error">
      <RiAlertFill class="text-red-600 size-5" />
      <p class="font-semibold text-xs text-color-error mt-1">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RiAlertFill } from '@remixicon/vue'

const props = withDefaults(
    defineProps<{
      modelValue?: string | number
      label?: string
      type?: string
      id?: string
      placeholder?: string
      error?: string
      customClass?: string
      disabled?: boolean
      tooltip?: string
      wrapperClass?: string
    }>(),
    {
      type: 'text',
      tooltip: '',
      wrapperClass: 'w-full',
    }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const isFocused = ref(false)

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

const inputClasses = computed(() => [
  'h-10 rounded-[8px] bg-select-btn px-3 py-2 text-input main-input transition-colors duration-200 input-focus-warning w-full',
  'placeholder-gray-400 input-placeholder focus:outline-none ' + (props.customClass || ''),
  props.error
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 input-hover-warning ' + (props.customClass || ''),
])
</script>