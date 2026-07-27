<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">نظرات مشتریان</h1>
      <router-link to="/testimonials/new">
        <Button label="افزودن نظر" icon="pi pi-plus" />
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <DataTable
        :value="testimonials"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="name" header="نام" />
        <Column field="role" header="نقش">
          <template #body="{ data }">
            {{ data.role || '-' }}
          </template>
        </Column>
        <Column field="rating" header="امتیاز">
          <template #body="{ data }">
            <div class="flex gap-0.5">
              <i
                v-for="star in 5"
                :key="star"
                class="pi text-sm"
                :class="star <= data.rating ? 'pi-star-fill text-yellow-400' : 'pi-star text-gray-300'"
              />
            </div>
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
              <router-link :to="`/testimonials/${data.id}/edit`">
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
import type { Testimonial, PaginatedResponse } from '@/types'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import ConfirmDialog from 'primevue/confirmdialog'

const toast = useToast()
const confirm = useConfirm()

const testimonials = ref<Testimonial[]>([])
const loading = ref(false)
const currentPage = ref(1)
const perPage = ref(15)
const totalRecords = ref(0)

onMounted(() => {
  fetchTestimonials(1)
})

async function fetchTestimonials(page: number) {
  loading.value = true
  try {
    const params = { page, per_page: perPage.value }
    const res = await api.get('/admin/testimonials', { params })
    const data: PaginatedResponse<Testimonial> = res.data
    testimonials.value = data.data
    currentPage.value = data.current_page
    totalRecords.value = data.total
    perPage.value = data.per_page
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری نظرات انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function onPageChange(event: any) {
  fetchTestimonials(event.page + 1)
}

function confirmDelete(item: Testimonial) {
  confirm.require({
    message: `آیا از حذف نظر «${item.name}» اطمینان دارید؟`,
    header: 'تأیید حذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'حذف',
    rejectLabel: 'لغو',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/admin/testimonials/${item.id}`)
        toast.add({ severity: 'success', summary: 'موفق', detail: 'نظر حذف شد', life: 3000 })
        fetchTestimonials(currentPage.value)
      } catch {
        toast.add({ severity: 'error', summary: 'خطا', detail: 'حذف نظر انجام نشد', life: 3000 })
      }
    },
  })
}
</script>
