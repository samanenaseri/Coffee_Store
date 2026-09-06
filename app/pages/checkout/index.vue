<script setup lang="ts">
import { reactive } from 'vue'
import type { CreateAddressPayload } from '#shared/address'
import CreateAddressModal from '~/components/profile/address/CreateAddressModal.vue'

useSeoMeta({
  title: "تسویه حساب | قهوه‌فروشی",
  robots: "noindex, nofollow",
})

const addressStore = useAddressStore()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const walletStore = useWalletStore()
const notification = useNotification()
const router = useRouter()
const { resolveUrl } = useImageUrl()

definePageMeta({
  middleware: ['auth'],
})

if (cartStore.items.length === 0) {
  router.replace('/cart')
}

onMounted(async () => {
  checkoutStore.setStepForAuth(true)
  checkoutStore.refreshDeliveryOptions()

  await Promise.all([
    addressStore.fetchAddresses(true),
    walletStore.fetchWallet(),
  ])

  // Auto-select default address if available
  if (!checkoutStore.selectedAddressId && addressStore.defaultAddress) {
    checkoutStore.setAddress(addressStore.defaultAddress.id)
  }
})

const {
  items: addresses,
  pending: addressesPending,
  submitting: addressSubmitting,
  actionError: addressActionError,
  defaultAddress,
} = storeToRefs(addressStore)

const {
  selectedAddressId,
  selectedAddress,
} = storeToRefs(checkoutStore)

const {
  balanceInToman,
} = storeToRefs(walletStore)

const createAddressModalOpen = ref(false)

const errors = reactive({
  address: '',
  general: '',
})

/** Group delivery slots by date for UI */
const deliveryGroups = computed(() => {
  const map = new Map<string, {
    date: string
    weekdayLabel: string
    dateLabel: string
    slots: typeof checkoutStore.deliveryOptions
  }>()

  for (const opt of checkoutStore.deliveryOptions) {
    if (!map.has(opt.date)) {
      map.set(opt.date, {
        date: opt.date,
        weekdayLabel: opt.weekdayLabel,
        dateLabel: opt.dateLabel,
        slots: [],
      })
    }
    map.get(opt.date)!.slots.push(opt)
  }

  return Array.from(map.values())
})

const handleNext = () => {
  errors.address = ''
  errors.general = ''

  const validationError = checkoutStore.validateSelection()
  if (validationError) {
    errors.general = validationError
    return
  }

  checkoutStore.nextStep()
}

const selectAddress = (id: number) => {
  checkoutStore.setAddress(id)
  errors.address = ''
}

const openCreateAddressModal = () => {
  addressStore.clearActionError()
  createAddressModalOpen.value = true
}

const submitCreateAddress = async (payload: CreateAddressPayload) => {
  const response = await addressStore.createAddress(payload)

  if (response) {
    checkoutStore.setAddress(response.id)
    createAddressModalOpen.value = false
    notification.success('موفق', 'آدرس جدید ثبت شد.')
    // Ensure list is in sync with server
    await addressStore.fetchAddresses(true)
  }
}

