<script setup lang="ts">
import type { OrderStatus, PaymentMethod, PaymentStatus } from '#shared/order'
import { formatOrderDate } from '~/utils/orderNormalize'

definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
})

const route = useRoute()
const notification = useNotification()
const orderId = computed(() => {
  return String(route.params.id)
})
const {
  order,
  orderPending,
  orderError,
  getOrderById,
  clearOrder,

  actionPending,
  actionError,
  actionMessage,
  cancelOrder,
  requestReturn,
  clearActionState,
} = useOrders()

onMounted(() => {
  getOrderById(orderId.value)
})

watch(orderId, (id) => {
  getOrderById(id)
})

useSeoMeta({
  title: () =>
      order.value
          ? `جزئیات سفارش ${order.value.id}`
          : 'جزئیات سفارش',
})
const copyTrackingCode = async () => {
  const trackingCode = order.value?.shipping?.trackingCode

  if (!trackingCode) {
    return
  }

  try {
    await navigator.clipboard.writeText(trackingCode)

    notification.success(
        'کد رهگیری کپی شد',
        trackingCode,
    )
  } catch {
    notification.error(
        'کپی ناموفق بود',
        'امکان کپی کد رهگیری وجود ندارد.',
    )
  }
}
const statusMap: Record<
    OrderStatus,
    {
      label: string
      className: string
    }
