<script setup lang="ts">
import { reactive, watch } from 'vue'

const cartStore = useCartStore()
const userStore = useUserStore()
const checkoutStore = useCheckoutStore()

const newAddress = reactive({
  title: '',
  city: '',
  address: '',
  postalCode: '',
})

const errors = reactive({
  name: '',
  phone: '',
  address: '',
  newAddressTitle: '',
  newAddressCity: '',
  newAddressAddress: '',
  newAddressPostalCode: '',
  shipping: '',
  payment: '',
})

const validateStep1 = () => {
  let valid = true

  errors.name = ''
  errors.phone = ''

  const name = userStore.user.name.trim()
  const phone = userStore.user.phone.trim()

  if (!name) {
    errors.name = 'نام و نام خانوادگی الزامی است'
    valid = false
  }

  if (!phone) {
    errors.phone = 'شماره موبایل الزامی است'
    valid = false
  } else if (!/^09\d{9}$/.test(phone)) {
    errors.phone = 'شماره موبایل معتبر نیست'
    valid = false
  }

  return valid
}

const validateStep2 = () => {
  errors.address = ''

  if (!userStore.selectedAddress) {
    errors.address = 'لطفاً یک آدرس انتخاب کنید'
    return false
  }

  return true
}

const validateStep3 = () => {
  errors.shipping = ''

  if (!checkoutStore.shippingMethod) {
    errors.shipping = 'لطفاً روش ارسال را انتخاب کنید'
    return false
  }

  return true
}

const validateStep4 = () => {
  errors.payment = ''

  if (!checkoutStore.paymentMethod) {
    errors.payment = 'لطفاً روش پرداخت را انتخاب کنید'
    return false
  }

  return true
}

const validateNewAddress = () => {
  let valid = true

  errors.newAddressTitle = ''
  errors.newAddressCity = ''
  errors.newAddressAddress = ''
  errors.newAddressPostalCode = ''

  if (!newAddress.title.trim()) {
    errors.newAddressTitle = 'عنوان آدرس الزامی است'
    valid = false
  }

  if (!newAddress.city.trim()) {
    errors.newAddressCity = 'شهر الزامی است'
    valid = false
  }

  if (!newAddress.address.trim()) {
    errors.newAddressAddress = 'آدرس کامل الزامی است'
    valid = false
  }

  if (!newAddress.postalCode.trim()) {
    errors.newAddressPostalCode = 'کد پستی الزامی است'
    valid = false
  } else if (!/^\d{10}$/.test(newAddress.postalCode.trim())) {
    errors.newAddressPostalCode = 'کد پستی باید ۱۰ رقم باشد'
    valid = false
  }

  return valid
}

const addNewAddress = () => {
  if (!validateNewAddress()) return

  userStore.addAddress({
    title: newAddress.title.trim(),
    city: newAddress.city.trim(),
    address: newAddress.address.trim(),
    postalCode: newAddress.postalCode.trim(),
    isDefault: false,
  })

  const addedAddress = userStore.addresses.at(-1)

  if (addedAddress) {
    userStore.selectAddress(addedAddress.id)
  }

  newAddress.title = ''
  newAddress.city = ''
  newAddress.address = ''
  newAddress.postalCode = ''
  errors.address = ''
}

const handleNext = () => {
  let valid = false

  switch (checkoutStore.step) {
    case 1:
      valid = validateStep1()
      break

    case 2:
      valid = validateStep2()
      break

    case 3:
      valid = validateStep3()
      break

    case 4:
      valid = validateStep4()
      break

    default:
      return
  }

  if (!valid) return

  checkoutStore.nextStep()
}

const placeOrder = async () => {
  const order = {
    user: { ...userStore.user },
    address: userStore.selectedAddress,
    cart: cartStore.items,
    shipping: checkoutStore.shippingMethod,
    payment: checkoutStore.paymentMethod,
    total: cartStore.totalPrice,
  }

  console.log('ORDER:', order)

  cartStore.clearCart()
  checkoutStore.step = 1

  await navigateTo('/')
}

watch(
    () => userStore.user.name,
    (value) => {
      if (value.trim()) {
        errors.name = ''
      }
    },
)

