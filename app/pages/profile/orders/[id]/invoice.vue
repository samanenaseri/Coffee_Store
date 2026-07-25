<script setup lang="ts">
import type {
  PaymentMethod,
  PaymentStatus,
} from '#shared/order'
import { formatOrderDate } from '~/utils/orderNormalize'

definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
})

const route = useRoute()

const {
  order,
  orderPending,
  orderError,
  getOrderById,
  clearOrder,
} = useOrders()

const orderId = computed(() => String(route.params.id))

await getOrderById(orderId.value)

watch(orderId, async (newId) => {
  await getOrderById(newId)
})

onBeforeUnmount(() => {
  clearOrder()
})

useSeoMeta({
  title: () => {
    return order.value
        ? `فاکتور سفارش ${order.value.id}`
        : 'فاکتور سفارش'
  },
  robots: 'noindex, nofollow',
})

const paymentMethodLabel: Record<PaymentMethod, string> = {
  online: 'پرداخت آنلاین',
  wallet: 'کیف پول',
  cash_on_delivery: 'پرداخت در محل',
  card_to_card: 'کارت به کارت',
}

const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت‌شده',
  failed: 'ناموفق',
  refunded: 'بازپرداخت‌شده',
}

const formatDate = (date: string | undefined | null) =>
  formatOrderDate(date, { hour: '2-digit', minute: '2-digit' })

const printInvoice = () => {
  if (!import.meta.client) {
    return
  }

  window.print()
}
</script>

