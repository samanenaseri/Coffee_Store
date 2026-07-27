<script setup lang="ts">
import type { Order, OrderStatus, OrderWithProducts } from '#shared/order'
import { formatOrderDate } from '~/utils/orderNormalize'

definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'سفارش‌های من | فروشگاه قهوه',
  description: 'مشاهده و پیگیری سفارش‌های ثبت‌شده',
})

type OrderTab = 'all' | 'current' | 'sent' | 'canceled'

const notification = useNotification()
const cartStore = useCartStore()
const router = useRouter()

const {
  orders,
  pending,
  error,
  refresh,
} = useOrders()

const search = ref('')
const activeTab = ref<OrderTab>('all')

const tabs: Array<{
  key: OrderTab
  label: string
}> = [
  {
    key: 'all',
    label: 'همه',
  },
  {
    key: 'current',
    label: 'جاری',
  },
  {
    key: 'sent',
    label: 'ارسال‌شده',
  },
  {
    key: 'canceled',
    label: 'لغوشده',
  },
]

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
        'bg-amber-100 text-amber-700 border border-amber-500 dark:bg-amber-950/40 dark:text-amber-300',
  },

  processing: {
    label: 'در حال پردازش',
    className:
        'bg-blue-100 text-blue-700 border border-blue-500 dark:bg-blue-950/40 dark:text-blue-300',
  },

  shipped: {
    label: 'ارسال‌شده',
    className:
        'bg-violet-100 text-violet-700 border border-violet-500 dark:bg-violet-950/40 dark:text-violet-300',
  },

  delivered: {
    label: 'تحویل‌شده',
    className:
        'bg-green-100 text-green-700 border border-green-500 dark:bg-green-950/40 dark:text-green-300',
  },

  canceled: {
    label: 'لغوشده',
    className:
        'bg-red-100 text-red-700 border border-red-500 dark:bg-red-950/40 dark:text-red-300',
  },
}

const isCanceledLike = (order: Order | OrderWithProducts) => {
  // Final cancelled status (normalizer maps cancelled → canceled)
  if (order.status === 'canceled') return true

  const action = String(order.actionStatus ?? (order as any).action_status ?? 'none')
  // Cancel request in progress or approved
  if (action === 'cancel_requested' || action === 'cancel_approved') return true

  // Legacy: reason/timestamp without proper status flags
  if (order.cancelReason || order.cancelRequestedAt) return true

  return false
}

const orderStatusBadge = (order: Order | OrderWithProducts) => {
  if (isCanceledLike(order)) {
    const action = String(order.actionStatus ?? 'none')
    if (action === 'cancel_requested' && order.status !== 'canceled') {
      return {
        label: 'درخواست لغو',
        className:
          'bg-orange-100 text-orange-700 border border-orange-500 dark:bg-orange-950/40 dark:text-orange-300',
      }
    }
    return statusMap.canceled
  }
  return statusMap[order.status] || statusMap.pending
}

const isCurrentOrder = (order: Order | OrderWithProducts) => {
  if (isCanceledLike(order)) return false
  return ['pending', 'processing'].includes(order.status)
}

const isSentOrder = (order: Order | OrderWithProducts) => {
  if (isCanceledLike(order)) return false
  return ['shipped', 'delivered'].includes(order.status)
}

const matchesTab = (order: Order | OrderWithProducts) => {
  switch (activeTab.value) {
    case 'current':
      return isCurrentOrder(order)

    case 'sent':
      return isSentOrder(order)

    case 'canceled':
      return isCanceledLike(order)

    default:
      return true
  }
}

const filteredOrders = computed(() => {
  const searchValue = search.value.trim().toLowerCase()

  return orders.value.filter((order) => {
    const matchesSearch =
        !searchValue ||
        String(order.id).toLowerCase().includes(searchValue)

    return matchesSearch && matchesTab(order)
  })
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const formatDate = (date: string | undefined | null) => formatOrderDate(date)

const reorderPending = ref<number | null>(null)

const reorder = async (order: OrderWithProducts) => {
  if (reorderPending.value) {
    return
  }

  reorderPending.value = order.id

  try {
    cartStore.addMultipleToCart(
        order.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
        })),
    )

    notification.success(
        'محصولات به سبد خرید اضافه شدند',
        `${order.itemsCount} قلم از سفارش قبلی به سبد خرید اضافه شد.`,
    )

    await router.push('/cart')
  }
  catch {
    notification.error(
        'خرید مجدد ناموفق بود',
        'امکان افزودن محصولات به سبد خرید وجود ندارد.',
    )
  }
  finally {
    reorderPending.value = null
  }
}
</script>

