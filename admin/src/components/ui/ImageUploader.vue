<template>
  <div class="space-y-3">
    <div
      class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer"
      :class="isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400'"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="!uploading && fileInput?.click()"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        class="hidden"
        @change="handleFileSelect"
      />
      <div v-if="uploading" class="space-y-2">
        <i class="pi pi-spin pi-spinner text-2xl text-amber-600"></i>
        <p class="text-sm text-gray-500">در حال آپلود...</p>
      </div>
      <div v-else class="space-y-2">
        <i class="pi pi-cloud-upload text-3xl text-gray-400"></i>
        <p class="text-sm text-gray-600">فایل را اینجا رها کنید یا کلیک کنید</p>
        <p class="text-xs text-gray-400">
          jpg, png, webp, gif, svg — فرمت اصلی فایل حفظ می‌شود
        </p>
      </div>
    </div>

    <div v-if="modelValue" class="relative inline-block">
      <img
        :src="previewSrc"
        alt="پیش‌نمایش"
        class="w-32 h-32 object-cover rounded-lg border border-gray-200"
        @error="onImageError"
      />
      <button
        type="button"
        class="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
        @click.stop="$emit('update:modelValue', '')"
      >
        <i class="pi pi-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { uploadAdminFile } from '@/composables/useAdminApi'

const props = withDefaults(defineProps<{
  modelValue: string
  folder?: string
  accept?: string
  maxSizeMB?: number
}>(), {
  folder: 'uploads',
  accept: 'image/*,.svg,image/svg+xml,.jpg,.jpeg,.png,.gif,.webp,.bmp',
  maxSizeMB: 40,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const toast = useToast()
const isDragging = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1')
  .replace(/\/api\/v1\/?$/, '')

const previewSrc = computed(() => {
  const url = props.modelValue
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url
  }
  if (url.startsWith('/')) {
    return API_ORIGIN + url
  }
  return url
})

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) uploadFile(file)
  target.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  const okType =
    file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(file.name)
  if (!okType) {
    toast.add({ severity: 'warn', summary: 'خطا', detail: 'فقط فایل تصویری (شامل svg) مجاز است', life: 3000 })
    return
  }
  uploadFile(file)
}

async function uploadFile(file: File) {
  const maxBytes = props.maxSizeMB * 1024 * 1024
  const isSvg =
    file.type === 'image/svg+xml' ||
    file.type === 'image/svg' ||
    /\.svg$/i.test(file.name)

  // Only hard-block huge sources; raster images are compressed first inside uploadAdminFile
  if (file.size > maxBytes) {
    toast.add({
      severity: 'warn',
      summary: 'خطا',
      detail: `حجم فایل بیشتر از ${props.maxSizeMB} مگابایت است`,
      life: 4000,
    })
    return
  }

  // SVG is not compressed — keep a sensible cap
  if (isSvg && file.size > 5 * 1024 * 1024) {
    toast.add({
      severity: 'warn',
      summary: 'خطا',
      detail: 'حجم فایل SVG بیشتر از ۵ مگابایت است',
      life: 4000,
    })
    return
  }

  uploading.value = true
  try {
    const result = await uploadAdminFile(file, props.folder, { keepOriginal: true })
    emit('update:modelValue', result.url)
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: file.size > 2 * 1024 * 1024
        ? 'تصویر فشرده و آپلود شد'
        : 'تصویر آپلود شد',
      life: 3000,
    })
  } catch (e: any) {
    const detail =
      e?.response?.data?.message ||
      e?.response?.data?.errors?.file?.[0] ||
      e?.message ||
      'آپلود تصویر انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 6000 })
    console.error('Upload failed:', e)
  } finally {
    uploading.value = false
  }
}

function onImageError(e: Event) {
  ;(e.target as HTMLImageElement).style.display = 'none'
}
</script>
