<template>
  <button
      :type="type"
      :class="[
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      fullWidth ? 'w-full' : '',
      className,
      { 'cursor-not-allowed disabled-btn opacity-60': disabled || loading },
    ]"
      :disabled="disabled || loading"
      @click="handleClick"
  >
    <span v-if="loading" class="flex items-center gap-2">
      <SpinnerIcon />
    </span>

    <span v-if="startIcon && !loading" class="flex items-center">
      <component :is="startIcon" />
    </span>

    <slot />

    <span v-if="endIcon && !loading" class="flex items-center">
      <component :is="endIcon" />
    </span>
  </button>
</template>

<script setup lang="ts">
import SpinnerIcon from '~/components/ui/SpinnerIcon.vue'
import type { Component } from 'vue'

type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonVariant = 'primary' | 'danger' | 'outline' | 'text' | 'dark'
type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
    defineProps<{
      size?: ButtonSize
      variant?: ButtonVariant
      type?: ButtonType
      startIcon?: Component | null
      endIcon?: Component | null
      className?: string
      disabled?: boolean
      loading?: boolean
      fullWidth?: boolean
    }>(),
    {
      size: 'md',
      variant: 'primary',
      type: 'button',
      startIcon: null,
      endIcon: null,
      className: '',
      disabled: false,
      loading: false,
      fullWidth: false,
    }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300'

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-[11px] text-base',
  lg: 'px-6 py-4 text-lg',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
      'main-button txt-btn shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300',

  danger:
      'button-danger-bg text-white hover:bg-red-700',

  outline:
      'bg-transparent text-text ring-1 ring-inset ring-lightText hover:bg-background',

  text:
      'bg-transparent text-text hover:opacity-80',

  dark:
      'bg-text text-white hover:opacity-90',
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return

  emit('click', event)
}
</script>