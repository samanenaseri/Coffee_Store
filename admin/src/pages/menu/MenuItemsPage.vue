<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">آیتم‌های منو</h1>
      <router-link to="/menu-items/new">
        <Button label="افزودن آیتم منو" icon="pi pi-plus" />
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <InputText
            v-model="search"
            placeholder="جستجو عنوان آیتم..."
            class="w-full"
            @keyup.enter="fetchItems(1)"
          />
        </div>
        <div class="min-w-[200px]">
          <Dropdown
            v-model="selectedCategoryId"
            :options="menuCategories"
            optionLabel="title"
            optionValue="id"
            placeholder="دسته‌بندی منو"
            class="w-full"
            showClear
            @change="fetchItems(1)"
          />
        </div>
        <Button label="جستجو" icon="pi pi-search" @click="fetchItems(1)" />
      </div>

      <DataTable
        :value="items"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="title" header="عنوان" />
        <Column field="category" header="دسته‌بندی">
          <template #body="{ data }">
            {{ data.category?.title || '-' }}
          </template>
        </Column>
        <Column field="price" header="قیمت">
          <template #body="{ data }">
            {{ formatPrice(data.price) }}
          </template>
        </Column>
        <Column field="is_available" header="موجودی">
          <template #body="{ data }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="data.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ data.is_available ? 'موجود' : 'ناموجود' }}
            </span>
          </template>
        </Column>
        <Column field="is_popular" header="محبوب">
          <template #body="{ data }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="data.is_popular ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ data.is_popular ? 'بله' : 'خیر' }}
            </span>
          </template>
        </Column>
        <Column header="عملیات">
          <template #body="{ data }">
            <div class="flex gap-2">
              <router-link :to="`/menu-items/${data.id}/edit`">
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
import type { MenuItem, MenuCategory, PaginatedResponse } from '@/types'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Paginator from 'primevue/paginator'

const toast = useToast()
const confirm = useConfirm()

const items = ref<MenuItem[]>([])
const menuCategories = ref<MenuCategory[]>([])
const loading = ref(false)
const search = ref('')
const selectedCategoryId = ref<number | null>(null)
const currentPage = ref(1)
const perPage = ref(15)
const totalRecords = ref(0)

onMounted(() => {
  fetchCategories()
  fetchItems(1)
})

async function fetchCategories() {
  try {
    const res = await api.get('/admin/menu-categories')
    menuCategories.value = res.data.data ?? res.data
  } catch {
    // silently fail
  }
}

async function fetchItems(page: number) {
  loading.value = true
  try {
    const params: Record<string, any> = { page, per_page: perPage.value }
    if (search.value) params.search = search.value
    if (selectedCategoryId.value) params.category_id = selectedCategoryId.value

    const res = await api.get('/admin/menu-items', { params })
    const data: PaginatedResponse<MenuItem> = res.data
    items.value = data.data
    currentPage.value = data.current_page
    totalRecords.value = data.total
    perPage.value = data.per_page
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری آیتم‌های منو انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function onPageChange(event: any) {
  fetchItems(event.page + 1)
}

function confirmDelete(item: MenuItem) {
  confirm.require({
    message: `آیا از حذف «${item.title}» اطمینان دارید؟`,
    header: 'تأیید حذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'حذف',
    rejectLabel: 'لغو',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/admin/menu-items/${item.id}`)
        toast.add({ severity: 'success', summary: 'موفق', detail: 'آیتم منو حذف شد', life: 3000 })
        fetchItems(currentPage.value)
      } catch {
        toast.add({ severity: 'error', summary: 'خطا', detail: 'حذف آیتم منو انجام نشد', life: 3000 })
      }
    },
  })
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price) + ' ریال'
}
</script>
