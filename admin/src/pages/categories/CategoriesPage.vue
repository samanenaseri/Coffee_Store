<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">دسته‌بندی‌ها</h1>
      <router-link to="/categories/new">
        <Button label="افزودن دسته‌بندی" icon="pi pi-plus" />
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <DataTable
        :value="categories"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="title" header="عنوان" />
        <Column field="slug" header="اسلاگ" />
        <Column field="products_count" header="تعداد محصولات">
          <template #body="{ data }">
            {{ data.products_count ?? 0 }}
          </template>
        </Column>
        <Column field="is_active" header="وضعیت">
          <template #body="{ data }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="data.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ data.is_active ? 'فعال' : 'غیرفعال' }}
            </span>
          </template>
        </Column>
        <Column header="عملیات">
          <template #body="{ data }">
            <div class="flex gap-2">
              <router-link :to="`/categories/${data.id}/edit`">
                <Button icon="pi pi-pencil" size="small" text rounded />
              </router-link>
              <Button
                icon="pi pi-trash"
                size="small"
                text
                rounded
                severity="danger"
                @click="confirmDelete(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import api from '@/composables/useAdminApi'
import type { Category } from '@/types'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const toast = useToast()
const confirm = useConfirm()

const categories = ref<Category[]>([])
const loading = ref(false)

onMounted(() => {
  fetchCategories()
})

async function fetchCategories() {
  loading.value = true
  try {
    const res = await api.get('/admin/categories')
    categories.value = res.data.data ?? res.data
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری دسته‌بندی‌ها انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function confirmDelete(category: Category) {
  confirm.require({
    message: `آیا از حذف «${category.title}» اطمینان دارید؟`,
    header: 'تأیید حذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'حذف',
    rejectLabel: 'لغو',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/admin/categories/${category.id}`)
        toast.add({ severity: 'success', summary: 'موفق', detail: 'دسته‌بندی حذف شد', life: 3000 })
        fetchCategories()
      } catch {
        toast.add({ severity: 'error', summary: 'خطا', detail: 'حذف دسته‌بندی انجام نشد', life: 3000 })
      }
    },
  })
}
</script>
