<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">سفارشات</h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <InputText
            v-model="search"
            placeholder="جستجو کد پیگیری یا ایمیل..."
            class="w-full"
            @keyup.enter="fetchOrders(1)"
          />
        </div>
        <div class="min-w-[200px]">
          <Dropdown
            v-model="selectedStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="وضعیت سفارش"
            class="w-full"
            showClear
            @change="fetchOrders(1)"
          />
        </div>
        <Button label="جستجو" icon="pi pi-search" @click="fetchOrders(1)" />
      </div>

      <DataTable
        :value="orders"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="id" header="#">
          <template #body="{ data }">
            {{ data.id }}
          </template>
        </Column>
        <Column field="user" header="نام کاربر">
          <template #body="{ data }">
            {{ data.user?.name || '-' }}
          </template>
        </Column>
        <Column field="total_amount" header="مبلغ کل">
          <template #body="{ data }">
            {{ formatPrice(data.total_amount) }}
          </template>
        </Column>
        <Column field="status" header="وضعیت">
          <template #body="{ data }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusClass(data.status)"
            >
              {{ getStatusLabel(data.status) }}
            </span>
          </template>
        </Column>
        <Column field="created_at" header="تاریخ ایجاد">
          <template #body="{ data }">
            {{ formatDate(data.created_at) }}
          </template>
        </Column>
        <Column header="عملیات">
          <template #body="{ data }">
            <router-link :to="`/orders/${data.id}`">
              <Button icon="pi pi-eye" size="small" text rounded label="مشاهده جزئیات" />
            </router-link>
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
import api from '@/composables/useAdminApi'
import type { Order, PaginatedResponse, OrderStatus } from '@/types'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Paginator from 'primevue/paginator'

const toast = useToast()

const orders = ref<Order[]>([])
const loading = ref(false)
const search = ref('')
const selectedStatus = ref<OrderStatus | null>(null)
const currentPage = ref(1)
const perPage = ref(15)
const totalRecords = ref(0)

const statusOptions = [
  { label: 'همه', value: null },
  { label: 'در انتظار', value: 'pending' },
  { label: 'در حال پردازش', value: 'processing' },
  { label: 'ارسال شده', value: 'shipped' },
  { label: 'تحویل شده', value: 'delivered' },
  { label: 'لغو شده', value: 'cancelled' },
  { label: 'مرجوع شده', value: 'returned' },
]

const statusMap: Record<OrderStatus, { label: string; class: string }> = {
  pending: { label: 'در انتظار', class: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'در حال پردازش', class: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'ارسال شده', class: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'تحویل شده', class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'لغو شده', class: 'bg-red-100 text-red-800' },
  returned: { label: 'مرجوع شده', class: 'bg-gray-100 text-gray-800' },
}

onMounted(() => {
  fetchOrders(1)
})

async function fetchOrders(page: number) {
  loading.value = true
  try {
    const params: Record<string, any> = { page, per_page: perPage.value }
    if (search.value) params.search = search.value
    if (selectedStatus.value) params.status = selectedStatus.value

    const res = await api.get('/admin/orders', { params })
    const data: PaginatedResponse<Order> = res.data
    orders.value = data.data
    currentPage.value = data.current_page
    totalRecords.value = data.total
    perPage.value = data.per_page
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری سفارشات انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function onPageChange(event: any) {
  fetchOrders(event.page + 1)
}

function getStatusClass(status: OrderStatus): string {
  return statusMap[status]?.class || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: OrderStatus): string {
  return statusMap[status]?.label || status
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price) + ' ریال'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fa-IR')
}
</script>
