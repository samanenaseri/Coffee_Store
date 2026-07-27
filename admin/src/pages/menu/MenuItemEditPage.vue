<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isEdit ? 'ویرایش آیتم منو' : 'افزودن آیتم منو' }}
      </h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form @submit.prevent="save" class="space-y-6 max-w-3xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی منو</label>
            <Dropdown
              v-model="form.category_id"
              :options="menuCategories"
              optionLabel="title"
              optionValue="id"
              placeholder="انتخاب دسته‌بندی"
              class="w-full"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان</label>
            <InputText v-model="form.title" class="w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">قیمت (ریال)</label>
            <input v-model.number="form.price" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required min="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر</label>
            <ImageUploader v-model="form.image" folder="menu-items" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ترتیب نمایش</label>
            <input v-model.number="form.sort_order" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" min="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">اسلاگ (Slug)</label>
            <InputText v-model="form.slug" class="w-full" placeholder="slug-for-url" dir="ltr" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <Textarea v-model="form.description" rows="4" class="w-full" />
        </div>

        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2">
            <InputSwitch v-model="form.is_available" inputId="is_available" />
            <label for="is_available" class="text-sm font-medium text-gray-700">موجود</label>
          </div>
          <div class="flex items-center gap-2">
            <InputSwitch v-model="form.is_popular" inputId="is_popular" />
            <label for="is_popular" class="text-sm font-medium text-gray-700">محبوب</label>
          </div>
        </div>

        <div class="border-t pt-4">
          <h3 class="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <i class="pi pi-search text-amber-600"></i>
            تنظیمات سئو
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان متا (Meta Title)</label>
              <InputText v-model="form.meta_title" class="w-full" placeholder="عنوان صفحه برای موتورهای جستجو (30-60 کاراکتر)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات متا (Meta Description)</label>
              <Textarea v-model="form.meta_description" class="w-full" rows="2" placeholder="توضیحات صفحه برای موتورهای جستجو (120-160 کاراکتر)" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">عنوان OG (OG Title)</label>
                <InputText v-model="form.og_title" class="w-full" placeholder="عنوان برای شبکه‌های اجتماعی" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">تصویر OG (OG Image)</label>
                <InputText v-model="form.og_image" class="w-full" placeholder="آدرس تصویر OG" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات OG (OG Description)</label>
              <Textarea v-model="form.og_description" class="w-full" rows="2" placeholder="توضیحات برای شبکه‌های اجتماعی" />
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <Button type="submit" label="ذخیره" icon="pi pi-check" :loading="saving" />
          <Button type="button" label="لغو" icon="pi pi-times" severity="secondary" @click="goBack" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import api from '@/composables/useAdminApi'
import type { MenuCategory } from '@/types'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'
import ImageUploader from '@/components/ui/ImageUploader.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const menuCategories = ref<MenuCategory[]>([])

const form = ref({
  category_id: null as number | null,
  title: '',
  description: '',
  price: 0,
  is_available: true,
  is_popular: false,
  image: '',
  sort_order: 0,
  slug: '',
  meta_title: '',
  meta_description: '',
  og_title: '',
  og_description: '',
  og_image: '',
})

onMounted(async () => {
  await fetchCategories()
  if (isEdit.value) {
    await fetchItem()
  }
})

async function fetchCategories() {
  try {
    const res = await api.get('/admin/menu-categories')
    menuCategories.value = res.data.data ?? res.data
  } catch {
    // silently fail
  }
}

async function fetchItem() {
  try {
    const res = await api.get(`/admin/menu-items/${route.params.id}`)
    const item = res.data
    form.value = {
      category_id: item.category_id,
      title: item.title,
      description: item.description ?? '',
      price: item.price,
      is_available: item.is_available,
      is_popular: item.is_popular,
      image: item.image ?? '',
      sort_order: item.sort_order,
      slug: item.slug ?? '',
      meta_title: item.meta_title ?? '',
      meta_description: item.meta_description ?? '',
      og_title: item.og_title ?? '',
      og_description: item.og_description ?? '',
      og_image: item.og_image ?? '',
    }
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری آیتم منو انجام نشد', life: 3000 })
    router.push('/menu-items')
  }
}

async function save() {
  saving.value = true
  try {
    if (isEdit.value) {
      await api.put(`/admin/menu-items/${route.params.id}`, form.value)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'آیتم منو بروزرسانی شد', life: 3000 })
    } else {
      await api.post('/admin/menu-items', form.value)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'آیتم منو ایجاد شد', life: 3000 })
    }
    router.push('/menu-items')
  } catch (e: any) {
    const msg = e.response?.data?.message || 'ذخیره انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail: msg, life: 3000 })
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/menu-items')
}
</script>
