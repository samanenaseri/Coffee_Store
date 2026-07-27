<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">کاربران</h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <InputText
            v-model="search"
            placeholder="جستجو نام یا ایمیل..."
            class="w-full"
            @keyup.enter="fetchUsers(1)"
          />
        </div>
        <Button label="جستجو" icon="pi pi-search" @click="fetchUsers(1)" />
      </div>

      <DataTable
        :value="users"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="id" header="#">
          <template #body="{ data }">
            {{ data.id }}
          </template>
        </Column>
        <Column field="name" header="نام">
          <template #body="{ data }">
            {{ data.name }}
          </template>
        </Column>
        <Column field="email" header="ایمیل">
          <template #body="{ data }">
            {{ data.email }}
          </template>
        </Column>
        <Column field="phone" header="تلفن">
          <template #body="{ data }">
            {{ data.phone || '-' }}
          </template>
        </Column>
        <Column field="orders_count" header="تعداد سفارشات">
          <template #body="{ data }">
            {{ data.orders_count ?? 0 }}
          </template>
        </Column>
        <Column field="is_admin" header="نقش">
          <template #body="{ data }">
            <Tag
              :value="data.is_admin ? 'مدیر' : 'کاربر'"
              :severity="data.is_admin ? 'danger' : 'info'"
            />
          </template>
        </Column>
        <Column header="عملیات">
          <template #body="{ data }">
            <router-link :to="`/users/${data.id}`">
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
import type { User, PaginatedResponse } from '@/types'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'

const toast = useToast()

const users = ref<(User & { orders_count?: number })[]>([])
const loading = ref(false)
const search = ref('')
const currentPage = ref(1)
const perPage = ref(15)
const totalRecords = ref(0)

onMounted(() => {
  fetchUsers(1)
})

async function fetchUsers(page: number) {
  loading.value = true
  try {
    const params: Record<string, any> = { page, per_page: perPage.value }
    if (search.value) params.search = search.value

    const res = await api.get('/admin/users', { params })
    const data: PaginatedResponse<User & { orders_count?: number }> = res.data
    users.value = data.data
    currentPage.value = data.current_page
    totalRecords.value = data.total
    perPage.value = data.per_page
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری کاربران انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function onPageChange(event: any) {
  fetchUsers(event.page + 1)
}
</script>
