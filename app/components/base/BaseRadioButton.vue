<template>
  <label
      class="inline-flex items-center gap-1 select-none"
      :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
  >
    <input
        type="radio"
        :value="value"
        :checked="isChecked"
        :name="name"
        :disabled="disabled"
        class="peer sr-only"
        @change="onChange"
    />

    <span
        class="relative flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200"
        :class="[
        'border-text',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ]"
    >
      <span
          class="h-2.5 w-2.5 rounded-full bg-text transition-opacity duration-200"
          :class="isChecked ? 'opacity-100' : 'opacity-0'"
      />
    </span>

    <span
        class="relative flex items-center font-medium text-lightText"
        :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer', className]"
    >
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'AppRadio',
})

type RadioPrimitive = string | number

type RadioObject = Record<string, unknown>

type RadioValue = RadioPrimitive | RadioObject

interface AppRadioProps {
  modelValue?: RadioValue | null
  value: RadioValue
  name?: string
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<AppRadioProps>(), {
  modelValue: null,
  name: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: RadioValue]
}>()

const isChecked = computed<boolean>(() => {
  return props.modelValue === props.value
})

const onChange = (): void => {
  if (props.disabled) return

  emit('update:modelValue', props.value)
}
</script>
