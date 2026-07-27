<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">تنظیمات صفحه تماس با ما</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>

    <template v-else>
      <!-- Hero Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-layout-top-line text-amber-600"></i>
          بخش بالای صفحه (Hero)
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان صفحه</label>
            <InputText v-model="form.contact_title" class="w-full" placeholder="تماس با ما" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات بالای صفحه</label>
            <Textarea v-model="form.contact_hero_description" class="w-full" rows="3" placeholder="توضیحات تماس" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر بالای صفحه</label>
            <div v-if="form.contact_hero_image" class="relative mb-2">
              <img :src="form.contact_hero_image" alt="تصویر hero" class="h-32 object-cover rounded-lg border" />
              <Button icon="pi pi-times" severity="danger" rounded class="absolute top-2 left-2" @click="form.contact_hero_image = ''" />
            </div>
            <div class="flex gap-2">
              <InputText v-model="form.contact_hero_image" class="flex-1" placeholder="آدرس تصویر" />
              <label class="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2 transition-colors">
                <i class="pi pi-upload"></i>
                <input type="file" accept="image/*" class="hidden" @change="(e) => uploadImage(e, 'contact_hero_image')" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Info Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-phone-line text-amber-600"></i>
          بخش اطلاعات تماس
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان بخش</label>
            <InputText v-model="form.contact_info_title" class="w-full" placeholder="اطلاعات تماس" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات بخش</label>
            <Textarea v-model="form.contact_info_description" class="w-full" rows="3" placeholder="توضیحات اطلاعات تماس" />
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500 mb-2">اطلاعات تماس از تنظیمات عمومی خوانده می‌شود:</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><span class="font-medium">تلفن:</span> {{ form.store_phone }}</div>
              <div><span class="font-medium">موبایل:</span> {{ form.store_mobile }}</div>
              <div><span class="font-medium">ایمیل:</span> {{ form.store_email }}</div>
              <div><span class="font-medium">آدرس:</span> {{ form.store_address }}</div>
              <div><span class="font-medium">ساعات کاری:</span> {{ form.store_working_hours }}</div>
              <div><span class="font-medium">اینستاگرام:</span> {{ form.store_instagram }}</div>
            </div>
            <p class="text-xs text-gray-400 mt-2">
              <router-link to="/settings" class="text-amber-600 hover:underline">برای تغییر به صفحه تنظیمات عمومی بروید</router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-mail-send-line text-amber-600"></i>
          بخش فرم تماس
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان فرم</label>
            <InputText v-model="form.contact_form_title" class="w-full" placeholder="ارسال پیام" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات فرم</label>
            <InputText v-model="form.contact_form_description" class="w-full" placeholder="پیام خود را ارسال کنید" />
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-map-pin-line text-amber-600"></i>
          بخش نقشه
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان نقشه</label>
            <InputText v-model="form.contact_map_title" class="w-full" placeholder="موقعیت فروشگاه روی نقشه" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات نقشه</label>
            <InputText v-model="form.contact_map_description" class="w-full" placeholder="توضیحات نقشه" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر پس‌زمینه نقشه</label>
            <div v-if="form.contact_map_background" class="relative mb-2">
              <img :src="form.contact_map_background" alt="پس‌زمینه نقشه" class="h-32 w-full object-cover rounded-lg border" />
              <Button icon="pi pi-times" severity="danger" rounded class="absolute top-2 left-2" @click="form.contact_map_background = ''" />
            </div>
            <div class="flex gap-2">
              <InputText v-model="form.contact_map_background" class="flex-1" placeholder="آدرس تصویر" />
              <label class="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2 transition-colors">
                <i class="pi pi-upload"></i>
                <input type="file" accept="image/*" class="hidden" @change="(e) => uploadImage(e, 'contact_map_background')" />
              </label>
            </div>
          </div>
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
import api, { uploadAdminFile } from '@/composables/useAdminApi'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const toast = useToast()

const loading = ref(true)
const saving = ref(false)

const form = ref({
  contact_title: '',
  contact_hero_description: '',
  contact_hero_image: '',
  contact_info_title: '',
  contact_info_description: '',
  contact_form_title: '',
  contact_form_description: '',
  contact_map_title: '',
  contact_map_description: '',
  contact_map_background: '',
  // read-only from general settings
  store_phone: '',
  store_mobile: '',
  store_email: '',
  store_address: '',
  store_working_hours: '',
  store_instagram: '',
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
    const contactKeys = [
      'contact_title', 'contact_hero_description', 'contact_hero_image',
      'contact_info_title', 'contact_info_description',
      'contact_form_title', 'contact_form_description',
      'contact_map_title', 'contact_map_description', 'contact_map_background',
    ]
    const payload: Record<string, string> = {}
    for (const key of contactKeys) {
      const v = (form.value as any)[key]
      payload[key] = v == null ? '' : String(v)
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

async function uploadImage(event: Event, field: string) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const result = await uploadAdminFile(file, 'contact')
    ;(form.value as any)[field] = result.url
    toast.add({ severity: 'success', summary: 'موفق', detail: 'تصویر با موفقیت آپلود شد', life: 3000 })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'آپلود تصویر انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
  }
  input.value = ''
}
</script>
