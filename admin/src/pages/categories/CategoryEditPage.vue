<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isEdit ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی' }}
      </h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form @submit.prevent="save" class="space-y-6 max-w-3xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان</label>
            <InputText v-model="form.title" class="w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">اسلاگ</label>
            <InputText v-model="form.slug" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">آیکون</label>
            <InputText v-model="form.icon" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر</label>
            <ImageUploader v-model="form.image" folder="categories" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ترتیب نمایش</label>
            <input v-model.number="form.sort_order" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" min="0" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <Textarea v-model="form.description" rows="3" class="w-full" />
        </div>

        <div class="flex items-center gap-2">
          <InputSwitch v-model="form.is_active" inputId="is_active" />
          <label for="is_active" class="text-sm font-medium text-gray-700">فعال</label>
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

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import ImageUploader from '@/components/ui/ImageUploader.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const form = ref({
  title: '',
  slug: '',
  description: '',
  icon: '',
  image: '',
  sort_order: 0,
  is_active: true,
  meta_title: '',
  meta_description: '',
  og_title: '',
  og_description: '',
  og_image: '',
})

onMounted(() => {
  if (isEdit.value) {
    fetchCategory()
  }
})

async function fetchCategory() {
  try {
    const res = await api.get(`/admin/categories/${route.params.id}`)
    const category = res.data
    form.value = {
      title: category.title,
      slug: category.slug,
      description: category.description ?? '',
      icon: category.icon ?? '',
      image: category.image ?? '',
      sort_order: category.sort_order,
      is_active: category.is_active,
      meta_title: category.meta_title ?? '',
      meta_description: category.meta_description ?? '',
      og_title: category.og_title ?? '',
      og_description: category.og_description ?? '',
      og_image: category.og_image ?? '',
    }
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری دسته‌بندی انجام نشد', life: 3000 })
    router.push('/categories')
  }
}

async function save() {
  saving.value = true
  try {
    if (isEdit.value) {
      await api.put(`/admin/categories/${route.params.id}`, form.value)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'دسته‌بندی بروزرسانی شد', life: 3000 })
    } else {
      await api.post('/admin/categories', form.value)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'دسته‌بندی ایجاد شد', life: 3000 })
    }
    router.push('/categories')
  } catch (e: any) {
    const msg = e.response?.data?.message || 'ذخیره انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail: msg, life: 3000 })
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/categories')
}
</script>
