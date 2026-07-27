<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">گالری</h1>
      <router-link to="/gallery/new">
        <Button label="افزودن تصویر" icon="pi pi-plus" />
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <DataTable
        :value="items"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="title" header="عنوان" />
        <Column field="category" header="دسته‌بندی">
          <template #body="{ data }">
            {{ data.category || '-' }}
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
        <Column field="sort_order" header="ترتیب">
          <template #body="{ data }">
            {{ data.sort_order }}
          </template>
        </Column>
        <Column header="عملیات">
          <template #body="{ data }">
            <div class="flex gap-2">
              <router-link :to="`/gallery/${data.id}/edit`">
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

    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import api from '@/composables/useAdminApi'
import type { GalleryItem, PaginatedResponse } from '@/types'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import ConfirmDialog from 'primevue/confirmdialog'

const toast = useToast()
const confirm = useConfirm()

const items = ref<GalleryItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const perPage = ref(15)
const totalRecords = ref(0)

onMounted(() => {
  fetchItems(1)
})

async function fetchItems(page: number) {
  loading.value = true
  try {
    const params = { page, per_page: perPage.value }
    const res = await api.get('/admin/gallery', { params })
    const data: PaginatedResponse<GalleryItem> = res.data
    items.value = data.data
    currentPage.value = data.current_page
    totalRecords.value = data.total
    perPage.value = data.per_page
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری گالری انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function onPageChange(event: any) {
  fetchItems(event.page + 1)
}

function confirmDelete(item: GalleryItem) {
  confirm.require({
    message: `آیا از حذف «${item.title}» اطمینان دارید؟`,
    header: 'تأیید حذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'حذف',
    rejectLabel: 'لغو',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/admin/gallery/${item.id}`)
        toast.add({ severity: 'success', summary: 'موفق', detail: 'تصویر حذف شد', life: 3000 })
        fetchItems(currentPage.value)
      } catch {
        toast.add({ severity: 'error', summary: 'خطا', detail: 'حذف تصویر انجام نشد', life: 3000 })
      }
    },
  })
}
</script>
