<script setup lang="ts">
import type {
  SupportTicketPriority,
  SupportTicketStatus,
} from '#shared/support'

definePageMeta({
  layout: 'profile',
})

useSeoMeta({
  title: 'پشتیبانی',
  robots: 'noindex, nofollow',
})

const route = useRoute()

const notification = useNotification()

const {
  tickets,
  pending,
  submitting,
  error,
  submitError,
  fetchTickets,
  createTicket,
  clearSubmitError,
} = useSupport()

const orderId = computed<number | undefined>(() => {
  const value = route.query.orderId

  if (typeof value !== 'string') {
    return undefined
  }

  const parsedValue = Number(value)

  return Number.isInteger(parsedValue) && parsedValue > 0
      ? parsedValue
      : undefined
})

const form = reactive({
  subject: '',
  message: '',
  priority: 'normal' as SupportTicketPriority,
})

const validationError = ref('')

const priorityOptions: Array<{
  label: string
  value: SupportTicketPriority
}> = [
  {
    label: 'کم',
    value: 'low',
  },
  {
    label: 'معمولی',
    value: 'normal',
  },
  {
    label: 'زیاد',
    value: 'high',
  },
]

const statusMap: Record<
    SupportTicketStatus,
    {
      label: string
      className: string
    }
> = {
  open: {
    label: 'باز',
    className:
        'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
  },

  in_progress: {
    label: 'در حال بررسی',
    className:
        'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300',
  },

  answered: {
    label: 'پاسخ داده‌شده',
    className:
        'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300',
  },

  closed: {
    label: 'بسته‌شده',
    className:
        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
}

const priorityLabel: Record<SupportTicketPriority, string> = {
  low: 'کم',
  normal: 'معمولی',
  high: 'زیاد',
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const resetForm = () => {
  form.subject = ''
  form.message = ''
  form.priority = 'normal'

  validationError.value = ''
  clearSubmitError()
}

const submitTicket = async () => {
  validationError.value = ''
  clearSubmitError()

  const subject = form.subject.trim()
  const message = form.message.trim()

  if (!subject) {
    validationError.value = 'موضوع درخواست را وارد کنید.'
    return
  }

  if (!message) {
    validationError.value = 'متن درخواست را وارد کنید.'
    return
  }

  const response = await createTicket({
    orderId: orderId.value,
    subject,
    message,
    priority: form.priority,
  })

  if (!response) {
    return
  }

  notification.success(
      'درخواست ثبت شد',
      response.message,
  )

  resetForm()
}

await fetchTickets()
</script>

<template>
  <section>
    <!-- عنوان صفحه -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-text">
        پشتیبانی
      </h1>

      <p class="mt-2 text-sm text-lightText">
        درخواست خود را برای تیم پشتیبانی ارسال کنید.
      </p>
    </header>

    <!-- فرم ثبت تیکت -->
    <section
        class="rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 class="font-bold text-text">
            ثبت درخواست جدید
          </h2>

          <p class="mt-2 text-sm text-lightText">
            موضوع و توضیحات درخواست خود را وارد کنید.
          </p>
        </div>

        <NuxtLink
            v-if="orderId"
            :to="`/profile/orders/${orderId}`"
            class="text-sm font-medium text-amber-700 transition hover:text-amber-800"
        >
          مشاهده سفارش
        </NuxtLink>
      </div>

      <!-- ارتباط با سفارش -->
      <div
          v-if="orderId"
          class="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"
      >
        این درخواست مربوط به سفارش
        <strong>#{{ orderId }}</strong>
        است.
      </div>

      <form
          class="mt-6 space-y-5"
          @submit.prevent="submitTicket"
      >
        <!-- موضوع -->
        <div>
          <label
              for="support-subject"
              class="mb-2 block text-sm font-medium text-text"
          >
            موضوع درخواست
          </label>

          <input
              id="support-subject"
              v-model="form.subject"
              type="text"
              placeholder="مثلاً پیگیری وضعیت ارسال سفارش"
              class="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-text outline-none transition focus:border-amber-700 dark:border-gray-700"
              @input="validationError = ''; clearSubmitError()"
          >
        </div>

        <!-- اولویت -->
        <div>
          <p class="mb-2 text-sm font-medium text-text">
            اولویت
          </p>

          <div class="flex flex-wrap gap-3">
            <label
                v-for="option in priorityOptions"
                :key="option.value"
                class="cursor-pointer"
            >
              <input
                  v-model="form.priority"
                  type="radio"
                  name="priority"
                  :value="option.value"
                  class="peer sr-only"
              >

              <span
                  class="inline-flex rounded-xl border border-gray-300 px-4 py-2 text-sm text-lightText transition peer-checked:border-amber-700 peer-checked:bg-amber-50 peer-checked:text-amber-700 dark:border-gray-700 dark:peer-checked:bg-amber-950/20"
              >
                {{ option.label }}
              </span>
            </label>
          </div>
        </div>

        <!-- توضیحات -->
        <div>
          <label
              for="support-message"
              class="mb-2 block text-sm font-medium text-text"
          >
            توضیحات
          </label>

          <textarea
              id="support-message"
              v-model="form.message"
              rows="6"
              placeholder="توضیحات کامل درخواست خود را بنویسید..."
              class="w-full resize-none rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm leading-7 text-text outline-none transition focus:border-amber-700 dark:border-gray-700"
              @input="validationError = ''; clearSubmitError()"
          />
        </div>

        <!-- خطا -->
        <div
            v-if="validationError || submitError"
            class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-300"
        >
          {{ validationError || submitError }}
        </div>

        <!-- دکمه ثبت -->
        <button
            type="submit"
            :disabled="submitting"
            class="rounded-xl bg-amber-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ submitting ? 'در حال ثبت...' : 'ثبت درخواست' }}
        </button>
      </form>
    </section>

    <!-- فهرست تیکت‌ها -->
    <section
        class="mt-6 rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
    >
      <div class="mb-5 flex items-center justify-between gap-4">
        <h2 class="font-bold text-text">
          درخواست‌های قبلی
        </h2>

        <span class="text-sm text-lightText">
          {{ tickets.length }} درخواست
        </span>
      </div>

      <!-- Loading -->
      <div
          v-if="pending"
          class="py-10 text-center text-sm text-lightText"
      >
        در حال دریافت درخواست‌ها...
      </div>

      <!-- Error -->
      <div
          v-else-if="error"
          class="rounded-xl bg-red-50 px-4 py-4 text-center text-sm text-red-600 dark:bg-red-950/20 dark:text-red-300"
      >
        {{ error }}
      </div>

      <!-- Empty state -->
      <div
          v-else-if="tickets.length === 0"
          class="py-10 text-center"
      >
        <p class="text-sm text-lightText">
          هنوز درخواست پشتیبانی ثبت نکرده‌اید.
        </p>
      </div>

      <!-- Tickets -->
      <div
          v-else
          class="space-y-4"
      >
        <article
            v-for="ticket in tickets"
            :key="ticket.id"
            class="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
        >
          <div
              class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="font-bold text-text">
                  {{ ticket.subject }}
                </h3>

                <span
                    class="rounded-full px-3 py-1 text-xs font-medium"
                    :class="statusMap[ticket.status].className"
                >
                  {{ statusMap[ticket.status].label }}
                </span>
              </div>

              <p class="mt-3 line-clamp-2 text-sm leading-7 text-lightText">
                {{ ticket.message }}
              </p>
            </div>

            <div class="shrink-0 text-sm text-lightText">
              <p>
                اولویت:
                {{ priorityLabel[ticket.priority] }}
              </p>

              <p class="mt-2">
                {{ formatDate(ticket.createdAt) }}
              </p>
            </div>
          </div>

          <div
              v-if="ticket.orderId"
              class="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800"
          >
            <NuxtLink
                :to="`/profile/orders/${ticket.orderId}`"
                class="text-sm font-medium text-amber-700 transition hover:text-amber-800"
            >
              سفارش مرتبط: #{{ ticket.orderId }}
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>