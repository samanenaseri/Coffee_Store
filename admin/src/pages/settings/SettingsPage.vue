<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">تنظیمات سایت</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>

    <template v-else>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form @submit.prevent="saveSettings" class="space-y-6">
          <div v-for="item in settingsList" :key="item.key" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700">{{ getLabel(item.key) }}</label>
              <p class="text-xs text-gray-400 mt-1">{{ item.key }}</p>
            </div>
            <div class="md:col-span-2">
              <InputText
                v-model="item.value"
                class="w-full"
                :placeholder="getLabel(item.key)"
              />
            </div>
          </div>

          <Divider />

          <div class="flex justify-end">
            <Button
              type="submit"
              label="ذخیره تنظیمات"
              icon="pi pi-check"
              :loading="saving"
            />
          </div>
        </form>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import api from '@/composables/useAdminApi'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const toast = useToast()

const loading = ref(true)
const saving = ref(false)

const settingsList = ref<{ key: string; value: string }[]>([])

/**
 * JSON / media settings managed on dedicated pages.
 * Must never appear as plain text fields here — saving corrupted/empty
 * values from this page wipes header menus, logos, etc.
 */
const EXCLUDED_KEYS = new Set([
  'header_links',
  'footer_links',
  'store_logo',
  'store_dark_logo',
  'footer_background',
  'about_title',
  'about_description',
  'about_main_image',
  'about_second_image',
  'about_staff_heading',
  'about_staff_description',
  'contact_hero_image',
  'contact_title',
  'contact_hero_description',
  'contact_info_title',
  'contact_info_description',
  'contact_form_title',
  'contact_form_description',
  'contact_map_background',
  'contact_map_title',
  'contact_map_description',
  'site_url',
  'default_meta_title',
  'default_meta_description',
  'default_og_image',
  'site_favicon',
  'google_analytics_id',
  'google_search_console_id',
])

const keyLabels: Record<string, string> = {
  store_name: 'نام فروشگاه',
  store_slogan: 'شعار تبلیغاتی',
  store_phone: 'تلفن',
  store_mobile: 'موبایل',
  store_email: 'ایمیل',
  store_address: 'آدرس',
  store_address_en: 'آدرس (انگلیسی)',
  store_working_hours: 'ساعات کاری',
  store_instagram: 'اینستاگرام',
  store_telegram: 'تلگرام',
  store_description: 'توضیحات فروشگاه',
  min_order_amount: 'حداقل مبلغ سفارش (ریال)',
  delivery_fee: 'هزینه ارسال (ریال)',
  free_delivery_threshold: 'ارسال رایگان از (ریال)',
  store_currency: 'واحد پول',
  bank_card_number: 'شماره کارت',
  bank_card_holder: 'نام صاحب کارت',
  bank_name: 'نام بانک',
}

onMounted(() => {
  fetchSettings()
})

async function fetchSettings() {
  loading.value = true
  try {
    const res = await api.get('/admin/settings')
    const data = res.data
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      settingsList.value = Object.entries(data)
        .filter(([key]) => !EXCLUDED_KEYS.has(key))
        .map(([key, value]) => ({
          key,
          value: (value as string) ?? '',
        }))
    } else if (Array.isArray(data)) {
      settingsList.value = data
        .filter((s: any) => s?.key && !EXCLUDED_KEYS.has(s.key))
        .map((s: any) => ({
          key: s.key,
          value: s.value ?? '',
        }))
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
    const payload: Record<string, string> = {}
    for (const item of settingsList.value) {
      // Never write excluded keys even if they sneak into the list
      if (EXCLUDED_KEYS.has(item.key)) continue
      payload[item.key] = item.value
    }
    await api.put('/admin/settings', { settings: payload })
    toast.add({ severity: 'success', summary: 'موفق', detail: 'تنظیمات با موفقیت ذخیره شد', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'ذخیره تنظیمات انجام نشد', life: 3000 })
  } finally {
    saving.value = false
  }
}

function getLabel(key: string): string {
  return keyLabels[key] || key
}
</script>
