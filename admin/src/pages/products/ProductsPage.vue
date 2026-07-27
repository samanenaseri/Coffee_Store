<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">محصولات</h1>
      <router-link to="/products/new">
        <Button label="افزودن محصول" icon="pi pi-plus" />
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <InputText
            v-model="search"
            placeholder="جستجو عنوان محصول..."
            class="w-full"
            @keyup.enter="fetchProducts(1)"
          />
        </div>
        <div class="min-w-[200px]">
          <Dropdown
            v-model="selectedCategory"
            :options="categories"
            optionLabel="title"
            optionValue="id"
            placeholder="دسته‌بندی"
            class="w-full"
            showClear
            @change="fetchProducts(1)"
          />
        </div>
        <Button label="جستجو" icon="pi pi-search" @click="fetchProducts(1)" />
      </div>

      <DataTable
        :value="products"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="title" header="عنوان" />
        <Column field="price" header="قیمت">
          <template #body="{ data }">
            {{ formatPrice(data.price) }}
          </template>
        </Column>
        <Column header="وزن / بسته">
          <template #body="{ data }">
            <span v-if="Array.isArray(data.weight_packages) && data.weight_packages.length">
              {{ data.weight_packages.length }} بسته
            </span>
            <span v-else-if="data.weight">
              {{ data.weight }}{{ data.weight_unit === 'kg' ? 'kg' : 'g' }}
            </span>
            <span v-else class="text-gray-400">—</span>
          </template>
        </Column>
        <Column field="category" header="دسته‌بندی">
          <template #body="{ data }">
            {{ data.category?.title || '-' }}
          </template>
        </Column>
        <Column field="inventory" header="موجودی">
          <template #body="{ data }">
            {{ data.inventory ?? '-' }}
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
              <router-link :to="`/products/${data.id}/edit`">
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
import type { Product, Category, PaginatedResponse } from '@/types'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Paginator from 'primevue/paginator'

const toast = useToast()
const confirm = useConfirm()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const search = ref('')
const selectedCategory = ref<number | null>(null)
const currentPage = ref(1)
const perPage = ref(15)
const totalRecords = ref(0)

onMounted(() => {
  fetchCategories()
  fetchProducts(1)
})

async function fetchCategories() {
  try {
    const res = await api.get('/admin/categories')
    categories.value = res.data.data ?? res.data
  } catch {
    // silently fail
  }
}

async function fetchProducts(page: number) {
  loading.value = true
  try {
    const params: Record<string, any> = { page, per_page: perPage.value }
    if (search.value) params.search = search.value
    if (selectedCategory.value) params.category_id = selectedCategory.value

    const res = await api.get('/admin/products', { params })
    const data: PaginatedResponse<Product> = res.data
    products.value = data.data
    currentPage.value = data.current_page
    totalRecords.value = data.total
    perPage.value = data.per_page
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری محصولات انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function onPageChange(event: any) {
  fetchProducts(event.page + 1)
}

function confirmDelete(product: Product) {
  confirm.require({
    message: `آیا از حذف «${product.title}» اطمینان دارید؟`,
    header: 'تأیید حذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'حذف',
    rejectLabel: 'لغو',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/admin/products/${product.id}`)
        toast.add({ severity: 'success', summary: 'موفق', detail: 'محصول حذف شد', life: 3000 })
        fetchProducts(currentPage.value)
      } catch {
        toast.add({ severity: 'error', summary: 'خطا', detail: 'حذف محصول انجام نشد', life: 3000 })
      }
    },
  })
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price) + ' ریال'
}
</script>