watch(
    () => userStore.user.phone,
    (value) => {
      if (/^09\d{9}$/.test(value.trim())) {
        errors.phone = ''
      }
    },
)

watch(
    () => userStore.selectedAddressId,
    (value) => {
      if (value !== null) {
        errors.address = ''
      }
    },
)

watch(
    () => checkoutStore.shippingMethod,
    (value) => {
      if (value) {
        errors.shipping = ''
      }
    },
)

watch(
    () => checkoutStore.paymentMethod,
    (value) => {
      if (value) {
        errors.payment = ''
      }
    },
)
const shippingInfo = computed(() => {
  switch (checkoutStore.shippingMethod) {
    case 'post':
      return {
        label: 'پست پیشتاز',
        price: 60000,
      }

    case 'express':
      return {
        label: 'ارسال فوری',
        price: 120000,
      }

    case 'pickup':
      return {
        label: 'تحویل حضوری',
        price: 0,
      }

    default:
      return {
        label: 'انتخاب نشده',
        price: 0,
      }
  }
})
const finalPrice = computed(() => {
  return cartStore.totalPrice + shippingInfo.value.price
})
</script>

<template>
  <main class="container mx-auto px-4 pb-20 pt-28">
    <!-- Header -->
    <div class="mb-10 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text">
        تسویه حساب
      </h1>

      <div class="text-sm text-gray-500">
        مرحله {{ checkoutStore.step }} از ۵
      </div>
    </div>

    <Transition name="step-fade" mode="out-in">
      <section :key="checkoutStore.step">
        <!-- Step 1 -->

          <section
              v-if="checkoutStore.step === 1"
              class="border border-2 border-input dark:border-delivery dark:shadow-hover shadow-lg rounded-lg p-4 grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
          >
            <!-- فرم -->
            <div class="order-1 space-y-4">
              <h2 class="text-xl font-bold text-text">
                اطلاعات کاربر
              </h2>

              <div>
                <BaseInput
                    v-model="userStore.user.name"
                    placeholder="نام و نام خانوادگی"
                />

                <p
                    v-if="errors.name"
                    class="mt-1 text-sm text-red-500"
                >
                  {{ errors.name }}
                </p>
              </div>

              <div>
                <BaseInput
                    v-model="userStore.user.phone"
                    inputmode="numeric"
                    maxlength="11"
                    placeholder="شماره موبایل"
                />

                <p
                    v-if="errors.phone"
                    class="mt-1 text-sm text-red-500"
                >
                  {{ errors.phone }}
                </p>
              </div>

              <BaseButton
                  variant="primary"
                  size="sm"
                  @click="handleNext"
              >
                ادامه
              </BaseButton>
            </div>

            <!-- تصویر -->
            <div class="order-2 flex items-center justify-center">
              <img
                  src="/images/checkout/working.png"
                  alt="اطلاعات کاربر"
                  class="h-auto w-full max-w-[280px] object-contain sm:max-w-[340px] lg:max-w-[380px] opacity-20"
              />
            </div>
          </section>

        <!-- Step 2 -->
        <section
            v-else-if="checkoutStore.step === 2"
            class="border border-2 border-input dark:border-delivery dark:shadow-hover shadow-lg rounded-lg p-4 grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
        >
           <div class="order-1 space-y-4">
          <h2 class="text-xl font-bold text-text">
            انتخاب آدرس
          </h2>

          <div class="space-y-3">
            <button
                v-for="address in userStore.addresses"
                :key="address.id"
                type="button"
                class="block w-full cursor-pointer rounded-lg p-4 text-right text-text transition-all duration-300"
                :class="
                userStore.selectedAddressId === address.id
                  ? 'border border-items dark:border-hover translate-y-1 bg-menu shadow-md'
                  : 'border border-bg bg-bg shadow-md dark:shadow-hover'
              "
                @click="userStore.selectAddress(address.id)"
            >
              <span class="block text-base font-bold text-text">
                {{ address.title }}
              </span>

              <span class="mt-1 block text-sm text-lightText">
                {{ address.city }} - {{ address.address }}
              </span>

              <span class="mt-1 block text-xs text-lightText">
                کد پستی: {{ address.postalCode }}
              </span>
            </button>
          </div>
          <p
              v-if="errors.address"
              class="text-sm text-red-500"
          >
            {{ errors.address }}
          </p>

          <!-- Add new address -->
          <div class="mt-6 space-y-3 border-t pt-6">
            <h3 class="font-bold text-text">
              افزودن آدرس جدید
            </h3>

            <div>
              <BaseInput
                  v-model="newAddress.title"
                  placeholder="عنوان، مانند خانه یا محل کار"
              />

              <p
                  v-if="errors.newAddressTitle"
                  class="mt-1 text-sm text-red-500"
              >
                {{ errors.newAddressTitle }}
              </p>
            </div>

            <div>
              <BaseInput
                  v-model="newAddress.city"
                  placeholder="شهر"
              />

              <p
                  v-if="errors.newAddressCity"
                  class="mt-1 text-sm text-red-500"
              >
                {{ errors.newAddressCity }}
              </p>
            </div>

            <div>
              <BaseInput
                  v-model="newAddress.address"
                  placeholder="آدرس کامل"
              />

              <p
                  v-if="errors.newAddressAddress"
                  class="mt-1 text-sm text-red-500"
              >
                {{ errors.newAddressAddress }}
              </p>
            </div>

            <div>
              <BaseInput
                  v-model="newAddress.postalCode"
                  inputmode="numeric"
                  maxlength="10"
                  placeholder="کد پستی"
              />

              <p
                  v-if="errors.newAddressPostalCode"
                  class="mt-1 text-sm text-red-500"
              >
                {{ errors.newAddressPostalCode }}
              </p>
            </div>

            <BaseButton
                variant="primary"
                size="sm"
                @click="addNewAddress"
            >
              افزودن آدرس
            </BaseButton>
          </div>

          <div class="flex gap-2 pt-4">

            <BaseButton
                variant="primary"
                size="sm"
                @click="checkoutStore.prevStep"
            >
              قبلی
            </BaseButton>

            <BaseButton
                variant="primary"
                size="sm"
                @click="handleNext"
            >
              ادامه
            </BaseButton>
          </div>
          </div>
          <div class="order-2 flex items-center justify-center">
            <img
                src="/images/checkout/map.png"
                alt="اطلاعات کاربر"
                class="h-auto w-full max-w-[280px] object-contain sm:max-w-[340px] lg:max-w-[380px] opacity-20"
            />
          </div>
        </section>

        <!-- Step 3 -->
        <section
            v-else-if="checkoutStore.step === 3"
            class="border border-2 border-input dark:border-delivery dark:shadow-hover shadow-lg rounded-lg p-4 grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
        >
         <div class=" flex flex-col order-1 space-y-4">
          <h2 class="text-xl font-bold text-text">
            روش ارسال
          </h2>

          <BaseRadioButton
              v-model="checkoutStore.shippingMethod"
              name="post"
              value="post"
          >پست پیشتاز</BaseRadioButton>
          <BaseRadioButton
              v-model="checkoutStore.shippingMethod"
              name="express"
              value="express"
          >ارسال فوری</BaseRadioButton>
          <BaseRadioButton
              v-model="checkoutStore.shippingMethod"
              name="pickup"
              value="pickup"
          >تحویل حضوری</BaseRadioButton>
          <p
              v-if="errors.shipping"
              class="text-sm text-red-500"
          >
            {{ errors.shipping }}
          </p>
          <div class="flex gap-2 pt-4">
            <BaseButton
                variant="primary"
                size="sm"
                @click="checkoutStore.prevStep"
            >
              قبلی
            </BaseButton>

            <BaseButton
                variant="primary"
                size="sm"
                @click="handleNext"
            >
              ادامه
            </BaseButton>
            </div>
          </div>
          <div class="order-2 flex items-center justify-center">
            <img
                src="/images/checkout/delivery.png"
                alt="روش ارسال"
                class="h-auto w-full max-w-[280px] object-contain sm:max-w-[340px] lg:max-w-[380px] opacity-20"
            />
          </div>
        </section>

        <!-- Step 4 -->
        <section
            v-else-if="checkoutStore.step === 4"
            class="border border-2 border-input dark:border-delivery dark:shadow-hover shadow-lg rounded-lg p-4 grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
        >
          <div class="flex flex-col order-1 space-y-4">
          <h2 class="text-xl font-bold text-text">
            روش پرداخت
          </h2>

          <BaseRadioButton
              v-model="checkoutStore.paymentMethod"
              name="online"
              value="online"
          >پرداخت آنلاین</BaseRadioButton>
          <BaseRadioButton
              v-model="checkoutStore.paymentMethod"
              name="cod"
              value="cod"
          >پرداخت در محل</BaseRadioButton>

          <p
              v-if="errors.payment"
              class="text-sm text-red-500"
          >
            {{ errors.payment }}
          </p>

          <div class="flex gap-2 pt-4">
            <BaseButton
                variant="primary"
                size="sm"
                @click="checkoutStore.prevStep"
            >
              قبلی
            </BaseButton>
            <BaseButton
                variant="primary"
                size="sm"
                @click="handleNext"
            >
              ادامه
            </BaseButton>
            </div>
          </div>
          <div class="order-2 flex items-center justify-center">
            <img
                src="/images/checkout/payment-method.png"
                alt="روش ارسال"
                class="h-auto w-full max-w-[280px] object-contain sm:max-w-[340px] lg:max-w-[380px] opacity-20"
            />
          </div>
        </section>

        <!-- Step 5 -->
        <section
            v-else-if="checkoutStore.step === 5"
            class="border border-2 border-input dark:border-delivery dark:shadow-hover shadow-lg rounded-lg p-4 grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
        >
          <div class="flex flex-col order-1 space-y-4">
          <h2 class="text-2xl font-bold text-text">
            خلاصه سفارش
          </h2>

          <div class="space-y-2 text-base text-lightText">
            <p>
              نام:
              <span class="text-text text-sm">{{ userStore.user.name }}</span>
            </p>

            <p class="space-y-2 text-base text-lightText">
              موبایل:
              <span class="text-text text-sm">{{ userStore.user.phone }}</span>
            </p>

            <p class="space-y-2 text-base text-lightText">
              آدرس:
              <span class=" text-sm text-text">
                {{ userStore.selectedAddress?.city }}،
                {{ userStore.selectedAddress?.address }}
              </span>
            </p>

            <p class="space-y-2 text-base text-lightText">
              روش ارسال:
              <span class="text-sm text-text">
                 {{ checkoutStore.shippingInfo.label }}
              </span>
            </p>

            <p class="space-y-2 text-base text-lightText">
              روش پرداخت:
              <span class="text-sm text-text">
                  {{ checkoutStore.paymentInfo.label }}
              </span>
            </p>

            <hr class="my-4">

            <p class="space-y-2 text-base text-lightText">
              تعداد محصولات:
              <span class="text-text text-sm">{{ cartStore.totalItems }}</span>
            </p>

            <p>
              هزینه ارسال:
              <template v-if="checkoutStore.shippingInfo.price === 0">
                رایگان
              </template>

              <template v-else>
                {{ cartStore.formatPrice(checkoutStore.shippingInfo.price) }}
                تومان
              </template>
            </p>

            <p class="font-bold">
              مبلغ نهایی:
              {{ cartStore.formatPrice(checkoutStore.finalPrice) }}
              تومان
            </p>
          </div>
           <div class="flex flex-col space-y-4 ">
             <BaseButton
                 variant="primary"
                 size="sm"
                 class-name="w-1/5"
                 @click="placeOrder"
             >
               ثبت سفارش
             </BaseButton>

             <BaseButton
                variant="primary"
                 size="sm"
                 class-name="w-1/5"
                 @click="checkoutStore.prevStep"
             >
               بازگشت
             </BaseButton>
             </div>
           </div>
          <div class="order-2 flex items-center justify-center">
            <img
                src="/images/checkout/verification.png"
                alt="خلاصه ی اطلاعات سفارش"
                class="h-auto w-full max-w-[280px] object-contain sm:max-w-[340px] lg:max-w-[380px] opacity-20"
            />
          </div>
        </section>
      </section>
    </Transition>
  </main>
</template>