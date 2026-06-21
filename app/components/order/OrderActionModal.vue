<script setup lang="ts">
type OrderActionType = 'cancel' | 'return'

const props = withDefaults(
    defineProps<{
      open: boolean
      type: 'cancel' | 'return'
      pending?: boolean
      errorMessage?: string
    }>(),
    {
      pending: false,
      errorMessage: '',
    },
)
const emit = defineEmits<{
  close: []
  submit: [reason: string]
}>()

const selectedReason = ref<string[]>([])
const description = ref('')
const validationError = ref('')

const reasons: Record<OrderActionType, string[]> = {
  cancel: [
    'از خرید منصرف شده‌ام',
    'سفارش را اشتباه ثبت کرده‌ام',
    'می‌خواهم آدرس یا اطلاعات سفارش را تغییر دهم',
    'زمان ارسال سفارش مناسب نیست',
    'قیمت یا شرایط خرید تغییر کرده است',
    'سایر موارد',
  ],

  return: [
    'محصول آسیب‌دیده تحویل شده است',
    'محصول با سفارش من مطابقت ندارد',
    'محصول ناقص یا دارای ایراد است',
    'کیفیت محصول مورد تأیید نیست',
    'محصول اشتباه ارسال شده است',
    'سایر موارد',
  ],
}

const modalTitle = computed(() => {
  return props.type === 'cancel'
      ? 'لغو سفارش'
      : 'درخواست مرجوعی'
})

const modalDescription = computed(() => {
  return props.type === 'cancel'
      ? 'لطفاً دلیل لغو سفارش را انتخاب کنید.'
      : 'لطفاً دلیل درخواست مرجوعی را انتخاب کنید.'
})

const submitLabel = computed(() => {
  if (props.pending) {
    return 'در حال ثبت درخواست...'
  }

  return props.type === 'cancel'
      ? 'ثبت درخواست لغو'
      : 'ثبت درخواست مرجوعی'
})

const resetForm = () => {
  selectedReason.value = []
  description.value = ''
  validationError.value = ''
}

const closeModal = () => {
  if (props.pending) {
    return
  }

  resetForm()
  emit('close')
}
const toggleReason = (reason: string, checked: boolean): void => {
  if (checked) {
    if (!selectedReason.value.includes(reason)) {
      selectedReason.value.push(reason)
    }

    return
  }

  selectedReason.value = selectedReason.value.filter(
      (item) => item !== reason
  )
}
const submitForm = () => {
  validationError.value = ''

  if (selectedReason.value.length === 0) {
    validationError.value = 'انتخاب دلیل الزامی است.'
    return
  }
  if (
      selectedReason.value.includes('سایر موارد') &&
      !description.value.trim()
  ) {
    validationError.value = 'لطفاً دلیل خود را توضیح دهید.'
    return
  }

  const selectedReasonsText = selectedReason.value.join('، ')

  const reason = description.value.trim()
      ? `${selectedReasonsText} - ${description.value.trim()}`
      : selectedReasonsText

  emit('submit', reason)
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) {
    closeModal()
  }
}
watch(
    () => props.open,
    (isOpen) => {
      if (import.meta.client) {
        document.body.style.overflow = isOpen ? 'hidden' : ''
      }

      if (!isOpen) {
        resetForm()
      }
    },
)

watch(
    () => props.type,
    () => {
      resetForm()
    },
)

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)

  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
          v-if="open"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <!-- پس‌زمینه -->
        <button
            type="button"
            aria-label="بستن پنجره"
            class="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
            :disabled="pending"
            @click="closeModal"
        />

        <!-- مودال -->
        <section
            role="dialog"
            aria-modal="true"
            :aria-label="modalTitle"
            class="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-card p-5 shadow-2xl sm:p-7"
        >
          <!-- هدر -->
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-text">
                {{ modalTitle }}
              </h2>

              <p class="mt-2 text-sm leading-7 font-bold text-lightText">
                {{ modalDescription }}
              </p>
            </div>

            <button
                type="button"
                class="flex size-9 shrink-0 items-center justify-center rounded-full text-xl text-lightText transition hover:bg-gray-100 hover:text-text dark:hover:bg-gray-800"
                :disabled="pending"
                aria-label="بستن"
                @click="closeModal"
            >
              ×
            </button>
          </div>

          <!-- دلایل -->
          <div
              v-for="reason in reasons[type]"
              :key="reason"
              class="m-3 rounded-lg border p-3 text-sm transition"
              :class="
    selectedReason.includes(reason)
      ? 'border-background'
      : 'border-delivery dark:border-background hover:border-items hover:bg-background'
  "
          >
            <base-check-box
                :model-value="selectedReason.includes(reason)"
                :label="reason"
                custom-class="w-full"
                label-class="text-sm"
                @update:model-value="(checked) => toggleReason(reason, checked)"
            />
          </div>

          <!-- توضیحات -->
          <div class="mt-5">
            <label
                for="order-action-description"
                class="mb-2 block text-sm font-medium text-text"
            >
              توضیحات بیشتر
              <span class="font-normal text-lightText">
              {{ selectedReason.includes('سایر موارد') ? '(الزامی)' : '(اختیاری)' }}
              </span>
            </label>

            <textarea
                id="order-action-description"
                v-model.trim="description"
                rows="4"
                maxlength="500"
                placeholder="توضیحات خود را وارد کنید..."
                class="w-full resize-none rounded-lg border border-delivery dark:border-background hover:border-items bg-transparent px-4 py-3 text-sm text-text outline-none transition placeholder:text-lightText "
            />

            <div class="mt-1 text-left text-xs text-lightText">
              {{ description.length }}/500
            </div>
          </div>

          <!-- خطای اعتبارسنجی -->
          <p
              v-if="validationError"
              class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400"
          >
            {{ validationError }}
          </p>

          <!-- خطای API -->
          <p
              v-if="errorMessage"
              class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400"
          >
            {{ errorMessage }}
          </p>

          <!-- هشدار -->
          <div
              class="mt-5 rounded-2xl border px-4 py-3 text-sm leading-7"
              :class="
              type === 'cancel'
                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300'
                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300'
            "
          >
            <template v-if="type === 'cancel'">
              پس از ثبت درخواست، لغو سفارش توسط سیستم بررسی می‌شود.
            </template>

            <template v-else>
              ثبت درخواست مرجوعی به‌معنای تأیید نهایی آن نیست و درخواست شما بررسی خواهد شد.
            </template>
          </div>

          <!-- دکمه‌ها -->
          <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
                type="button"
                class="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-text transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                :disabled="pending"
                @click="closeModal"
            >
              انصراف
            </button>

            <button
                type="button"
                class="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                :class="
                type === 'cancel'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-amber-700 hover:bg-amber-800'
              "
                :disabled="pending"
                @click="submitForm"
            >
              {{ submitLabel }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 300ms ease;
}

.modal-enter-active section,
.modal-leave-active section {
  transition:
      transform 300ms ease,
      opacity 300ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from section,
.modal-leave-to section {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}
</style>