<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isEdit ? 'ویرایش کارمند' : 'افزودن کارمند' }}
      </h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form @submit.prevent="save" class="space-y-6 max-w-3xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">نام</label>
            <InputText v-model="form.name" class="w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">نقش</label>
            <InputText v-model="form.role" class="w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر</label>
            <ImageUploader v-model="form.image" folder="staff" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">اینستاگرام</label>
            <InputText v-model="form.instagram" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ترتیب نمایش</label>
            <input v-model.number="form.sort_order" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" min="0" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <Textarea v-model="form.description" rows="4" class="w-full" />
        </div>

        <div class="flex items-center gap-2">
          <InputSwitch v-model="form.is_active" inputId="is_active" />
          <label for="is_active" class="text-sm font-medium text-gray-700">فعال</label>
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
  name: '',
  role: '',
  description: '',
  image: '',
  instagram: '',
  sort_order: 0,
  is_active: true,
})

onMounted(async () => {
  if (isEdit.value) {
    await fetchStaff()
  }
})

async function fetchStaff() {
  try {
    const res = await api.get(`/admin/staff/${route.params.id}`)
    const item = res.data
    form.value = {
      name: item.name,
      role: item.role,
      description: item.description ?? '',
      image: item.image ?? '',
      instagram: item.instagram ?? '',
      sort_order: item.sort_order,
      is_active: item.is_active,
    }
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری کارمند انجام نشد', life: 3000 })
    router.push('/staff')
  }
}

async function save() {
  saving.value = true
  try {
    if (isEdit.value) {
      await api.put(`/admin/staff/${route.params.id}`, form.value)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'کارمند بروزرسانی شد', life: 3000 })
    } else {
      await api.post('/admin/staff', form.value)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'کارمند ایجاد شد', life: 3000 })
    }
    router.push('/staff')
  } catch (e: any) {
    const msg = e.response?.data?.message || 'ذخیره انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail: msg, life: 3000 })
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/staff')
}
</script>
