<template>
  <button
      :class="[
      'inline-flex items-center justify-center font-medium gap-2 rounded-lg transition',
      sizeClasses[size],
      variantClasses[variant],
      className,
         { 'cursor-not-allowed disabled-btn': disabled || loading },
    ]"
      @click="handleClick"
      :disabled="disabled || loading"
  >
      <span v-if="loading" class="flex items-center gap-2">
      <SpinnerIcon/>
     </span>

    <span v-if="startIcon" class="flex items-center">
      <component :is="startIcon"/>
    </span>

    <slot></slot>

    <span v-if="endIcon" class="flex items-center">
      <component :is="endIcon"/>
    </span>
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import SpinnerIcon from "~/components/ui/SpinnerIcon.vue";

type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonVariant = 'primary' | 'danger' | 'outline'

const props = withDefaults(
    defineProps<{
      size?: ButtonSize
      variant?: ButtonVariant
      startIcon?: object | null
      endIcon?: object | null
      onClick?: (() => void) | null
      className?: string
      disabled?: boolean
      loading?: boolean
    }>(),
    {
      size: 'md',
      variant: 'primary',
      startIcon: null,
      endIcon: null,
      onClick: null,
      className: '',
      disabled: false,
      loading: false,
    }
)

// کلاس‌های اندازه
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-[6px] text-[16px]',
  md: 'px-5 py-[11px] text-[18px]',
  lg: 'px-5 py-[17px] text-[20px]',
}

// کلاس‌های variant
const variantClasses: Record<ButtonVariant, string> = {
  primary:
      'main-button txt-btn shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300',

  danger:
      'button-danger-bg text-white hover:bg-red-700',

  outline:
      'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
}

// هندلر کلیک
const handleClick = () => {
  if (!props.disabled && props.onClick) {
    props.onClick()
  }
}

// کلاس نهایی
const buttonClass = computed(() => {
  return `${sizeClasses[props.size]} ${variantClasses[props.variant]} ${props.className}`
})
</script>