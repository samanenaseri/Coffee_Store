<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">دسته‌بندی‌های منو</h1>
      <router-link to="/menu-categories/new">
        <Button label="افزودن دسته‌بندی" icon="pi pi-plus" />
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <InputText
            v-model="search"
            placeholder="جستجو عنوان دسته‌بندی..."
            class="w-full"
            @keyup.enter="fetchCategories(1)"
          />
        </div>
        <Button label="جستجو" icon="pi pi-search" @click="fetchCategories(1)" />
      </div>

      <DataTable
        :value="categories"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="title" header="عنوان" />
        <Column field="slug" header="اسلاگ" />
        <Column field="items_count" header="تعداد آیتم‌ها">
          <template #body="{ data }">
            {{ data.items_count ?? 0 }}
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
              <router-link :to="`/menu-categories/${data.id}/edit`">
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

      <div v-if="totalRecords > perPage" class="flex justify-center mt-6">
        <Paginator
          :rows="perPage"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[10, 20, 50]"
          @page="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import api from '@/composables/useAdminApi'
import type { MenuCategory, PaginatedResponse } from '@/types'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'

const toast = useToast()
const confirm = useConfirm()

const categories = ref<MenuCategory[]>([])
const loading = ref(false)
const search = ref('')
const currentPage = ref(1)
const perPage = ref(15)
const totalRecords = ref(0)

onMounted(() => {
  fetchCategories(1)
})

async function fetchCategories(page: number) {
  loading.value = true
  try {
    const params: Record<string, any> = { page, per_page: perPage.value }
    if (search.value) params.search = search.value

    const res = await api.get('/admin/menu-categories', { params })
    const data: PaginatedResponse<MenuCategory> = res.data
    categories.value = data.data
    currentPage.value = data.current_page
    totalRecords.value = data.total
    perPage.value = data.per_page
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری دسته‌بندی‌های منو انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function onPageChange(event: any) {
  fetchCategories(event.page + 1)
}

function confirmDelete(category: MenuCategory) {
  confirm.require({
    message: `آیا از حذف «${category.title}» اطمینان دارید؟`,
    header: 'تأیید حذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'حذف',
    rejectLabel: 'لغو',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/admin/menu-categories/${category.id}`)
        toast.add({ severity: 'success', summary: 'موفق', detail: 'دسته‌بندی منو حذف شد', life: 3000 })
        fetchCategories(currentPage.value)
      } catch {
        toast.add({ severity: 'error', summary: 'خطا', detail: 'حذف دسته‌بندی منو انجام نشد', life: 3000 })
      }
    },
  })
}
</script>
