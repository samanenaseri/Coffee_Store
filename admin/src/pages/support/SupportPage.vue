<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">تیکت‌های پشتیبانی</h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="min-w-[200px]">
          <Dropdown
            v-model="selectedStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="فیلتر وضعیت"
            class="w-full"
            showClear
            @change="fetchTickets(1)"
          />
        </div>
      </div>

      <DataTable
        :value="tickets"
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
        <Column field="subject" header="موضوع">
          <template #body="{ data }">
            {{ data.subject }}
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
        <Column field="priority" header="اولویت">
          <template #body="{ data }">
            {{ getPriorityLabel(data.priority) }}
          </template>
        </Column>
        <Column field="created_at" header="تاریخ ایجاد">
          <template #body="{ data }">
            {{ formatDate(data.created_at) }}
          </template>
        </Column>
        <Column header="عملیات">
          <template #body="{ data }">
            <router-link :to="`/support/${data.id}`">
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
import type { SupportTicket, PaginatedResponse } from '@/types'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Paginator from 'primevue/paginator'

const toast = useToast()

const tickets = ref<SupportTicket[]>([])
const loading = ref(false)
const selectedStatus = ref<string | null>(null)
const currentPage = ref(1)
const perPage = ref(15)
const totalRecords = ref(0)

const statusOptions = [
  { label: 'همه', value: null },
  { label: 'باز', value: 'open' },
  { label: 'در حال بررسی', value: 'in_progress' },
  { label: 'پاسخ داده‌شده', value: 'answered' },
  { label: 'بسته شده', value: 'closed' },
]

const statusMap: Record<string, { label: string; class: string }> = {
  open: { label: 'باز', class: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'در حال بررسی', class: 'bg-yellow-100 text-yellow-800' },
  waiting: { label: 'در حال بررسی', class: 'bg-yellow-100 text-yellow-800' },
  answered: { label: 'پاسخ داده‌شده', class: 'bg-emerald-100 text-emerald-800' },
  replied: { label: 'پاسخ داده‌شده', class: 'bg-emerald-100 text-emerald-800' },
  closed: { label: 'بسته شده', class: 'bg-gray-100 text-gray-800' },
}

const priorityMap: Record<string, string> = {
  low: 'پایین',
  medium: 'متوسط',
  high: 'بالا',
  urgent: 'فوری',
}

onMounted(() => {
  fetchTickets(1)
})

async function fetchTickets(page: number) {
  loading.value = true
  try {
    const params: Record<string, any> = { page, per_page: perPage.value }
    if (selectedStatus.value) params.status = selectedStatus.value

    const res = await api.get('/admin/support', { params })
    const data: PaginatedResponse<SupportTicket> = res.data
    tickets.value = data.data
    currentPage.value = data.current_page
    totalRecords.value = data.total
    perPage.value = data.per_page
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری تیکت‌ها انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function onPageChange(event: any) {
  fetchTickets(event.page + 1)
}

function getStatusClass(status: string): string {
  return statusMap[status]?.class || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: string): string {
  return statusMap[status]?.label || status
}

function getPriorityLabel(priority: string): string {
  return priorityMap[priority] || priority
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fa-IR')
}
</script>
