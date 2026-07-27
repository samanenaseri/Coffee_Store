<script setup lang="ts">
import type { CreateAddressPayload } from '#shared/address'

const props = withDefaults(
    defineProps<{
      modelValue: boolean
      pending?: boolean
      errorMessage?: string
    }>(),
    {
      pending: false,
      errorMessage: '',
    },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit', payload: CreateAddressPayload): void
}>()

const modalOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const form = reactive({
  title: '',
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
  plaque: '',
  unit: '',
  isDefault: false,
})

const validationError = ref('')

const resetForm = () => {
  form.title = ''
  form.receiverName = ''
  form.phone = ''
  form.province = ''
  form.city = ''
  form.address = ''
  form.postalCode = ''
  form.plaque = ''
  form.unit = ''
  form.isDefault = false

  validationError.value = ''
}

const closeModal = () => {
  if (props.pending) {
    return
  }

  modalOpen.value = false
  resetForm()
}

const submitForm = () => {
  validationError.value = ''

  const title = form.title.trim()
  const receiverName = form.receiverName.trim()
  const phone = form.phone.trim()
  const province = form.province.trim()
  const city = form.city.trim()
  const address = form.address.trim()
  const postalCode = form.postalCode.trim()

  if (!title) {
    validationError.value = 'عنوان آدرس را وارد کنید.'
    return
  }

  if (!receiverName) {
    validationError.value = 'نام تحویل‌گیرنده را وارد کنید.'
    return
  }

  if (!/^09\d{9}$/.test(phone)) {
    validationError.value = 'شماره موبایل معتبر نیست.'
    return
  }

  if (!province) {
    validationError.value = 'استان را وارد کنید.'
    return
  }

  if (!city) {
    validationError.value = 'شهر را وارد کنید.'
    return
  }

  if (!address) {
    validationError.value = 'نشانی کامل را وارد کنید.'
    return
  }

  if (!/^\d{10}$/.test(postalCode)) {
    validationError.value = 'کدپستی باید ۱۰ رقم باشد.'
    return
  }

  emit('submit', {
    title,
    receiverName,
    phone,
    province,
    city,
    address,
    postalCode,
    plaque: form.plaque.trim() || undefined,
    unit: form.unit.trim() || undefined,
    isDefault: form.isDefault,
  })
}

watch(
    () => props.modelValue,
    (isOpen) => {
      if (isOpen) {
        validationError.value = ''
      }
    },
)
</script>

<template>
  <BaseModal v-model="modalOpen">
    <template #header>
      افزودن آدرس جدید
    </template>

    <template #body>
      <form
          class="grid gap-5 px-6 sm:grid-cols-2"
          @submit.prevent="submitForm"
      >
        <div>
          <label
              for="create-address-title"
              class="mb-2 block text-sm text-text"
          >
            عنوان آدرس
          </label>

          <input
              id="create-address-title"
              v-model="form.title"
              type="text"
              placeholder="مثلاً خانه"
              class="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-text outline-none focus:border-amber-700"
          >
        </div>

        <div>
          <label
              for="create-address-receiver"
              class="mb-2 block text-sm text-text"
          >
            نام تحویل‌گیرنده
          </label>

          <input
              id="create-address-receiver"
              v-model="form.receiverName"
              type="text"
              class="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-text outline-none focus:border-amber-700"
          >
        </div>

        <div>
          <label
              for="create-address-phone"
              class="mb-2 block text-sm text-text"
          >
            شماره موبایل
          </label>

          <input
              id="create-address-phone"
              v-model="form.phone"
              type="tel"
              inputmode="numeric"
              dir="ltr"
              placeholder="09121234567"
              class="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-right text-sm text-text outline-none focus:border-amber-700"
          >
        </div>

        <div>
          <label
              for="create-address-postal-code"
              class="mb-2 block text-sm text-text"
          >
            کدپستی
          </label>

          <input
              id="create-address-postal-code"
              v-model="form.postalCode"
              type="text"
              inputmode="numeric"
              dir="ltr"
              maxlength="10"
              class="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-right text-sm text-text outline-none focus:border-amber-700"
          >
        </div>

        <div>
          <label
              for="create-address-province"
              class="mb-2 block text-sm text-text"
          >
            استان
          </label>

          <input
              id="create-address-province"
              v-model="form.province"
              type="text"
              class="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-text outline-none focus:border-amber-700"
          >
        </div>

        <div>
          <label
              for="create-address-city"
              class="mb-2 block text-sm text-text"
          >
            شهر
          </label>

          <input
              id="create-address-city"
              v-model="form.city"
              type="text"
              class="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-text outline-none focus:border-amber-700"
          >
        </div>

        <div class="sm:col-span-2">
          <label
              for="create-address-text"
              class="mb-2 block text-sm text-text"
          >
            نشانی کامل
          </label>

          <textarea
              id="create-address-text"
              v-model="form.address"
              rows="4"
              class="w-full resize-none rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm leading-7 text-text outline-none focus:border-amber-700"
          />
        </div>

        <div>
          <label
              for="create-address-plaque"
              class="mb-2 block text-sm text-text"
          >
            پلاک
          </label>

          <input
              id="create-address-plaque"
              v-model="form.plaque"
              type="text"
              class="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-text outline-none focus:border-amber-700"
          >
        </div>

        <div>
          <label
              for="create-address-unit"
              class="mb-2 block text-sm text-text"
          >
            واحد
          </label>

          <input
              id="create-address-unit"
              v-model="form.unit"
              type="text"
              class="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-text outline-none focus:border-amber-700"
          >
        </div>

        <label
            class="flex cursor-pointer items-center gap-3 sm:col-span-2"
        >
          <input
              v-model="form.isDefault"
              type="checkbox"
              class="size-4 accent-amber-700"
          >

          <span class="text-sm text-text">
            این آدرس به‌عنوان آدرس پیش‌فرض انتخاب شود
          </span>
        </label>

        <div
            v-if="validationError || errorMessage"
            class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 sm:col-span-2"
        >
          {{ validationError || errorMessage }}
        </div>
      </form>
    </template>

    <template #footer>
      <button
          type="button"
          :disabled="pending"
          class="rounded-xl border border-gray-300 px-5 py-2.5 text-sm text-text disabled:opacity-50"
          @click="closeModal"
      >
        انصراف
      </button>

      <button
          type="button"
          :disabled="pending"
          class="rounded-xl bg-amber-700 px-5 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          @click="submitForm"
      >
        {{ pending ? 'در حال ثبت...' : 'ثبت آدرس' }}
      </button>
    </template>
  </BaseModal>
</template>