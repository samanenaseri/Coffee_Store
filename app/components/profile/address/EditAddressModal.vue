<script setup lang="ts">
import type { Address, UpdateAddressPayload } from '#shared/address'

const props = defineProps<{
  modelValue: boolean
  address: Address | null
  pending?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: UpdateAddressPayload & { id: number }): void
}>()

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
})

const errors = reactive<Record<string, string>>({
  title: '',
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
})

const fillFromAddress = (val: Address | null) => {
  if (!val) return
  form.title = val.title ?? ''
  form.receiverName = val.receiverName ?? ''
  form.phone = val.phone ?? ''
  form.province = val.province ?? ''
  form.city = val.city ?? ''
  form.address = val.address ?? ''
  form.postalCode = val.postalCode ?? ''
  form.plaque = val.plaque ?? ''
  form.unit = val.unit ?? ''
  Object.keys(errors).forEach((k) => {
    errors[k] = ''
  })
}

watch(
  () => props.address,
  (val) => fillFromAddress(val),
  { immediate: true, deep: true },
)

// Re-fill when modal opens so list edits are always fresh
watch(
  () => props.modelValue,
  (open) => {
    if (open) fillFromAddress(props.address)
  },
)

const close = () => {
  if (props.pending) return
  emit('update:modelValue', false)
}

const validate = (): boolean => {
  let ok = true
  Object.keys(errors).forEach((k) => {
    errors[k] = ''
  })

  if (!form.title.trim()) {
    errors.title = 'عنوان آدرس الزامی است'
    ok = false
  }
  if (!form.receiverName.trim()) {
    errors.receiverName = 'نام گیرنده الزامی است'
    ok = false
  }

  const phone = form.phone.replace(/\D/g, '')
  const phoneNorm = phone.length === 10 && phone.startsWith('9') ? `0${phone}` : phone
  if (!/^09\d{9}$/.test(phoneNorm)) {
    errors.phone = 'شماره موبایل معتبر نیست (مثال: 09123456789)'
    ok = false
  }

  if (!form.province.trim()) {
    errors.province = 'استان الزامی است'
    ok = false
  }
  if (!form.city.trim()) {
    errors.city = 'شهر الزامی است'
    ok = false
  }
  if (!form.address.trim()) {
    errors.address = 'نشانی کامل الزامی است'
    ok = false
  }

  const postal = form.postalCode.replace(/\D/g, '')
  if (postal.length !== 10) {
    errors.postalCode = 'کد پستی باید ۱۰ رقم باشد'
    ok = false
  }

  return ok
}

const submit = () => {
  if (!props.address?.id) return
  if (!validate()) return

  const phone = form.phone.replace(/\D/g, '')
  const phoneNorm = phone.length === 10 && phone.startsWith('9') ? `0${phone}` : phone

  emit('submit', {
    id: props.address.id,
    title: form.title.trim(),
    receiverName: form.receiverName.trim(),
    phone: phoneNorm,
    province: form.province.trim(),
    city: form.city.trim(),
    address: form.address.trim(),
    postalCode: form.postalCode.replace(/\D/g, ''),
    plaque: form.plaque.trim() || undefined,
    unit: form.unit.trim() || undefined,
  })
}
</script>

<template>
  <BaseModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <template #header>
      ویرایش آدرس
    </template>

    <template #body>
      <form class="grid gap-4 px-6 sm:grid-cols-2" @submit.prevent="submit">
        <BaseInput
          v-model="form.title"
          label="عنوان آدرس"
          placeholder="مثلاً خانه"
          :error="errors.title"
        />

        <BaseInput
          v-model="form.receiverName"
          label="نام تحویل‌گیرنده"
          placeholder="نام و نام خانوادگی"
          :error="errors.receiverName"
        />

        <BaseInput
          v-model="form.phone"
          label="شماره موبایل"
          type="tel"
          placeholder="09121234567"
          :error="errors.phone"
        />

        <BaseInput
          v-model="form.postalCode"
          label="کدپستی"
          placeholder="۱۰ رقم"
          :error="errors.postalCode"
        />

        <BaseInput
          v-model="form.province"
          label="استان"
          placeholder="مثلاً تهران"
          :error="errors.province"
        />

        <BaseInput
          v-model="form.city"
          label="شهر"
          placeholder="مثلاً تهران"
          :error="errors.city"
        />

        <div class="sm:col-span-2">
          <BaseInput
            v-model="form.address"
            label="نشانی کامل"
            placeholder="خیابان، کوچه، ..."
            :error="errors.address"
          />
        </div>

        <BaseInput
          v-model="form.plaque"
          label="پلاک"
          placeholder="اختیاری"
        />

        <BaseInput
          v-model="form.unit"
          label="واحد"
          placeholder="اختیاری"
        />

        <p
          v-if="errorMessage"
          class="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-300"
        >
          {{ errorMessage }}
        </p>
      </form>
    </template>

    <template #footer>
      <BaseButton
        type="button"
        variant="outline"
        size="sm"
        :disabled="pending"
        @click="close"
      >
        لغو
      </BaseButton>
      <BaseButton
        type="button"
        variant="primary"
        size="sm"
        :disabled="pending"
        @click="submit"
      >
        {{ pending ? 'در حال ذخیره...' : 'ذخیره' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
