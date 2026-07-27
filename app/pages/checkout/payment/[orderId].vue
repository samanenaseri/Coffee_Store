<script setup lang="ts">
import type { Order } from '#shared/order'
import CardTransferForm from '~/components/order/payment/CardTransferForm.vue'
import CardTransferPending from '~/components/order/payment/CardTransferPending.vue'
import CashOnDeliveryInfo from '~/components/order/payment/CashOnDeliveryInfo.vue'
import WalletPaidInfo from '~/components/order/payment/WalletPaidInfo.vue'

definePageMeta({
  middleware: ['auth'],
})

useSeoMeta({
  title: 'تکمیل پرداخت | قهوه‌فروشی',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const { apiFetch } = useApi()
const { settings, fetchSettings } = useSettings()
const notification = useNotification()

await fetchSettings()

const orderId = computed(() => Number(route.params.orderId))

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref('')
const submitting = ref(false)

function normalizeOrder(raw: any): Order | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw.order || raw.data || raw
  if (!o || typeof o !== 'object' || o.id == null) return null
  return o as Order
}

async function loadOrder() {
  if (!orderId.value || Number.isNaN(orderId.value)) {
    error.value = 'شناسه سفارش نامعتبر است.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch<any>(`/profile/orders/${orderId.value}`)
    const normalized = normalizeOrder(res)
    if (!normalized) {
      error.value = 'سفارش یافت نشد.'
      order.value = null
      return
    }
    order.value = normalized
  } catch (e: any) {
    const status = e?.statusCode || e?.status || e?.response?.status
    if (status === 404) {
      error.value = 'سفارش یافت نشد یا متعلق به حساب شما نیست.'
    } else if (status === 401) {
      error.value = 'برای مشاهده این صفحه باید وارد حساب کاربری شوید.'
    } else {
      error.value = e?.data?.message || e?.message || 'بارگذاری سفارش ناموفق بود.'
    }
    order.value = null
  } finally {
    loading.value = false
  }
}

await loadOrder()

const paymentMethod = computed(() =>
  String(order.value?.paymentMethod || order.value?.payment_method || '').trim(),
)

const paymentStatus = computed(() =>
  String(order.value?.paymentStatus || order.value?.payment_status || 'pending'),
)

const reviewStatus = computed(() => {
  const r = order.value?.paymentReviewStatus ?? order.value?.payment_review_status ?? null
  return r == null || r === '' ? null : String(r)
})

const payableAmount = computed(() =>
  Number(order.value?.payableAmount ?? order.value?.payable_amount ?? order.value?.total ?? 0),
)

const totalAmount = computed(() => Number(order.value?.total ?? 0))

/** Show deposit form when not paid and not already waiting for admin */
const showTransferForm = computed(() => {
  if (!order.value) return false
  if (paymentStatus.value === 'paid') return false
  if (paymentMethod.value === 'cash_on_delivery') return false
  if (paymentMethod.value === 'wallet' && paymentStatus.value === 'paid') return false
  if (reviewStatus.value === 'pending_review' || reviewStatus.value === 'approved') return false
  // card_to_card / online / empty / rejected → show form so user can register deposit
  return true
})

const showTransferPending = computed(() => {
  if (!order.value) return false
  if (paymentStatus.value === 'paid') return false
  if (reviewStatus.value === 'pending_review') return true
  return !!(
    order.value.cardTransferSubmittedAt || order.value.card_transfer_submitted_at
  )
})

const formatPrice = (n: number) =>
  new Intl.NumberFormat('fa-IR').format(Math.round((n || 0) / 10))

const bankCardNumber = computed(() =>
  String(
    (settings.value as any).bank_card_number
    || (settings.value as any).bankCardNumber
    || '6037-9911-1234-5678',
  ),
)
const bankCardHolder = computed(() =>
  String(
    (settings.value as any).bank_card_holder
    || (settings.value as any).bankCardHolder
    || 'فروشگاه قهوه استور',
  ),
)
const bankName = computed(() =>
  String(
    (settings.value as any).bank_name
    || (settings.value as any).bankName
    || 'کارت مقصد فروشگاه',
  ),
)

async function onCardTransferSubmit(payload: {
  amount: number
  transaction_ref: string
  transfer_date: string
  note?: string
}) {
  submitting.value = true
  try {
    const res = await apiFetch<any>(
      `/orders/${orderId.value}/card-transfer`,
      {
        method: 'POST',
        body: payload,
      },
    )
    if (res?.data || res?.order) {
      order.value = normalizeOrder(res) || order.value
    }
    notification.success(
      'ثبت شد',
      res?.message || 'اطلاعات واریز ثبت شد و منتظر تأیید مدیر است.',
    )
    await loadOrder()
  } catch (e: any) {
    const msg =
      e?.data?.message
      || e?.data?.errors?.transaction_ref?.[0]
      || e?.data?.errors?.amount?.[0]
      || e?.data?.errors?.transfer_date?.[0]
      || e?.message
      || 'ثبت اطلاعات واریز ناموفق بود.'
    notification.error('خطا', msg)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background pb-24 pt-28">
    <div class="container mx-auto max-w-xl px-4">
      <!-- Success header -->
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 shadow-sm ring-4 ring-emerald-50 dark:ring-emerald-950/20">
          <span class="text-3xl" aria-hidden="true">✓</span>
        </div>
        <h1 class="text-2xl font-bold text-text">
          سفارش شما ثبت شد
        </h1>
        <p class="mt-2 text-sm text-lightText leading-7 max-w-sm mx-auto">
          برای تکمیل خرید، مبلغ را واریز کنید و اطلاعات واریز را در همین صفحه ثبت کنید.
        </p>
      </div>

      <div v-if="loading" class="space-y-4" aria-busy="true">
        <div class="h-36 animate-pulse rounded-2xl bg-text/10" />
        <div class="h-80 animate-pulse rounded-2xl bg-text/10" />
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-6 text-center text-red-600"
      >
        <p class="font-medium">
          {{ error }}
        </p>
        <div class="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            class="rounded-xl bg-amber-800 px-5 py-2.5 text-sm text-white hover:bg-amber-900 transition"
            @click="loadOrder"
          >
            تلاش مجدد
          </button>
          <NuxtLink
            to="/profile/orders"
            class="rounded-xl border border-input px-5 py-2.5 text-sm text-text hover:border-amber-700 transition"
          >
            سفارش‌های من
          </NuxtLink>
        </div>
      </div>

      <template v-else-if="order">
        <!-- Order summary -->
        <div class="mb-6 rounded-2xl border border-input bg-menu p-5 shadow-sm space-y-3 text-sm">
          <h2 class="font-bold text-text text-base mb-1 flex items-center gap-2">
            <span class="inline-block size-1.5 rounded-full bg-amber-700" />
            خلاصه سفارش
          </h2>
          <div class="flex justify-between gap-3">
            <span class="text-lightText">شماره سفارش</span>
            <span class="font-bold text-text">#{{ order.id }}</span>
          </div>
          <div class="flex justify-between gap-3">
            <span class="text-lightText">مبلغ کل</span>
            <span class="text-text">{{ formatPrice(totalAmount) }} تومان</span>
          </div>
          <div class="flex justify-between gap-3 border-t border-input/60 pt-3">
            <span class="text-lightText">قابل پرداخت</span>
            <span class="font-bold text-amber-800 text-base">{{ formatPrice(payableAmount) }} تومان</span>
          </div>
          <div class="flex justify-between gap-3">
            <span class="text-lightText">روش پرداخت</span>
            <span class="text-text font-medium">
              <template v-if="paymentMethod === 'card_to_card' || paymentMethod === 'online'">کارت‌به‌کارت</template>
              <template v-else-if="paymentMethod === 'cash_on_delivery'">پرداخت در محل</template>
              <template v-else-if="paymentMethod === 'wallet'">کیف پول</template>
              <template v-else>{{ paymentMethod || 'کارت‌به‌کارت' }}</template>
            </span>
          </div>
          <div class="flex justify-between gap-3">
            <span class="text-lightText">وضعیت پرداخت</span>
            <span
              class="font-medium"
              :class="{
                'text-emerald-700': paymentStatus === 'paid',
                'text-amber-700': paymentStatus !== 'paid',
              }"
            >
              {{
                paymentStatus === 'paid'
                  ? 'پرداخت شده'
                  : (reviewStatus === 'pending_review' ? 'در انتظار بررسی' : 'در انتظار پرداخت')
              }}
            </span>
          </div>
        </div>

        <!-- Paid wallet -->
        <WalletPaidInfo
          v-if="paymentMethod === 'wallet' && paymentStatus === 'paid'"
          :order-id="order.id"
        />

        <!-- Paid other -->
        <div
          v-else-if="paymentStatus === 'paid'"
          class="rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 p-5"
        >
          <h3 class="text-lg font-bold text-emerald-800 dark:text-emerald-300">
            پرداخت تأیید شد
          </h3>
          <p class="mt-2 text-sm text-lightText leading-7">
            پرداخت سفارش #{{ order.id }} با موفقیت تأیید شده است.
          </p>
        </div>

        <!-- COD -->
        <CashOnDeliveryInfo
          v-else-if="paymentMethod === 'cash_on_delivery'"
          :order-id="order.id"
          :payable-amount="payableAmount"
        />

        <!-- Card transfer form / pending -->
        <template v-else>
          <CardTransferPending
            v-if="showTransferPending && !showTransferForm"
            :amount="order.cardTransferAmount ?? order.card_transfer_amount"
            :ref-code="order.cardTransferRef ?? order.card_transfer_ref"
            :date="order.cardTransferDate ?? order.card_transfer_date"
            :review-status="reviewStatus"
          />

          <CardTransferForm
            v-else
            :order-id="order.id"
            :payable-amount="payableAmount"
            :bank-card-number="bankCardNumber"
            :bank-card-holder="bankCardHolder"
            :bank-name="bankName"
            :submitting="submitting"
            @submit="onCardTransferSubmit"
          />

          <p
            v-if="reviewStatus === 'rejected'"
            class="mt-3 text-sm text-red-600 text-center leading-6"
          >
            رسید قبلی رد شده است. لطفاً اطلاعات واریز را دوباره وارد و ثبت کنید.
          </p>
        </template>

        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink
            :to="`/profile/orders/${order.id}`"
            class="rounded-xl border border-input px-6 py-3 text-center text-sm font-medium text-text hover:border-amber-700 transition"
          >
            جزئیات سفارش
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="rounded-xl bg-stone-800 px-6 py-3 text-center text-sm font-medium text-white hover:bg-stone-900 transition"
          >
            تایید خرید
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>
