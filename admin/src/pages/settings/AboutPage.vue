<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">تنظیمات صفحه درباره ما</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>

    <template v-else>
      <!-- About Content -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-information-line text-amber-600"></i>
          محتوای صفحه درباره ما
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان صفحه</label>
            <InputText v-model="form.about_title" class="w-full" placeholder="درباره ما" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
            <Textarea v-model="form.about_description" class="w-full" rows="8" placeholder="توضیحات درباره فروشگاه" />
          </div>
        </div>
      </div>

      <!-- About Images -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-image-line text-amber-600"></i>
          تصاویر صفحه درباره ما
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر اصلی</label>
            <p class="text-xs text-gray-400 mb-2">تصویر بزرگ در سمت چپ صفحه — فقط آپلود از سیستم</p>
            <ImageUploader v-model="form.about_main_image" folder="about" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر فرعی</label>
            <p class="text-xs text-gray-400 mb-2">تصویر کوچکتر در گوشه پایین — فقط آپلود از سیستم</p>
            <ImageUploader v-model="form.about_second_image" folder="about" />
          </div>
        </div>
      </div>

      <!-- Staff Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-team-line text-amber-600"></i>
          بخش تیم ما
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان بخش</label>
            <InputText v-model="form.about_staff_heading" class="w-full" placeholder="تیم ما" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">زیرعنوان بخش</label>
            <InputText v-model="form.about_staff_description" class="w-full" placeholder="با اعضای حرفه‌ای آشنا شوید" />
          </div>

          <p class="text-xs text-gray-400">
            <router-link to="/staff" class="text-amber-600 hover:underline">مدیریت اعضا در بخش کارکنان</router-link>
          </p>
        </div>
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
import api from '@/composables/useAdminApi'
import ImageUploader from '@/components/ui/ImageUploader.vue'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const toast = useToast()

const loading = ref(true)
const saving = ref(false)

const form = ref({
  about_title: '',
  about_description: '',
  about_main_image: '',
  about_second_image: '',
  about_staff_heading: '',
  about_staff_description: '',
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
    } else if (Array.isArray(data)) {
      for (const item of data) {
        if (item.key in form.value) {
          ;(form.value as any)[item.key] = item.value ?? ''
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
    toast.add({ severity: 'success', summary: 'موفق', detail: 'تنظیمات با موفقیت ذخیره شد', life: 3000 })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'ذخیره تنظیمات انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
  } finally {
    saving.value = false
  }
}
</script>
