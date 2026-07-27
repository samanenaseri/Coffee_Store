<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">جزئیات سفارش #{{ order?.id }}</h1>
      <Button icon="pi pi-arrow-right" label="بازگشت" severity="secondary" text @click="goBack" />
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>

    <template v-else-if="order">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <template #title>اطلاعات سفارش</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500">شناسه:</span>
                <span class="font-medium">{{ order.id }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">کد پیگیری:</span>
                <div class="flex items-center gap-2">
                  <InputText v-model="trackingCode" size="small" class="w-40" />
                  <Button icon="pi pi-check" size="small" :loading="savingTracking" @click="saveTrackingCode" />
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">وضعیت:</span>
                <div class="flex items-center gap-2">
                  <Dropdown
                    v-model="selectedStatus"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    size="small"
                    class="w-40"
                  />
                  <Button icon="pi pi-check" size="small" :loading="savingStatus" @click="saveStatus" />
                </div>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">تاریخ ایجاد:</span>
                <span>{{ formatDate(order.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">تاریخ بروزرسانی:</span>
                <span>{{ formatDate(order.updated_at) }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>اطلاعات کاربر</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500">نام:</span>
                <span class="font-medium">{{ order.user?.name || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">ایمیل:</span>
                <span>{{ order.user?.email || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">تلفن:</span>
                <span>{{ order.user?.phone || '-' }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>اطلاعات آدرس</template>
          <template #content>
            <div v-if="order.address" class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500">نام گیرنده:</span>
                <span class="font-medium">{{ order.address.recipient_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">تلفن:</span>
                <span>{{ order.address.phone }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">استان:</span>
                <span>{{ order.address.state }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">شهر:</span>
                <span>{{ order.address.city }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">آدرس:</span>
                <span class="text-left">{{ order.address.address_line }}</span>
              </div>
              <div v-if="order.address.postal_code" class="flex justify-between">
                <span class="text-gray-500">کد پستی:</span>
                <span>{{ order.address.postal_code }}</span>
              </div>
            </div>
            <p v-else class="text-gray-400">اطلاعات آدرس موجود نیست</p>
          </template>
        </Card>

        <Card>
          <template #title>اطلاعات ارسال و پرداخت</template>
          <template #content>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-700 mb-2">ارسال</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">روش ارسال:</span>
                    <span>{{ order.shipping_method || order.shipping?.shipping_method || '-' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">هزینه ارسال:</span>
                    <span>{{ formatPrice(order.shipping_cost ?? order.shipping?.shipping_cost ?? 0) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">روز تحویل:</span>
                    <span>{{ order.delivery_day || order.shipping?.delivery_day || '-' }}</span>
                  </div>
                </div>
              </div>
              <Divider />
              <div>
                <h4 class="font-medium text-gray-700 mb-2">پرداخت</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">روش پرداخت:</span>
                    <span>{{ paymentMethodLabel(order.payment_method || order.payment?.payment_method) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">وضعیت پرداخت:</span>
                    <span>{{ paymentStatusLabel(order.payment_status || order.payment?.payment_status) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">قابل پرداخت:</span>
                    <span>{{ formatPrice(order.payable_amount ?? 0) }}</span>
                  </div>
                  <div v-if="order.wallet_amount" class="flex justify-between">
                    <span class="text-gray-500">از کیف پول:</span>
                    <span>{{ formatPrice(order.wallet_amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Card-to-card transfer review -->
        <Card v-if="(order.payment_method || order.payment?.payment_method) === 'card_to_card'" class="lg:col-span-2">
          <template #title>رسید کارت‌به‌کارت</template>
          <template #content>
            <div v-if="order.card_transfer_submitted_at" class="space-y-3 text-sm">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex justify-between gap-4">
                  <span class="text-gray-500">مبلغ اعلام‌شده:</span>
                  <span class="font-medium">{{ formatPrice(order.card_transfer_amount ?? 0) }}</span>
                </div>
                <div class="flex justify-between gap-4">
                  <span class="text-gray-500">شماره تراکنش:</span>
                  <span class="font-mono" dir="ltr">{{ order.card_transfer_ref || '-' }}</span>
                </div>
                <div class="flex justify-between gap-4">
                  <span class="text-gray-500">تاریخ واریز:</span>
                  <span>{{ order.card_transfer_date || '-' }}</span>
                </div>
                <div class="flex justify-between gap-4">
                  <span class="text-gray-500">زمان ثبت رسید:</span>
                  <span>{{ formatDate(order.card_transfer_submitted_at) }}</span>
                </div>
              </div>
              <div v-if="order.card_transfer_note">
                <span class="text-gray-500">توضیحات مشتری:</span>
                <p class="mt-1 rounded-lg bg-gray-50 p-3">{{ order.card_transfer_note }}</p>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">وضعیت بررسی:</span>
                <span
                  class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="reviewStatusClass(order.payment_review_status)"
                >
                  {{ reviewStatusLabel(order.payment_review_status) }}
                </span>
              </div>
              <div
                v-if="order.payment_review_status === 'pending_review' || !order.payment_review_status"
                class="flex flex-wrap gap-2 pt-2"
              >
                <Button
                  label="تأیید پرداخت"
                  icon="pi pi-check"
                  severity="success"
                  :loading="reviewingPayment"
                  @click="reviewPayment('approved')"
                />
                <Button
                  label="رد پرداخت"
                  icon="pi pi-times"
                  severity="danger"
                  outlined
                  :loading="reviewingPayment"
                  @click="reviewPayment('rejected')"
                />
              </div>
            </div>
            <p v-else class="text-gray-400 text-sm">
              هنوز رسید کارت‌به‌کارت از سمت مشتری ثبت نشده است.
            </p>
          </template>
        </Card>
      </div>

      <Card>
        <template #title>اقلام سفارش</template>
        <template #content>
          <DataTable :value="order.items || []" stripedRows responsiveLayout="scroll">
            <Column field="product.title" header="محصول">
              <template #body="{ data }">
                {{ data.product?.title || '-' }}
              </template>
            </Column>
            <Column field="quantity" header="تعداد">
              <template #body="{ data }">
                {{ data.quantity }}
              </template>
            </Column>
            <Column field="price" header="قیمت واحد">
              <template #body="{ data }">
                {{ formatPrice(data.price) }}
              </template>
            </Column>
            <Column header="قیمت کل">
              <template #body="{ data }">
                {{ formatPrice(data.price * data.quantity) }}
              </template>
            </Column>
          </DataTable>
          <div class="flex justify-end mt-4 pt-4 border-t">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between gap-8">
                <span class="text-gray-500">مبلغ کل:</span>
                <span>{{ formatPrice(order.total_amount) }}</span>
              </div>
              <div v-if="order.discount_amount" class="flex justify-between gap-8">
                <span class="text-gray-500">تخفیف:</span>
                <span class="text-red-600">-{{ formatPrice(order.discount_amount) }}</span>
              </div>
              <div class="flex justify-between gap-8 font-bold text-base">
                <span>مبلغ نهایی:</span>
                <span>{{ formatPrice(order.final_amount) }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="order.status_history?.length">
        <template #title>تاریخچه وضعیت</template>
        <template #content>
          <Timeline :value="order.status_history" align="alternate" class="w-full">
            <template #content="{ item }">
              <div class="py-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1"
                  :class="getStatusClass(item.status)"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
                <p v-if="item.note" class="text-sm text-gray-600 mt-1">{{ item.note }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.created_at) }}</p>
              </div>
            </template>
          </Timeline>
        </template>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import api from '@/composables/useAdminApi'
import type { Order, OrderStatus } from '@/types'

import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Divider from 'primevue/divider'
import Timeline from 'primevue/timeline'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const order = ref<Order | null>(null)
const loading = ref(true)
const trackingCode = ref('')
const selectedStatus = ref<OrderStatus>('pending')
const savingTracking = ref(false)
const savingStatus = ref(false)
const reviewingPayment = ref(false)

const statusOptions = [
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
  fetchOrder()
})

async function fetchOrder() {
  loading.value = true
  try {
    const res = await api.get(`/admin/orders/${route.params.id}`)
    order.value = res.data
    if (order.value) {
      trackingCode.value = order.value.tracking_code ?? ''
      selectedStatus.value = order.value.status
    }
  } catch (e: any) {
    const detail =
      e?.response?.data?.message ||
      e?.message ||
      'بارگذاری سفارش انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
    console.error('Admin order load error:', e)
    router.push('/orders')
  } finally {
    loading.value = false
  }
}

async function saveTrackingCode() {
  if (!order.value) return
  savingTracking.value = true
  try {
    await api.put(`/admin/orders/${order.value.id}/tracking-code`, {
      tracking_code: trackingCode.value,
    })
    order.value.tracking_code = trackingCode.value
    toast.add({ severity: 'success', summary: 'موفق', detail: 'کد پیگیری بروزرسانی شد', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بروزرسانی کد پیگیری انجام نشد', life: 3000 })
  } finally {
    savingTracking.value = false
  }
}

function paymentMethodLabel(method?: string) {
  const map: Record<string, string> = {
    card_to_card: 'کارت‌به‌کارت',
    cash_on_delivery: 'پرداخت در محل',
    wallet: 'کیف پول',
    online: 'آنلاین',
  }
  return method ? (map[method] || method) : '-'
}

function paymentStatusLabel(status?: string) {
  const map: Record<string, string> = {
    pending: 'در انتظار',
    paid: 'پرداخت شده',
    failed: 'ناموفق',
    refunded: 'بازگشت وجه',
  }
  return status ? (map[status] || status) : '-'
}

function reviewStatusLabel(status?: string | null) {
  if (status === 'approved') return 'تأیید شده'
  if (status === 'rejected') return 'رد شده'
  if (status === 'pending_review') return 'در انتظار بررسی'
  return 'ثبت نشده'
}

function reviewStatusClass(status?: string | null) {
  if (status === 'approved') return 'bg-green-100 text-green-800'
  if (status === 'rejected') return 'bg-red-100 text-red-800'
  if (status === 'pending_review') return 'bg-amber-100 text-amber-800'
  return 'bg-gray-100 text-gray-600'
}

async function reviewPayment(decision: 'approved' | 'rejected') {
  if (!order.value) return
  reviewingPayment.value = true
  try {
    const res = await api.post(`/admin/orders/${order.value.id}/review-payment`, { decision })
    order.value = res.data.data || res.data
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: decision === 'approved' ? 'پرداخت تأیید شد' : 'پرداخت رد شد',
      life: 3000,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بررسی پرداخت انجام نشد', life: 3000 })
  } finally {
    reviewingPayment.value = false
  }
}

async function saveStatus() {
  if (!order.value) return
  savingStatus.value = true
  try {
    await api.put(`/admin/orders/${order.value.id}/status`, {
      status: selectedStatus.value,
    })
    order.value.status = selectedStatus.value
    toast.add({ severity: 'success', summary: 'موفق', detail: 'وضعیت سفارش بروزرسانی شد', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بروزرسانی وضعیت انجام نشد', life: 3000 })
  } finally {
    savingStatus.value = false
  }
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

function goBack() {
  router.push('/orders')
}
</script>