const handlePlaceOrder = async () => {
  errors.general = ''

  if (!selectedAddress.value) {
    errors.general = 'لطفاً یک آدرس انتخاب کنید'
    checkoutStore.step = 2
    return
  }

  await checkoutStore.placeOrder()
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20 pt-28">
    <div class="container mx-auto max-w-4xl px-4">
      <h1 class="mb-8 text-2xl font-bold text-text">
        تسویه حساب
      </h1>

      <!-- Step 2: Selection (Address + Shipping + Payment) -->
      <section
          v-if="checkoutStore.step === 2"
          class="space-y-6"
      >
        <!-- Address Selection -->
        <div class="rounded-xl border border-input bg-menu p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-bold text-text">
            انتخاب آدرس
          </h2>

          <div v-if="addressesPending" class="py-4 text-center text-lightText">
            در حال بارگذاری آدرس‌ها...
          </div>

          <div v-else-if="addresses.length === 0" class="py-4 text-center">
            <p class="mb-3 text-lightText">
              هنوز آدرسی ثبت نکرده‌اید.
            </p>
            <button
                type="button"
                class="rounded-xl bg-amber-700 px-4 py-2 text-sm text-white"
                @click="openCreateAddressModal"
            >
              افزودن آدرس جدید
            </button>
          </div>

          <div v-else class="space-y-3">
            <label
                v-for="addr in addresses"
                :key="addr.id"
                class="flex cursor-pointer items-start gap-3 rounded-xl border border-input p-4 transition hover:border-amber-700"
                :class="{ 'border-amber-700 bg-amber-50 dark:bg-amber-950/20': selectedAddressId === addr.id }"
            >
              <input
                  type="radio"
                  name="address"
                  :checked="selectedAddressId === addr.id"
                  class="mt-1 accent-amber-700"
                  @change="selectAddress(addr.id)"
              >
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-text">{{ addr.title }}</span>
                  <span
                      v-if="addr.isDefault"
                      class="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  >
                    پیش‌فرض
                  </span>
                </div>
                <p class="mt-1 text-sm text-lightText">
                  {{ addr.receiverName }} — {{ addr.phone }}
                </p>
                <p class="mt-1 text-sm text-lightText">
                  {{ addr.province }}، {{ addr.city }}، {{ addr.address }}
                </p>
              </div>
            </label>

            <button
                type="button"
                class="mt-2 rounded-xl border border-dashed border-amber-700 px-4 py-2 text-sm text-amber-700 transition hover:bg-amber-50 dark:hover:bg-amber-950/20"
                @click="openCreateAddressModal"
            >
              + افزودن آدرس جدید
            </button>
          </div>

          <p v-if="errors.address" class="mt-2 text-sm text-red-500">
            {{ errors.address }}
          </p>
        </div>

        <!-- Shipping Method -->
        <div class="rounded-xl border border-input bg-menu p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-bold text-text">
            روش ارسال
          </h2>

          <div class="space-y-3">
            <label
                class="flex cursor-pointer items-center gap-3 rounded-xl border border-input p-4 transition hover:border-amber-700"
                :class="{ 'border-amber-700 bg-amber-50 dark:bg-amber-950/20': checkoutStore.shippingMethod === 'post' }"
            >
              <input
                  v-model="checkoutStore.shippingMethod"
                  type="radio"
                  name="shipping"
                  value="post"
                  class="accent-amber-700"
              >
              <div class="flex-1">
                <span class="font-medium text-text">پست پیشتاز</span>
                <span class="mr-2 text-sm text-lightText">
                  {{ formatPrice(60000) }} تومان
                </span>
              </div>
            </label>

            <label
                class="flex cursor-pointer items-center gap-3 rounded-xl border border-input p-4 transition hover:border-amber-700"
                :class="{ 'border-amber-700 bg-amber-50 dark:bg-amber-950/20': checkoutStore.shippingMethod === 'express' }"
            >
              <input
                  v-model="checkoutStore.shippingMethod"
                  type="radio"
                  name="shipping"
                  value="express"
                  class="accent-amber-700"
              >
              <div class="flex-1">
                <span class="font-medium text-text">ارسال فوری</span>
                <span class="mr-2 text-sm text-lightText">
                  {{ formatPrice(120000) }} تومان
                </span>
              </div>
            </label>

            <label
                class="flex cursor-pointer items-center gap-3 rounded-xl border border-input p-4 transition hover:border-amber-700"
                :class="{ 'border-amber-700 bg-amber-50 dark:bg-amber-950/20': checkoutStore.shippingMethod === 'pickup' }"
            >
              <input
                  v-model="checkoutStore.shippingMethod"
                  type="radio"
                  name="shipping"
                  value="pickup"
                  class="accent-amber-700"
              >
              <div class="flex-1">
                <span class="font-medium text-text">تحویل حضوری</span>
                <span class="mr-2 text-sm text-lightText">
                  رایگان
                </span>
              </div>
            </label>
          </div>
        </div>

        <!-- Delivery date + time slots -->
        <div class="rounded-xl border border-input bg-menu p-6 shadow-sm">
          <h2 class="mb-2 text-lg font-bold text-text">
            تاریخ و بازه زمانی ارسال
          </h2>
          <p class="mb-4 text-xs text-lightText leading-6">
            اولین نوبت قابل انتخاب،
            <strong class="text-text">حداقل ۳ روز کاری</strong>
            بعد از امروز است (جمعه تعطیل محسوب می‌شود).
            هر روز دو بازه دارد: ۸–۱۳ و ۱۳–۲۱.
          </p>

          <div class="space-y-3 max-h-80 overflow-y-auto pe-1">
            <template
              v-for="group in deliveryGroups"
              :key="group.date"
            >
              <div class="rounded-xl border border-input p-3">
                <p class="mb-2 text-sm font-bold text-text">
                  {{ group.weekdayLabel }} — {{ group.dateLabel }}
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    v-for="slot in group.slots"
                    :key="slot.value"
                    type="button"
                    class="rounded-xl border px-3 py-2.5 text-sm text-right transition"
                    :class="
                      checkoutStore.deliveryDay === slot.value
                        ? 'border-amber-700 bg-amber-700 text-white'
                        : 'border-input text-text hover:border-amber-700'
                    "
                    @click="checkoutStore.setDeliveryDay(slot.value)"
                  >
                    {{ slot.slotLabel }}
                  </button>
                </div>
              </div>
            </template>
          </div>

          <p v-if="checkoutStore.deliveryDay" class="mt-3 text-sm text-lightText">
            انتخاب شما:
            <strong class="text-text">{{ checkoutStore.deliveryDayLabel }}</strong>
          </p>
        </div>

        <!-- Payment Method -->
        <div class="rounded-xl border border-input bg-menu p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-bold text-text">
            روش پرداخت
          </h2>

          <!-- Wallet -->
          <label
              v-if="balanceInToman > 0"
              class="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-input p-4 transition"
              :class="{
                'border-green-500 bg-green-50 dark:bg-green-950/20': checkoutStore.useWallet,
              }"
          >
            <input
                :checked="checkoutStore.useWallet"
                type="checkbox"
                class="mt-1"
                @change="(e: Event) => checkoutStore.setUseWallet((e.target as HTMLInputElement).checked)"
            >
            <span class="flex-1">
              <span class="block font-medium text-text">
                استفاده از موجودی کیف پول
              </span>
              <span class="mt-1 block text-sm text-lightText">
                موجودی:
                <strong class="text-text">{{ formatPrice(balanceInToman) }} تومان</strong>
              </span>
              <span
                  v-if="checkoutStore.useWallet && checkoutStore.walletAmountUsed > 0"
                  class="mt-2 block text-sm text-green-600"
              >
                {{ formatPrice(checkoutStore.walletAmountUsed) }} تومان از کیف پول استفاده می‌شود.
              </span>
            </span>
          </label>

          <div
              v-if="checkoutStore.useWallet && balanceInToman > 0"
              class="mb-4 rounded-xl border border-input p-4"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm text-lightText">مبلغ باقی‌مانده:</span>
              <strong class="text-text">
                {{ formatPrice(checkoutStore.finalPrice) }} تومان
              </strong>
            </div>
          </div>

          <!-- Payment options -->
          <div v-if="checkoutStore.finalPrice > 0" class="space-y-3">
            <p class="font-medium text-text">
              {{
                checkoutStore.useWallet
                    ? 'روش پرداخت مبلغ باقی‌مانده'
                    : 'روش پرداخت'
              }}
            </p>

            <label
                class="flex cursor-pointer items-center gap-3 rounded-xl border border-input p-4 transition hover:border-amber-700"
                :class="{ 'border-amber-700 bg-amber-50 dark:bg-amber-950/20': checkoutStore.paymentMethod === 'card_to_card' }"
            >
              <input
                  v-model="checkoutStore.paymentMethod"
                  type="radio"
                  name="payment"
                  value="card_to_card"
                  class="accent-amber-700"
              >
              <div>
                <span class="font-medium text-text">کارت‌به‌کارت</span>
                <p class="mt-0.5 text-xs text-lightText">
                  واریز به کارت فروشگاه و ثبت رسید برای تأیید مدیر
                </p>
              </div>
            </label>

            <label
                class="flex cursor-pointer items-center gap-3 rounded-xl border border-input p-4 transition hover:border-amber-700"
                :class="{ 'border-amber-700 bg-amber-50 dark:bg-amber-950/20': checkoutStore.paymentMethod === 'cod' }"
            >
              <input
                  v-model="checkoutStore.paymentMethod"
                  type="radio"
                  name="payment"
                  value="cod"
                  class="accent-amber-700"
              >
              <div>
                <span class="font-medium text-text">پرداخت در محل (درب منزل)</span>
                <p class="mt-0.5 text-xs text-lightText">
                  پرداخت هنگام تحویل — تا آن زمان در انتظار پرداخت می‌ماند
                </p>
              </div>
            </label>
          </div>

          <div v-else-if="checkoutStore.isFullyPaidByWallet" class="rounded-xl bg-green-50 p-4 text-center text-green-700 dark:bg-green-950/20">
            مبلغ کامل توسط کیف پول پرداخت می‌شود.
          </div>
        </div>

        <!-- Errors -->
        <p v-if="errors.general" class="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20">
          {{ errors.general }}
        </p>

        <!-- Next Button -->
        <div class="flex justify-start">
          <button
              type="button"
              class="rounded-xl bg-amber-700 px-8 py-3 text-sm font-medium text-white transition hover:bg-amber-800"
              @click="handleNext"
          >
            مشاهده خلاصه سفارش
          </button>
        </div>
      </section>

      <!-- Step 3: Summary -->
      <section
          v-else-if="checkoutStore.step === 3"
          class="space-y-6"
      >
        <!-- Order Summary -->
        <div class="rounded-xl border border-input bg-menu p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-bold text-text">
            خلاصه سفارش
          </h2>

          <!-- Items -->
          <div class="mb-4 space-y-3 border-b border-input pb-4">
            <div
                v-for="item in cartStore.items"
                :key="item.product.id"
                class="flex items-center gap-3"
            >
              <img
                  :src="resolveUrl(item.product.image) || '/images/great-coffee-bean.jpeg'"
                  :alt="item.product.title"
                  class="h-14 w-14 rounded-lg object-cover"
              >
              <div class="flex-1">
                <p class="text-sm font-medium text-text">{{ item.product.title }}</p>
                <p class="text-xs text-lightText">
                  {{ item.quantity }} × {{ formatPrice(item.product.price) }} تومان
                </p>
              </div>
              <span class="text-sm font-medium text-text">
                {{ formatPrice(item.product.price * item.quantity) }} تومان
              </span>
            </div>
          </div>

          <!-- Address -->
          <div class="mb-4 border-b border-input pb-4">
            <p class="mb-1 text-sm text-lightText">آدرس تحویل:</p>
            <p class="text-sm text-text" v-if="selectedAddress">
              {{ selectedAddress.receiverName }} — {{ selectedAddress.phone }}<br>
              {{ selectedAddress.province }}، {{ selectedAddress.city }}، {{ selectedAddress.address }}
            </p>
          </div>

          <!-- Shipping -->
          <div class="mb-4 border-b border-input pb-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-lightText">روش ارسال:</span>
              <span class="text-text">{{ checkoutStore.shippingInfo.label }}</span>
            </div>
            <div v-if="checkoutStore.deliveryDayLabel" class="mt-1 flex items-center justify-between text-sm">
              <span class="text-lightText">زمان ارسال:</span>
              <span class="text-text">{{ checkoutStore.deliveryDayLabel }}</span>
            </div>
          </div>

          <!-- Payment -->
          <div class="mb-4 border-b border-input pb-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-lightText">روش پرداخت:</span>
              <span class="text-text">{{ checkoutStore.paymentInfo.label }}</span>
            </div>
          </div>

          <!-- Price Breakdown -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-lightText">جمع سبد خرید:</span>
              <span class="text-text">{{ formatPrice(cartStore.totalPrice) }} تومان</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-lightText">هزینه ارسال:</span>
              <span class="text-text">{{ formatPrice(checkoutStore.shippingInfo.price) }} تومان</span>
            </div>
            <div
                v-if="checkoutStore.useWallet && checkoutStore.walletAmountUsed > 0"
                class="flex items-center justify-between text-sm text-green-600"
            >
              <span>تخفیف کیف پول:</span>
              <span>-{{ formatPrice(checkoutStore.walletAmountUsed) }} تومان</span>
            </div>
            <div class="border-t border-input pt-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-text">مبلغ قابل پرداخت:</span>
                <span class="text-lg font-bold text-amber-700">
                  {{ formatPrice(checkoutStore.finalPrice) }} تومان
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <p v-if="checkoutStore.error" class="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20">
          {{ checkoutStore.error }}
        </p>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
              type="button"
              class="rounded-xl border border-input px-6 py-3 text-sm text-text transition hover:bg-menu"
              @click="checkoutStore.prevStep"
          >
            بازگشت
          </button>
          <button
              type="button"
              class="rounded-xl bg-amber-700 px-8 py-3 text-sm font-medium text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="checkoutStore.pending"
              @click="handlePlaceOrder"
          >
            {{ checkoutStore.pending ? 'در حال ثبت...' : 'ثبت سفارش' }}
          </button>
        </div>
      </section>
    </div>

    <!-- Create Address Modal -->
    <CreateAddressModal
        v-model="createAddressModalOpen"
        :pending="addressSubmitting"
        :error-message="addressActionError"
        @submit="submitCreateAddress"
    />
  </div>
</template>
