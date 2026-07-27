<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">تنظیمات سئو</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>

    <template v-else>
      <!-- General SEO -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-search-line text-amber-600"></i>
          تنظیمات کلی سئو
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">آدرس سایت</label>
            <InputText v-model="form.site_url" class="w-full" placeholder="https://example.com" dir="ltr" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان پیش‌فرض صفحات</label>
            <InputText v-model="form.default_meta_title" class="w-full" placeholder="عنوان پیش‌فرض برای صفحات بدون عنوان سئو" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات پیش‌فرض صفحات</label>
            <Textarea v-model="form.default_meta_description" class="w-full" rows="3" placeholder="توضیحات پیش‌فرض برای صفحات بدون توضیحات سئو" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر پیش‌فرض OG</label>
            <p class="text-xs text-gray-400 mb-2">تصویری که هنگام اشتراک‌گذاری صفحات در شبکه‌های اجتماعی نمایش داده می‌شود</p>
            <div class="flex gap-2">
              <InputText v-model="form.default_og_image" class="flex-1" placeholder="/images/og-image.jpg" />
              <label class="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2 transition-colors">
                <i class="pi pi-upload"></i>
                <span class="text-sm">آپلود</span>
                <input type="file" accept="image/*" class="hidden" @change="uploadOgImage" />
              </label>
            </div>
            <div v-if="form.default_og_image" class="mt-2">
              <img :src="mediaUrl(form.default_og_image)" :key="form.default_og_image" alt="OG Image" class="h-20 w-auto border rounded-lg" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">فاوآیکون سایت (Favicon)</label>
            <p class="text-xs text-gray-400 mb-2">
              آیکون تب مرورگر. بهتر است PNG یا ICO باشد (حداقل ۳۲×۳۲). بعد از آپلود «ذخیره تنظیمات» را بزنید.
            </p>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div v-if="form.site_favicon" class="relative shrink-0">
                <img
                  :src="mediaUrl(form.site_favicon)"
                  :key="form.site_favicon"
                  alt="Favicon"
                  class="h-16 w-16 object-contain border rounded-lg p-2 bg-gray-50"
                />
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="danger"
                  rounded
                  class="absolute -top-2 -left-2"
                  @click="form.site_favicon = ''"
                />
              </div>
              <div class="flex-1 flex flex-col gap-2 sm:flex-row sm:items-center">
                <InputText
                  v-model="form.site_favicon"
                  class="w-full"
                  placeholder="/favicon.ico یا آدرس آپلود"
                  dir="ltr"
                />
                <label class="cursor-pointer shrink-0 bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center justify-center gap-2 transition-colors">
                  <i class="pi pi-upload"></i>
                  <span class="text-sm">آپلود</span>
                  <input
                    type="file"
                    accept="image/*,.ico,image/x-icon,image/vnd.microsoft.icon"
                    class="hidden"
                    @change="uploadFavicon"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-line-chart-line text-amber-600"></i>
          ابزارهای تحلیلی
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">شناسه Google Analytics</label>
            <InputText v-model="form.google_analytics_id" class="w-full" placeholder="G-XXXXXXXXXX" dir="ltr" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">شناسه Google Search Console</label>
            <InputText v-model="form.google_search_console_id" class="w-full" placeholder="xxxxxxxxxx" dir="ltr" />
          </div>
        </div>
      </div>

      <!-- SEO Tips -->
      <div class="bg-amber-50 rounded-xl border border-amber-200 p-6">
        <h2 class="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
          <i class="ri-lightbulb-line"></i>
          نکات سئو
        </h2>
        <ul class="space-y-2 text-sm text-amber-700">
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5"></i>
            <span>عنوان meta باید بین ۳۰ تا ۶۰ کاراکتر باشد</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5"></i>
            <span>توضیحات meta باید بین ۱۲۰ تا ۱۶۰ کاراکتر باشد</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5"></i>
            <span>تصویر OG باید ابعاد ۱۲۰۰×۶۳۰ پیکسل داشته باشد</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5"></i>
            <span>هر صفحه باید عنوان meta و توضیحات meta منحصر به فرد داشته باشد</span>
          </li>
        </ul>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <Button
          label="ذخیره تنظیمات"
          icon="pi pi-check"
          :loading="saving"
          @click="saveSettings"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import api, { uploadAdminFile } from '@/composables/useAdminApi'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const toast = useToast()

/** Resolve /storage/* so admin preview loads from Laravel. */
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1')
  .replace(/\/api\/v1\/?$/i, '')
  .replace(/\/api\/?$/i, '')
  .replace(/\/$/, '')

function mediaUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (
    trimmed.startsWith('http://')
    || trimmed.startsWith('https://')
    || trimmed.startsWith('blob:')
    || trimmed.startsWith('data:')
  ) {
    return trimmed
  }
  if (trimmed.startsWith('/')) return API_ORIGIN + trimmed
  return trimmed
}

const loading = ref(true)
const saving = ref(false)

const form = ref({
  site_url: '',
  default_meta_title: '',
  default_meta_description: '',
  default_og_image: '',
  site_favicon: '',
  google_analytics_id: '',
  google_search_console_id: '',
})

onMounted(() => {
  fetchSettings()
})

async function fetchSettings() {
  loading.value = true
  try {
    const res = await api.get('/admin/settings')
    const data = res.data
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      for (const [key, value] of Object.entries(data)) {
        if (key in form.value && typeof value === 'string') {
          ;(form.value as any)[key] = value
        }
      }
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری تنظیمات انجام نشد', life: 3000 })
    console.error('Settings load error:', e)
  } finally {
    loading.value = false
  }
}

async function saveSettings() {
  saving.value = true
  try {
    const raw: Record<string, any> = { ...form.value }
    const payload: Record<string, string> = {}
    for (const [key, value] of Object.entries(raw)) {
      payload[key] = value == null ? '' : String(value)
    }
    await api.put('/admin/settings', { settings: payload })
    toast.add({ severity: 'success', summary: 'موفق', detail: 'تنظیمات سئو با موفقیت ذخیره شد', life: 3000 })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'ذخیره تنظیمات انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
    console.error('Settings save error:', e)
  } finally {
    saving.value = false
  }
}

async function uploadOgImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const result = await uploadAdminFile(file, 'seo', { keepOriginal: true })
    form.value.default_og_image = result.url
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: 'تصویر OG آپلود شد. حتماً «ذخیره تنظیمات» را بزنید.',
      life: 4000,
    })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'آپلود تصویر انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
  }
  input.value = ''
}

async function uploadFavicon(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    // Keep original format (png / ico / svg) — no convert to jpeg
    const result = await uploadAdminFile(file, 'favicon', { keepOriginal: true })
    form.value.site_favicon = result.url
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: 'فاوآیکون آپلود شد. حتماً «ذخیره تنظیمات» را بزنید.',
      life: 4000,
    })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'آپلود فاوآیکون انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
  }
  input.value = ''
}
</script>
