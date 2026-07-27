<script setup lang="ts">
import PersianDatePicker from '~/components/ui/PersianDatePicker.vue'
import { todayGregorianString } from '~/utils/jalali'

const props = defineProps<{
  orderId: number
  /** Amount in Rial (API unit) */
  payableAmount: number
  bankCardNumber?: string
  bankCardHolder?: string
  bankName?: string
  submitting?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: {
    amount: number
    transaction_ref: string
    transfer_date: string
    note?: string
  }]
}>()

/** UI works in Toman; API stores Rial */
const payableToman = computed(() => Math.round((props.payableAmount || 0) / 10))

/** Gregorian YYYY-MM-DD for API; UI shows Jalali via PersianDatePicker */
const todayIso = todayGregorianString()

const form = reactive({
  amountToman: payableToman.value || 0,
  transaction_ref: '',
  transfer_date: todayIso,
  note: '',
})

const error = ref('')
const copied = ref(false)
const fieldErrors = reactive({
  amount: '',
  transaction_ref: '',
  transfer_date: '',
})

watch(
  () => props.payableAmount,
  () => {
    form.amountToman = payableToman.value
  },
)

const formatToman = (n: number) =>
  new Intl.NumberFormat('fa-IR').format(Math.max(0, Math.round(n || 0)))

const cardDisplay = computed(() => {
  const raw = (props.bankCardNumber || '6037991112345678').replace(/\D/g, '')
  if (raw.length === 16) {
    return raw.replace(/(\d{4})(?=\d)/g, '$1-')
  }
  return props.bankCardNumber || '6037-9911-1234-5678'
})

const holderDisplay = computed(() => props.bankCardHolder || 'فروشگاه قهوه استور')
const bankNameDisplay = computed(() => props.bankName || 'کارت مقصد فروشگاه')

const amountPreview = computed(() => formatToman(Number(form.amountToman) || 0))