<template>
  <section>
    <!-- عنوان صفحه -->
    <div class="mb-7">
      <h1 class="text-2xl font-bold text-text">
        سفارش‌های من
      </h1>

      <p class="mt-2 text-sm leading-7 text-lightText">
        سفارش‌های خود را جست‌وجو و پیگیری کنید.
      </p>
    </div>

    <!-- جست‌وجو -->
    <div class="mb-6">
      <BaseInput
          v-model="search"
          type="search"
          placeholder="شماره سفارش را وارد کنید..."
      />
    </div>

    <!-- تب‌ها -->
    <div
        class="mb-7 flex gap-2 overflow-x-auto border-b border-delivery dark:border-hover  pb-3 dark:border-gray-700"
    >
      <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="shrink-0 rounded-lg px-5 py-2.5 text-sm transition-all duration-300"
          :class="
          activeTab === tab.key
            ? 'bg-menu font-semibold text-text shadow-md dark:shadow-hover'
            : 'text-lightText hover:text-amber-600'
        "
          @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div
        v-if="pending"
        class="flex min-h-64 items-center justify-center text-lightText"
    >
      در حال دریافت سفارش‌ها...
    </div>

    <!-- Error -->
    <div
        v-else-if="error"
        class="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30"
    >
      <pre
          v-if="error"
          class="text-left text-sm text-red-500"
      >
  {{ error }}
</pre>
      <p class="text-sm text-red-600 dark:text-red-400">
        دریافت سفارش‌ها با خطا مواجه شد.
      </p>

      <BaseButton
          variant="primary"
          size="sm"
          class-name="mt-4"
          @click="refresh"
      >
        تلاش مجدد
      </BaseButton>
    </div>

    <!-- Empty state -->
    <div
        v-else-if="filteredOrders.length === 0"
        class="rounded-xl border border-dashed border-gray-300 px-5 py-16 text-center dark:border-gray-700"
    >
      <h2 class="font-bold text-text">
        سفارشی پیدا نشد
      </h2>

      <p class="mt-2 text-sm text-lightText">
        شماره سفارش یا دسته‌بندی انتخاب‌شده را بررسی کنید.
      </p>
    </div>

    <!-- لیست سفارش‌ها -->
    <div
        v-else
        class="space-y-4"
    >
      <article
          v-for="order in filteredOrders"
          :key="order.id"
          class="rounded-xl border border-delivery dark:border-hover bg-bg p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700"
      >
        <!-- بخش بالای کارت -->
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs text-lightText">
              شماره سفارش
            </p>

            <p class="mt-1 font-bold text-text">
              #{{ order.id }}
            </p>
          </div>

          <span
              class="rounded-full px-3 py-1.5 text-xs font-medium "
              :class="orderStatusBadge(order).className"
          >
            {{ orderStatusBadge(order).label }}
          </span>
        </div>

        <!-- اطلاعات سفارش -->
        <div
            class="mt-5 grid grid-cols-1 gap-4 border-y border-gray-100 py-4 text-sm dark:border-gray-800 sm:grid-cols-3"
        >
          <div>
            <p class="text-lightText">
              تاریخ ثبت
            </p>

            <p class="mt-1 font-medium text-text">
              {{ formatDate(order.date || order.createdAt) }}
            </p>
          </div>

          <div>
            <p class="text-lightText">
              تعداد محصولات
            </p>

            <p class="mt-1 font-medium text-text">
              {{ order.itemsCount }} محصول
            </p>
          </div>

          <div>
            <p class="text-lightText">
              مبلغ سفارش
            </p>

            <p class="mt-1 font-bold text-text">
              {{ formatPrice(order.total) }}
              تومان
            </p>
          </div>
        </div>

        <!-- پایین کارت -->
        <div class="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex gap-2">
            <NuxtLink
                v-for="item in order.items"
                :key="item.productId"
                :to="`/products/${item.product.slug}`"
                :title="item.product.title"
                class="group/product relative block"
            >
              <div
                  class="size-16 overflow-hidden rounded-xl border border-delivery dark:border-hover bg-white shadow-sm transition-all duration-300 group-hover/product:-translate-y-1 group-hover/product:shadow-md"
              >
                <img
                    :src="item.product.image"
                    :alt="item.product.title"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover/product:scale-110"
                >
              </div>

              <span
                  class="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amber-700 px-1 text-[10px] font-bold text-white"
              >
      {{ item.quantity }}
    </span>
            </NuxtLink>
          </div>
            <div class="flex gap-3">
              <base-button
                  variant="outline"
                  size="sm"
              >
                <NuxtLink
                    :to="`/profile/orders/${order.id}`"
                >
                  مشاهده جزئیات
                </NuxtLink>
              </base-button>
              <base-button
                  size="sm"
                  :disabled="reorderPending === order.id"
                  @click="reorder(order)"
              >
                {{ reorderPending === order.id ? 'در حال افزودن...' : 'خرید مجدد' }}
              </base-button>
            </div>

        </div>
      </article>
    </div>
  </section>
</template>