<template>
  <section>
    <!-- برگشت و چاپ -->
    <div
        class="no-print mb-6 flex flex-wrap items-center justify-between gap-4"
    >
      <NuxtLink
          :to="`/profile/orders/${orderId}`"
          class="inline-flex items-center gap-2 text-sm text-lightText transition hover:text-text"
      >
        <span>←</span>
        بازگشت به جزئیات سفارش
      </NuxtLink>

      <button
          v-if="order"
          type="button"
          class="rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-800"
          @click="printInvoice"
      >
        چاپ یا ذخیره PDF
      </button>
    </div>

    <!-- Loading -->
    <div
        v-if="orderPending"
        class="flex min-h-72 items-center justify-center text-lightText"
    >
      در حال دریافت فاکتور...
    </div>

    <!-- Error -->
    <div
        v-else-if="orderError"
        class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600"
    >
      امکان دریافت اطلاعات فاکتور وجود ندارد.
    </div>

    <!-- Invoice -->
    <article
        v-else-if="order"
        class="invoice mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm sm:p-8"
    >
      <!-- سربرگ فاکتور -->
      <header
          class="flex flex-col gap-6 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <h1 class="text-2xl font-bold">
            فاکتور فروش
          </h1>

          <p class="mt-2 text-sm text-gray-500">
            فروشگاه قهوه
          </p>
        </div>

        <div class="space-y-2 text-sm sm:text-left">
          <p>
            <span class="text-gray-500">شماره سفارش:</span>

            <strong class="mr-2">
              #{{ order.id }}
            </strong>
          </p>

          <p>
            <span class="text-gray-500">تاریخ ثبت:</span>

            <span class="mr-2">
              {{ formatDate(order.date || order.createdAt) }}
            </span>
          </p>
        </div>
      </header>

      <!-- خریدار و پرداخت -->
      <div class="mt-6 grid gap-6 sm:grid-cols-2">
        <section class="rounded-2xl bg-gray-50 p-5">
          <h2 class="font-bold">
            اطلاعات خریدار
          </h2>

          <div class="mt-4 space-y-3 text-sm">
            <p>
              <span class="text-gray-500">نام:</span>

              <span class="mr-2 font-medium">
                {{ order.address.receiverName }}
              </span>
            </p>

            <p>
              <span class="text-gray-500">شماره تماس:</span>

              <span
                  class="mr-2 font-medium"
                  dir="ltr"
              >
                {{ order.address.phone }}
              </span>
            </p>

            <p>
              <span class="text-gray-500">کدپستی:</span>

              <span
                  class="mr-2 font-medium"
                  dir="ltr"
              >
                {{ order.address.postalCode }}
              </span>
            </p>

            <div>
              <p class="text-gray-500">
                آدرس:
              </p>

              <p class="mt-1 leading-7">
                {{ order.address.province }}،
                {{ order.address.city }}،
                {{ order.address.address }}
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-2xl bg-gray-50 p-5">
          <h2 class="font-bold">
            اطلاعات پرداخت و ارسال
          </h2>

          <div class="mt-4 space-y-3 text-sm">
            <p>
              <span class="text-gray-500">روش پرداخت:</span>

              <span class="mr-2 font-medium">
                {{ paymentMethodLabel[order.payment.method] }}
              </span>
            </p>

            <p>
              <span class="text-gray-500">وضعیت پرداخت:</span>

              <span class="mr-2 font-medium">
                {{ paymentStatusLabel[order.payment.status] }}
              </span>
            </p>

            <p v-if="order.payment.transactionId">
              <span class="text-gray-500">شماره تراکنش:</span>

              <span
                  class="mr-2 font-medium"
                  dir="ltr"
              >
                {{ order.payment.transactionId }}
              </span>
            </p>

            <p>
              <span class="text-gray-500">روش ارسال:</span>

              <span class="mr-2 font-medium">
                {{ order.shipping.method }}
              </span>
            </p>

            <p v-if="order.shipping.trackingCode">
              <span class="text-gray-500">کد رهگیری:</span>

              <span
                  class="mr-2 font-medium"
                  dir="ltr"
              >
                {{ order.shipping.trackingCode }}
              </span>
            </p>
          </div>
        </section>
      </div>

      <!-- جدول اقلام -->
      <section class="mt-8">
        <h2 class="mb-4 font-bold">
          اقلام سفارش
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px] border-collapse text-sm">
            <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-200 px-4 py-3 text-right">
                ردیف
              </th>

              <th class="border border-gray-200 px-4 py-3 text-right">
                محصول
              </th>

              <th class="border border-gray-200 px-4 py-3 text-center">
                تعداد
              </th>

              <th class="border border-gray-200 px-4 py-3 text-left">
                قیمت واحد
              </th>

              <th class="border border-gray-200 px-4 py-3 text-left">
                مبلغ
              </th>
            </tr>
            </thead>

            <tbody>
            <tr
                v-for="(item, index) in order.items"
                :key="item.productId"
            >
              <td class="border border-gray-200 px-4 py-4">
                {{ index + 1 }}
              </td>

              <td class="border border-gray-200 px-4 py-4">
                <div class="flex items-center gap-3">
                  <img
                      :src="item.product.image"
                      :alt="item.product.title"
                      class="size-12 rounded-lg object-cover"
                  >

                  <span class="font-medium">
                      {{ item.product.title }}
                    </span>
                </div>
              </td>

              <td class="border border-gray-200 px-4 py-4 text-center">
                {{ item.quantity }}
              </td>

              <td class="border border-gray-200 px-4 py-4 text-left">
                {{ formatPrice(item.unitPrice) }}
              </td>

              <td class="border border-gray-200 px-4 py-4 text-left font-medium">
                {{ formatPrice(item.subtotal) }}

              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- جمع مبالغ و توضیحات -->
      <div class="mt-8 flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <section class="flex-1 lg:flex-1">
          <div class="flex h-full flex-col space-y-4 rounded-2xl bg-gray-50 p-5 text-sm">
            <div class="flex items-center justify-between gap-4">
            <span class="text-gray-500">
              مجموع کالاها
            </span>

              <span class="font-medium text-gray-900">
              {{ formatPrice(order.itemsSubtotal) }}

            </span>
            </div>

            <div class="flex items-center justify-between gap-4">
            <span class="text-gray-500">
              هزینه ارسال
            </span>

              <span class="font-medium text-gray-900">
              <template v-if="order.shipping.cost > 0">
                {{ formatPrice(order.shipping.cost) }}
              </template>

              <template v-else>
                رایگان
              </template>
            </span>
            </div>

            <div
                v-if="order.discountAmount > 0"
                class="flex items-center justify-between gap-4"
            >
            <span class="text-gray-500">
              تخفیف
            </span>

              <span class="font-medium text-green-600">
              -
              {{ formatPrice(order.discountAmount) }}

            </span>
            </div>

            <div
                v-if="order.taxAmount > 0"
                class="flex items-center justify-between gap-4"
            >
            <span class="text-gray-500">
              مالیات
            </span>

              <span class="font-medium text-gray-900">
              {{ formatPrice(order.taxAmount) }}
            </span>
            </div>

            <div
                class="flex items-center justify-between gap-4 border-t border-gray-200 pt-4"
            >
            <span class="font-bold text-gray-900">
              مبلغ نهایی
            </span>

              <span class="text-lg font-bold text-amber-700">
              {{ formatPrice(order.total) }}

            </span>
            </div>
          </div>
        </section>

        <section class="lg:flex-1">
          <div class="flex h-full flex-col space-y-4 rounded-2xl bg-gray-50 p-5">
            <span class="font-bold text-md text-gray-900">
              توضیحات
            </span>

            <p v-if="order.description" class="text-sm leading-7 text-gray-700">
              {{ order.description }}
            </p>

            <p v-else class="text-sm text-gray-400">
              توضیحی ثبت نشده است.
            </p>
          </div>
        </section>
      </div>


      <!-- توضیح پایین فاکتور -->
      <footer
          class="mt-8 border-t border-gray-200 pt-5 text-center text-xs leading-6 text-gray-500"
      >
        این فاکتور به‌صورت الکترونیکی صادر شده است.
      </footer>
    </article>
  </section>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  .no-print {
    display: none !important;
  }

  .invoice {
    max-width: none;
    border: 0;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }

  body {
    background: white !important;
  }
}
</style>