async function copyCard() {
  try {
    const digits = cardDisplay.value.replace(/\D/g, '')
    await navigator.clipboard.writeText(digits || cardDisplay.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copied.value = false
  }
}

function useSuggestedAmount() {
  form.amountToman = payableToman.value
  fieldErrors.amount = ''
}

function validate(): boolean {
  error.value = ''
  fieldErrors.amount = ''
  fieldErrors.transaction_ref = ''
  fieldErrors.transfer_date = ''

  const toman = Math.trunc(Number(form.amountToman) || 0)
  let ok = true

  if (toman < 100) {
    fieldErrors.amount = 'مبلغ واریزی باید حداقل ۱۰۰ تومان باشد.'
    ok = false
  }
  if (!form.transaction_ref.trim() || form.transaction_ref.trim().length < 3) {
    fieldErrors.transaction_ref = 'شماره تراکنش / پیگیری بانکی را وارد کنید (حداقل ۳ کاراکتر).'
    ok = false
  }
  if (!form.transfer_date) {
    fieldErrors.transfer_date = 'تاریخ واریز را انتخاب کنید.'
    ok = false
  } else {
    const selected = new Date(form.transfer_date)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (selected > today) {
      fieldErrors.transfer_date = 'تاریخ واریز نمی‌تواند در آینده باشد.'
      ok = false
    }
  }

  if (!ok) {
    error.value = 'لطفاً موارد مشخص‌شده را تکمیل کنید.'
  }
  return ok
}

function onSubmit() {
  if (!validate()) return

  const toman = Math.trunc(Number(form.amountToman) || 0)
  // Convert toman → rial for API
  emit('submit', {
    amount: toman * 10,
    transaction_ref: form.transaction_ref.trim(),
    transfer_date: form.transfer_date,
    note: form.note.trim() || undefined,
  })
}
</script>

<template>
  <div class="rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/90 to-menu dark:from-amber-950/30 dark:to-menu shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="bg-amber-800 px-5 py-5 text-white">
      <div class="flex items-start gap-3">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl" aria-hidden="true">
          💳
        </div>
        <div>
          <h2 class="text-lg font-bold leading-7">
            ثبت اطلاعات واریز کارت‌به‌کارت
          </h2>
          <p class="mt-1.5 text-sm text-amber-100 leading-6">
            مبلغ را به کارت زیر واریز کنید، سپس اطلاعات رسید را وارد و ثبت کنید.
          </p>
        </div>
      </div>
    </div>

    <div class="p-5 space-y-5">
      <!-- Bank card box -->
      <div class="rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white p-5 shadow-lg relative overflow-hidden">
        <div class="absolute -left-8 -top-8 size-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div class="absolute -right-6 -bottom-10 size-28 rounded-full bg-amber-600/10 blur-2xl pointer-events-none" />

        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs text-stone-400 tracking-wide">
              {{ bankNameDisplay }}
            </p>
            <span class="rounded-full bg-amber-500/20 text-amber-200 text-[10px] px-2.5 py-1 font-medium">
              کارت مقصد
            </span>
          </div>

          <p
            class="font-mono text-xl sm:text-2xl tracking-[0.2em] ltr text-left mb-4 select-all"
            dir="ltr"
          >
            {{ cardDisplay }}
          </p>

          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-[11px] text-stone-400 mb-0.5">
                به نام
              </p>
              <p class="font-medium text-sm sm:text-base">
                {{ holderDisplay }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] px-3.5 py-2.5 text-xs font-medium transition border border-white/10"
              @click="copyCard"
            >
              {{ copied ? 'کپی شد ✓' : 'کپی شماره کارت' }}
            </button>
          </div>

          <div class="mt-5 pt-4 border-t border-white/10 flex justify-between items-center gap-2 text-sm">
            <span class="text-stone-400">مبلغ قابل پرداخت</span>
            <span class="font-bold text-amber-300 text-base">
              {{ formatToman(payableToman) }}
              <span class="text-xs font-normal text-amber-200/80">تومان</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Steps -->
      <ol class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <li class="rounded-xl border border-amber-200/60 bg-background px-3 py-2.5 flex items-start gap-2">
          <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-800 text-white text-[10px] font-bold">۱</span>
          <span class="text-lightText leading-5">واریز به کارت بالا</span>
        </li>
        <li class="rounded-xl border border-amber-200/60 bg-background px-3 py-2.5 flex items-start gap-2">
          <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-800 text-white text-[10px] font-bold">۲</span>
          <span class="text-lightText leading-5">تکمیل فرم زیر</span>
        </li>
        <li class="rounded-xl border border-amber-200/60 bg-background px-3 py-2.5 flex items-start gap-2">
          <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-800 text-white text-[10px] font-bold">۳</span>
          <span class="text-lightText leading-5">تأیید توسط مدیر</span>
        </li>
      </ol>

      <!-- Form -->
      <form class="space-y-4" novalidate @submit.prevent="onSubmit">
        <div>
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <label class="block text-sm font-medium text-text">
              مبلغ واریزی (تومان)
              <span class="text-red-500">*</span>
            </label>
            <button
              type="button"
              class="text-xs text-amber-800 hover:underline font-medium"
              @click="useSuggestedAmount"
            >
              مبلغ پیشنهادی
            </button>
          </div>
          <input
            v-model.number="form.amountToman"
            type="number"
            min="100"
            step="1"
            inputmode="numeric"
            class="w-full rounded-xl border bg-background px-4 py-3 text-text outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
            :class="fieldErrors.amount ? 'border-red-400' : 'border-input'"
            @input="fieldErrors.amount = ''"
          >
          <p class="mt-1.5 text-xs text-lightText flex flex-wrap gap-x-2 gap-y-1">
            <span>پیشنهاد سیستم: {{ formatToman(payableToman) }} تومان</span>
            <span v-if="form.amountToman" class="text-amber-800 font-medium">
              · نمایش: {{ amountPreview }} تومان
            </span>
          </p>
          <p v-if="fieldErrors.amount" class="mt-1 text-xs text-red-600">
            {{ fieldErrors.amount }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-text mb-1.5">
            شماره تراکنش / پیگیری بانکی
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.transaction_ref"
            type="text"
            maxlength="100"
            autocomplete="off"
            placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
            class="w-full rounded-xl border bg-background px-4 py-3 text-text outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 ltr text-left placeholder:text-right"
            :class="fieldErrors.transaction_ref ? 'border-red-400' : 'border-input'"
            dir="ltr"
            @input="fieldErrors.transaction_ref = ''"
          >
          <p class="mt-1 text-xs text-lightText">
            شماره پیگیری روی رسید بانکی یا پیامک بانک
          </p>
          <p v-if="fieldErrors.transaction_ref" class="mt-1 text-xs text-red-600">
            {{ fieldErrors.transaction_ref }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-text mb-1.5">
            تاریخ واریز
            <span class="text-red-500">*</span>
          </label>
          <PersianDatePicker
            v-model="form.transfer_date"
            :max="todayIso"
            placeholder="انتخاب تاریخ شمسی"
            :has-error="!!fieldErrors.transfer_date"
            :disabled="submitting"
            @change="fieldErrors.transfer_date = ''"
          />
          <p class="mt-1 text-xs text-lightText">
            تاریخ را از تقویم شمسی انتخاب کنید (تاریخ آینده مجاز نیست).
          </p>
          <p v-if="fieldErrors.transfer_date" class="mt-1 text-xs text-red-600">
            {{ fieldErrors.transfer_date }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-text mb-1.5">
            توضیحات
            <span class="text-lightText font-normal">(اختیاری)</span>
          </label>
          <textarea
            v-model="form.note"
            rows="3"
            maxlength="500"
            placeholder="مثلاً نام واریزکننده، چهار رقم آخر کارت مبدأ..."
            class="w-full rounded-xl border border-input bg-background px-4 py-3 text-text outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 resize-y"
          />
          <p class="mt-1 text-[11px] text-lightText text-left" dir="ltr">
            {{ form.note.length }}/500
          </p>
        </div>

        <div
          v-if="error"
          class="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 text-red-600 text-sm px-3 py-2.5"
          role="alert"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full rounded-xl bg-amber-800 hover:bg-amber-900 active:bg-amber-950 text-white font-semibold py-3.5 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-900/20"
          :disabled="submitting"
        >
          <span v-if="submitting" class="inline-flex items-center gap-2">
            <span class="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            در حال ثبت اطلاعات...
          </span>
          <span v-else>
            ثبت اطلاعات واریز
          </span>
        </button>

        <p class="text-[11px] text-center text-lightText leading-5 px-2">
          پس از ثبت، وضعیت پرداخت «در انتظار بررسی مدیر» می‌شود و پس از تأیید، سفارش شما پردازش خواهد شد.
        </p>
      </form>
    </div>
  </div>
</template>
