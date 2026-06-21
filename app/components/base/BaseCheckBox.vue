<template>
  <div
      class="flex flex-col justify-start gap-1"
      :class="customClass"
  >
    <label
        :for="computedId"
        class="inline-flex items-center gap-2 select-none"
        :class="disabled
        ? 'cursor-not-allowed opacity-60'
        : 'cursor-pointer'
      "
    >
      <span class="relative flex items-center justify-center">
        <input
            :id="computedId"
            ref="inputRef"
            type="checkbox"
            class="peer sr-only"
            :checked="modelValue"
            :disabled="disabled"
            :aria-invalid="Boolean(error)"
            v-bind="attrs"
            @change="onChange"
        />

        <!-- Checkbox box -->
        <span :class="boxClasses">
          <!-- Check icon -->
          <svg
              v-if="modelValue && !indeterminate"
              class="h-3.5 w-3.5 text-lightText"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
          >
            <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>

          <!-- Indeterminate icon -->
          <span
              v-if="indeterminate"
              class="h-[2px] w-3 bg-white"
          />
        </span>
      </span>

      <!-- Label -->
      <span
          v-if="$slots.default || label"
          class="text-base font-medium"
          :class="[
          error
            ? 'text-error-600'
            : 'text-gray-700 dark:text-gray-300',
          labelClass,
        ]"
      >
        <slot>
          {{ label }}
        </slot>
      </span>
    </label>

    <!-- Description -->
    <div
        v-if="description && modelValue"
        class="mt-1 w-full pr-[65px] text-right text-xs font-bold text-white"
    >
      {{ description }}
    </div>

    <!-- Error -->
    <p
        v-if="error"
        class="mt-1 text-xs text-error-600"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  useAttrs,
  useId,
  watch,
} from 'vue'

defineOptions({
  name: 'AppCheckbox',
  inheritAttrs: false,
})

interface AppCheckboxProps {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  error?: string
  indeterminate?: boolean
  id?: string
  labelClass?: string
  description?: string
  customClass?: string
}

const props = withDefaults(
    defineProps<AppCheckboxProps>(),
    {
      modelValue: false,
      label: '',
      disabled: false,
      error: '',
      indeterminate: false,
      id: undefined,
      labelClass: '',
      description: '',
      customClass: '',
    },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean, event: Event]
}>()

const attrs = useAttrs()
const generatedId = useId()

const inputRef = ref<HTMLInputElement | null>(null)

const computedId = computed<string>(() => {
  return props.id ?? `checkbox-${generatedId}`
})

const boxClasses = computed<string[]>(() => {
  const classes = [
    'flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-150',
  ]

  if (props.disabled) {
    classes.push(
        'border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700',
    )
  } else if (props.modelValue || props.indeterminate) {
    classes.push('bg-bg border-bg')
  } else {
    classes.push(
        'border-delivery dark:border-background bg-transparent ',
    )
  }

  if (props.error) {
    classes.push('border-error-600')
  }

  return classes
})

const onChange = (event: Event): void => {
  if (props.disabled) return

  const target = event.target as HTMLInputElement
  const checked = target.checked

  emit('update:modelValue', checked)
  emit('change', checked, event)
}

watch(
    () => props.indeterminate,
    (value: boolean): void => {
      if (inputRef.value) {
        inputRef.value.indeterminate = value
      }
    },
    {
      immediate: true,
    },
)
</script>