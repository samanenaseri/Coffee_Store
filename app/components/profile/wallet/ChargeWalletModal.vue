<script setup lang="ts">
const model = defineModel<boolean>({
  default: false,
})

const props = withDefaults(
    defineProps<{
      pending?: boolean
      errorMessage?: string
    }>(),
    {
      pending: false,
      errorMessage: '',
    },
)

const emit = defineEmits<{
  submit: [amountInRial: number]
}>()

const amount = ref('')
const validationError = ref('')

const quickAmounts = [
  50_000,
  100_000,
  200_000,
  500_000,
]

const amountInToman = computed(() => {
  const normalizedValue = amount.value.replace(
      /\D/g,
      '',
  )

  return Number(normalizedValue)
})

const formattedAmount = computed(() => {
  if (!amountInToman.value) {
    return ''
  }

  return new Intl.NumberFormat('fa-IR').format(
      amountInToman.value,
  )
})

const selectQuickAmount = (
    value: number,
) => {
  amount.value = String(value)
  validationError.value = ''
}

const submit = () => {
  validationError.value = ''

  if (
      !Number.isFinite(amountInToman.value) ||
      amountInToman.value <= 0
  ) {
    validationError.value =
        'لطفاً مبلغ شارژ را وارد کنید'

    return
  }

  /*
   * کاربر مبلغ را به تومان وارد می‌کند،
   * اما API مبلغ را به ریال دریافت می‌کند.
   */
  const amountInRial =
      amountInToman.value * 10

  emit('submit', amountInRial)
}

const closeModal = () => {
  if (props.pending) {
    return
  }

  model.value = false
}

watch(model, isOpen => {
  if (!isOpen) {
    amount.value = ''
    validationError.value = ''
  }
})

watch(amount, value => {
  const normalizedValue = value.replace(
      /\D/g,
      '',
  )

  if (value !== normalizedValue) {
    amount.value = normalizedValue
  }

  if (normalizedValue) {
    validationError.value = ''
  }
})
</script>

<template>
  <BaseModal v-model="model">
    <template #header>
      <div>
        <h2 class="text-lg font-bold text-text">
          شارژ کیف پول
        </h2>

        <p class="mt-1 text-sm text-lightText">
          مبلغ موردنظر را به تومان وارد کنید.
        </p>
      </div>
    </template>

    <template #body>
      <div class="space-y-5 mx-5">
        <div>
          <BaseInput
              v-model="amount"
              inputmode="numeric"
              placeholder="مبلغ شارژ به تومان"
          />

          <p
              v-if="formattedAmount"
              class="mt-2 text-sm text-lightText"
          >
            {{ formattedAmount }} تومان
          </p>

          <p
              v-if="validationError"
              class="mt-2 text-sm text-red-500"
          >
            {{ validationError }}
          </p>

          <p
              v-else-if="errorMessage"
              class="mt-2 text-sm text-red-500"
          >
            {{ errorMessage }}
          </p>
        </div>

        <div>
          <p class="mb-3 text-sm text-lightText">
            انتخاب سریع مبلغ
          </p>

          <div
              class="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <button
                v-for="quickAmount in quickAmounts"
                :key="quickAmount"
                type="button"
                class="rounded-lg border border-input px-3 py-2 text-sm text-text transition hover:border-amber-700 hover:text-amber-700"
                @click="
                selectQuickAmount(quickAmount)
              "
            >
              {{
                new Intl.NumberFormat(
                    'fa-IR',
                ).format(quickAmount)
              }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div
          class="flex flex-col-reverse gap-3 sm:flex-row"
      >
        <BaseButton
            type="button"
            variant="primary"
            size="sm"
            :disabled="pending"
            @click="submit"
        >
          {{
            pending
                ? 'در حال شارژ...'
                : 'پرداخت و شارژ'
          }}
        </BaseButton>

        <BaseButton
            type="button"
            variant="outline"
            size="sm"
            :disabled="pending"
            @click="closeModal"
        >
          انصراف
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>