> = {
  pending: {
    label: 'در انتظار پرداخت',
    className:
        'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },

  processing: {
    label: 'در حال پردازش',
    className:
        'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  },

  shipped: {
    label: 'ارسال‌شده',
    className:
        'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  },

  delivered: {
    label: 'تحویل‌شده',
    className:
        'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  },

  canceled: {
    label: 'لغوشده',
    className:
        'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  },

}

const formatDate = (date: string | undefined | null) => formatOrderDate(date)
type OrderActionType = 'cancel' | 'return'

const isActionModalOpen = ref(false)
const selectedActionType = ref<OrderActionType>('cancel')

const openActionModal = (type: OrderActionType) => {
  selectedActionType.value = type
  clearActionState()
  isActionModalOpen.value = true
}

const closeActionModal = () => {
  if (actionPending.value) {
    return
  }

  isActionModalOpen.value = false
  clearActionState()
}

const actionErrorMessage = computed(() => {
  const error = actionError.value

  if (!error || typeof error !== 'object') {
    return ''
  }

  if ('data' in error) {
    const data = error.data as {
      statusMessage?: string
      message?: string
    }

    return (
        data?.statusMessage
        || data?.message
        || 'ثبت درخواست با خطا مواجه شد.'
    )
  }

  return 'ثبت درخواست با خطا مواجه شد.'
})
const submitOrderAction = async (reason: string) => {
  if (!order.value) {
    return
  }

  const isCancel = selectedActionType.value === 'cancel'

  const successful = isCancel
      ? await cancelOrder(order.value.id, reason)
      : await requestReturn(order.value.id, reason)

  if (!successful) {
    notification.error(
        'ثبت درخواست ناموفق بود',
        actionErrorMessage.value,
    )

    return
  }

  isActionModalOpen.value = false

  notification.success(
      isCancel
          ? 'درخواست لغو ثبت شد'
          : 'درخواست مرجوعی ثبت شد',
      actionMessage.value,
  )
}
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

const paymentStatusClass: Record<PaymentStatus, string> = {
  pending: 'text-amber-600',
  paid: 'text-green-600',
  failed: 'text-red-600',
  refunded: 'text-blue-600',
}

</script>

<template>
  <section>
    <!-- برگشت -->
    <NuxtLink
        to="/profile/orders"
        class="mb-6 inline-flex items-center gap-2 text-sm text-lightText transition hover:text-text"
    >
      <span>←</span>
      بازگشت به سفارش‌ها
    </NuxtLink>

    <!-- Loading -->
    <div
        v-if="orderPending"
        class="flex min-h-72 items-center justify-center text-lightText"
    >
      در حال دریافت جزئیات سفارش...
    </div>

    <!-- Error -->
    <div
        v-else-if="orderError"
        class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30"
    >
      <h2 class="font-bold text-red-600 dark:text-red-400">
        سفارش پیدا نشد
      </h2>

      <p class="mt-2 text-sm text-red-500">
        امکان دریافت جزئیات این سفارش وجود ندارد.
      </p>

      <BaseButton
          size="sm"
          variant="primary"
          class="mt-5"
          @click="() => getOrderById(orderId)"
      >
        تلاش مجدد
      </BaseButton>
    </div>

    <template v-else-if="order">
      <!-- عنوان و وضعیت سفارش -->
      <section
          class="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
      >
        <div>
          <p class="text-sm text-lightText">
            شماره سفارش
          </p>

          <h1 class="mt-1 text-xl font-bold text-text">
            #{{ order.id }}
          </h1>

          <p class="mt-2 text-sm text-lightText">
            ثبت‌شده در {{ formatDate(order.date || order.createdAt) }}
          </p>
        </div>

        <span
            class="rounded-full px-4 py-2 text-xs font-medium"
            :class="(statusMap[order.status] || statusMap.pending).className"
        >
      {{ (statusMap[order.status] || statusMap.pending).label }}
    </span>
      </section>

      <!-- عملیات لغو و مرجوعی -->
      <section class="mb-6 flex flex-wrap items-center gap-3">
        <button
            v-if="
        ['pending', 'processing'].includes(order.status)
          && order.actionStatus === 'none'
      "
            type="button"
            class="rounded-xl border border-red-600 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20"
            @click="openActionModal('cancel')"
        >
          لغو سفارش
        </button>

        <button
            v-if="
        order.status === 'delivered'
          && order.actionStatus === 'none'
      "
            type="button"
            class="rounded-xl border border-amber-700 dark:border-amber-500 px-5 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-500  transition hover:bg-amber-50 dark:hover:bg-amber-950/20"
            @click="openActionModal('return')"
        >
          درخواست مرجوعی
        </button>

        <div
            v-if="order.status === 'canceled' || order.actionStatus === 'cancel_approved'"
            class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300"
        >
          این سفارش لغو شده است.
          <span v-if="order.cancelReason" class="block mt-1 text-xs opacity-80">
            دلیل: {{ order.cancelReason }}
          </span>
        </div>

        <div
            v-else-if="order.actionStatus === 'cancel_requested'"
            class="rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-700 dark:bg-orange-950/20 dark:text-orange-300"
        >
          درخواست لغو این سفارش ثبت شده و در حال بررسی است.
        </div>

        <div
            v-if="order.actionStatus === 'return_requested'"
            class="rounded-xl bg-cyan-50 px-4 py-3 text-sm text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-300"
        >
          درخواست مرجوعی این سفارش ثبت شده و در حال بررسی است.
        </div>

      </section>

      <!-- تایم‌لاین سفارش -->
      <section
          v-if="order.statusHistory?.length"
          class="mb-6 rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
      >
        <h2 class="mb-6 font-bold text-text">
          وضعیت سفارش
        </h2>

        <OrderTimeline :history="order.statusHistory || []"/>
      </section>

      <!-- اقلام سفارش -->
      <section
          class="rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
      >
        <div class="mb-5 flex items-center justify-between gap-4">
          <h2 class="font-bold text-text">
            اقلام سفارش
          </h2>

          <span class="text-sm text-lightText">
        {{ order.itemsCount }} محصول
      </span>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <article
              v-for="item in order.items"
              :key="item.productId"
              class="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
          >
            <!-- تصویر محصول -->
            <NuxtLink
                :to="`/products/${item.product.slug}`"
                class="group/product relative size-24 shrink-0"
            >
              <div
                  class="h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              >
                <img
                    :src="item.product.image"
                    :alt="item.product.title"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover/product:scale-110"
                >
              </div>

              <span
                  class="absolute -right-2 -top-2 flex min-h-6 min-w-6 items-center justify-center rounded-full bg-amber-700 px-1.5 text-xs font-bold text-white shadow"
              >
            {{ item.quantity }}
          </span>
            </NuxtLink>

            <!-- مشخصات محصول -->
            <div class="min-w-0 flex-1">
              <NuxtLink
                  :to="`/products/${item.product.slug}`"
                  class="font-bold text-text transition hover:text-amber-700"
              >
                {{ item.product.title }}
              </NuxtLink>

              <div class="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p class="text-lightText">
                    قیمت واحد
                  </p>

                  <p class="mt-1 font-medium text-text">
                    {{ formatPrice(item.unitPrice) }}
                    تومان
                  </p>
                </div>

                <div>
                  <p class="text-lightText">
                    تعداد
                  </p>

                  <p class="mt-1 font-medium text-text">
                    {{ item.quantity }}
                  </p>
                </div>

                <div>
                  <p class="text-lightText">
                    جمع محصول
                  </p>

                  <p class="mt-1 font-bold text-text">
                    {{ formatPrice(item.subtotal) }}
                    تومان
                  </p>

                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- تحویل و ارسال -->
      <div class="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
        <!-- اطلاعات تحویل -->
        <section
            class="rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
        >
          <h2 class="font-bold text-text">
            اطلاعات تحویل
          </h2>

          <div class="mt-5 space-y-4 text-sm">
            <div class=" flex flex-col gap-6 lg:flex-row">
              <p class="text-lightText">
                تحویل‌گیرنده
              </p>

              <p class="font-medium text-text">
                {{ order.address.receiverName }}
              </p>
            </div>

            <div class=" flex flex-col gap-6 lg:flex-row">
              <p class="text-lightText">
                شماره تماس
              </p>

              <p
                  class="text-right font-medium text-text"
                  dir="ltr"
              >
                {{ order.address.phone }}
              </p>
            </div>

            <div class=" flex flex-col gap-6 lg:flex-row">
              <p class="text-lightText">
                آدرس
              </p>

              <p class="leading-7 text-text">
                {{ order.address.province }}،
                {{ order.address.city }}،
                {{ order.address.address }}
              </p>
            </div>

            <div class="flex flex-col gap-6 lg:flex-row">
              <p class="text-lightText">
                کدپستی
              </p>

              <p
                  class="text-right font-medium text-text"
                  dir="ltr"
              >
                {{ order.address.postalCode }}
              </p>
            </div>
          </div>
        </section>

        <!-- اطلاعات ارسال -->
        <section
            class="rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
        >
          <h2 class="font-bold text-text">
            اطلاعات ارسال
          </h2>

          <div class="mt-5 space-y-4 text-sm">
            <div class=" flex flex-col gap-6 lg:flex-row">
              <p class="text-lightText">
                روش ارسال
              </p>

              <p class="font-medium text-text">
                {{ order.shipping.method }}
              </p>
            </div>

            <div class=" flex flex-col gap-6 lg:flex-row"
                 v-if="order.shipping.trackingCode">
              <p class="text-lightText">
                کد رهگیری
              </p>

              <div class="flex flex-wrap items-center gap-3">
                <p
                    class="font-medium text-text"
                    dir="ltr"
                >
                  {{ order.shipping.trackingCode }}
                </p>

                <button
                    type="button"
                    class="text-xs font-medium text-amber-700 transition hover:text-amber-800"
                    @click="copyTrackingCode"
                >
                  کپی
                </button>
              </div>
            </div>

            <div class=" flex flex-col gap-6 lg:flex-row"
                 v-if="order.shipping.estimatedDeliveryDate">
              <p class="text-lightText">
                زمان تقریبی تحویل
              </p>

              <p class="font-medium text-text">
                {{ formatDate(order.shipping.estimatedDeliveryDate) }}
              </p>
            </div>

            <div class=" flex flex-col gap-6 lg:flex-row"
                 v-if="order.shipping.deliveredAt">
              <p class="text-lightText">
                زمان تحویل
              </p>

              <p class=" font-medium text-green-600">
                {{ formatDate(order.shipping.deliveredAt) }}
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- پرداخت و خلاصه مبلغ -->
      <div class="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <!-- اطلاعات پرداخت -->
        <section
            class="rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
        >
          <h2 class="font-bold text-text">
            اطلاعات پرداخت
          </h2>

          <div class="mt-5 space-y-6 text-sm">
            <div class=" flex flex-col gap-6 lg:flex-row">
              <p class="text-sm text-lightText">
                روش پرداخت
              </p>

              <p class="font-medium text-text">
                {{ paymentMethodLabel[order.payment?.method] || '—' }}
              </p>
            </div>

            <div class=" flex flex-col gap-6 lg:flex-row">
              <p class="text-sm text-lightText">
                وضعیت پرداخت
              </p>

              <p
                  class="font-medium"
                  :class="paymentStatusClass[order.payment?.status] || 'text-amber-600'"
              >
                {{ paymentStatusLabel[order.payment?.status] || '—' }}
              </p>
            </div>

            <div class=" flex flex-col gap-6 lg:flex-row"
            >
              <p class="text-sm text-lightText">
                شماره تراکنش
              </p>

              <p
                  class=" text-right font-medium text-text"
                  dir="ltr"
              >
                {{ order.payment?.transactionId ? order.payment.transactionId : ' - ' }}
              </p>

            </div>

            <div class="flex flex-col gap-6 lg:flex-row">
              <p class="text-sm text-lightText">
                زمان پرداخت
              </p>

              <p class=" font-medium text-text">
                {{ order.payment.paidAt ? formatDate(order.payment.paidAt) : ' - ' }}
              </p>
            </div>
          </div>
        </section>

        <!-- خلاصه پرداخت -->
        <section
            class="rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
        >
          <h2 class="font-bold text-text">
            خلاصه پرداخت
          </h2>

          <div class="mt-5 space-y-4 text-sm">
            <div class="flex items-center justify-between gap-4">
          <span class="text-lightText">
            مبلغ کالاها
          </span>

              <span class="font-medium text-text">
            {{ formatPrice(order.itemsSubtotal) }}
            تومان
          </span>
            </div>

            <div class="flex items-center justify-between gap-4">
          <span class="text-lightText">
            هزینه ارسال
          </span>

              <span class="font-medium text-text">
            <template v-if="order.shipping.cost > 0">
              {{ formatPrice(order.shipping.cost) }}
              تومان
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
          <span class="text-lightText">
            تخفیف
          </span>

              <span class="font-medium text-green-600">
            -
            {{ formatPrice(order.discountAmount) }}
            تومان
          </span>
            </div>

            <div
                v-if="order.taxAmount > 0"
                class="flex items-center justify-between gap-4"
            >
          <span class="text-lightText">
            مالیات
          </span>

              <span class="font-medium text-text">
            {{ formatPrice(order.taxAmount) }}
            تومان
          </span>
            </div>

            <div
                class="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800"
            >
          <span class="font-bold text-text">
            مبلغ نهایی
          </span>

              <span class="text-lg font-bold text-amber-700">
            {{ formatPrice(order.total) }}
            تومان
          </span>
            </div>
          </div>
        </section>
        <!--خرید مجدد-->
        <section
            class="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700 sm:flex-row sm:flex-wrap"
        >
          <NuxtLink
              v-if="order.payment?.status === 'paid'"
              :to="`/profile/orders/${order.id}/invoice`"
              class="rounded-xl border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-text transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            مشاهده فاکتور
          </NuxtLink>


          <NuxtLink
              :to="{path: '/profile/support',
              query: {orderId: order.id,},}"
              class="rounded-xl border border-amber-700 px-5 py-2.5 text-center text-sm font-medium text-amber-700 transition hover:bg-amber-50 dark:hover:bg-amber-950/20">
            پیگیری از پشتیبانی
          </NuxtLink>
        </section>
      </div>

      <!-- مودال لغو یا مرجوعی -->
      <OrderActionModal
          :open="isActionModalOpen"
          :type="selectedActionType"
          :pending="actionPending"
          :error-message="actionErrorMessage"
          @close="closeActionModal"
          @submit="submitOrderAction"
      />
    </template>
  </section>
</template>