<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">نظرات محصولات</h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-wrap gap-3 mb-6">
        <InputText
          v-model="search"
          placeholder="جستجو نام، متن یا محصول..."
          class="flex-1 min-w-[200px]"
          @keyup.enter="fetchComments(1)"
        />
        <Dropdown
          v-model="status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="وضعیت"
          class="min-w-[160px]"
          showClear
          @change="fetchComments(1)"
        />
        <Button label="جستجو" icon="pi pi-search" @click="fetchComments(1)" />
      </div>

      <DataTable
        :value="comments"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="author_name" header="نام">
          <template #body="{ data }">
            {{ data.author_name }}
          </template>
        </Column>
        <Column field="product" header="محصول">
          <template #body="{ data }">
            {{ data.product?.title || '-' }}
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
        <Column field="body" header="متن نظر">
          <template #body="{ data }">
            <span class="line-clamp-2 max-w-xs text-sm text-gray-600" :title="data.body">
              {{ data.body }}
            </span>
          </template>
        </Column>
        <Column field="is_approved" header="وضعیت">
          <template #body="{ data }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="data.is_approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'"
            >
              {{ data.is_approved ? 'تأیید شده' : 'در انتظار' }}
            </span>
          </template>
        </Column>
        <Column field="created_at" header="تاریخ">
          <template #body="{ data }">
            {{ formatDate(data.created_at) }}
          </template>
        </Column>
        <Column header="عملیات">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <Button
                v-if="!data.is_approved"
                icon="pi pi-check"
                size="small"
                text
                rounded
                severity="success"
                title="تأیید"
                @click="approve(data)"
              />
              <Button
                v-else
                icon="pi pi-times"
                size="small"
                text
                rounded
                severity="secondary"
                title="لغو تأیید"
                @click="reject(data)"
              />
              <Button
                icon="pi pi-eye"
                size="small"
                text
                rounded
                @click="openDetail(data)"
              />
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

    <Dialog
      v-model:visible="detailVisible"
      header="جزئیات نظر"
      modal
      class="w-full max-w-lg"
    >
      <div v-if="selected" class="space-y-3 text-sm">
        <p><span class="font-medium text-gray-500">نام:</span> {{ selected.author_name }}</p>
        <p><span class="font-medium text-gray-500">محصول:</span> {{ selected.product?.title }}</p>
        <p>
          <span class="font-medium text-gray-500">امتیاز:</span>
          {{ selected.rating }} / 5
        </p>
        <p>
          <span class="font-medium text-gray-500">وضعیت:</span>
          {{ selected.is_approved ? 'تأیید شده' : 'در انتظار' }}
        </p>
        <p>
          <span class="font-medium text-gray-500">تاریخ:</span>
          {{ formatDate(selected.created_at) }}
        </p>
        <div class="rounded-lg bg-gray-50 p-3 leading-7 text-gray-800 whitespace-pre-line">
          {{ selected.body }}
        </div>
        <div class="flex gap-2 pt-2">
          <Button
            v-if="!selected.is_approved"
            label="تأیید نظر"
            icon="pi pi-check"
            severity="success"
            @click="approve(selected)"
          />
          <Button
            v-else
            label="لغو تأیید"
            icon="pi pi-times"
            severity="secondary"
            @click="reject(selected)"
          />
          <Button
            label="حذف"
            icon="pi pi-trash"
            severity="danger"
            outlined
            @click="confirmDelete(selected)"
          />
        </div>
      </div>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import api from '@/composables/useAdminApi'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

interface ProductCommentRow {
  id: number
  author_name: string
  body: string
  rating: number
  is_approved: boolean
  created_at: string
  product?: { id: number; title: string; slug: string }
}

const toast = useToast()
const confirm = useConfirm()

const comments = ref<ProductCommentRow[]>([])
const loading = ref(false)
const currentPage = ref(1)
const perPage = ref(20)
const totalRecords = ref(0)
const search = ref('')
const status = ref<string | null>(null)

const statusOptions = [
  { label: 'در انتظار', value: 'pending' },
  { label: 'تأیید شده', value: 'approved' },
]

const detailVisible = ref(false)
const selected = ref<ProductCommentRow | null>(null)

onMounted(() => {
  fetchComments(1)
})

function formatDate(value?: string) {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleString('fa-IR')
  } catch {
    return value
  }
}

async function fetchComments(page: number) {
  loading.value = true
  try {
    const params: Record<string, any> = { page, per_page: perPage.value }
    if (status.value) params.status = status.value
    if (search.value.trim()) params.search = search.value.trim()

    const res = await api.get('/admin/product-comments', { params })
    const data = res.data
    comments.value = data.data ?? []
    currentPage.value = data.current_page ?? page
    totalRecords.value = data.total ?? 0
    perPage.value = data.per_page ?? perPage.value
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری نظرات انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function onPageChange(event: any) {
  fetchComments(event.page + 1)
}

function openDetail(item: ProductCommentRow) {
  selected.value = item
  detailVisible.value = true
}

async function approve(item: ProductCommentRow) {
  try {
    await api.post(`/admin/product-comments/${item.id}/approve`)
    toast.add({ severity: 'success', summary: 'موفق', detail: 'نظر تأیید شد', life: 3000 })
    detailVisible.value = false
    fetchComments(currentPage.value)
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'تأیید نظر انجام نشد', life: 3000 })
  }
}

async function reject(item: ProductCommentRow) {
  try {
    await api.post(`/admin/product-comments/${item.id}/reject`)
    toast.add({ severity: 'success', summary: 'موفق', detail: 'نظر به حالت در انتظار برگشت', life: 3000 })
    detailVisible.value = false
    fetchComments(currentPage.value)
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'عملیات انجام نشد', life: 3000 })
  }
}

function confirmDelete(item: ProductCommentRow) {
  confirm.require({
    message: `آیا از حذف نظر «${item.author_name}» اطمینان دارید؟`,
    header: 'تأیید حذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'حذف',
    rejectLabel: 'لغو',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/admin/product-comments/${item.id}`)
        toast.add({ severity: 'success', summary: 'موفق', detail: 'نظر حذف شد', life: 3000 })
        detailVisible.value = false
        fetchComments(currentPage.value)
      } catch {
        toast.add({ severity: 'error', summary: 'خطا', detail: 'حذف نظر انجام نشد', life: 3000 })
      }
    },
  })
}
</script>
