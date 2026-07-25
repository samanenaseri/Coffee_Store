<script setup lang="ts">
import type {
  WalletTransaction,
  WalletTransactionStatus,
  WalletTransactionType,
} from '#shared/wallet'
import ChargeWalletModal from '~/components/profile/wallet/ChargeWalletModal.vue'

definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
})



const walletStore = useWalletStore()
const notification = useNotification()

const {
  wallet,
  transactions,

  pending,
  transactionsPending,
  submitting,

  error,
  actionError,

  balanceInToman,
} = storeToRefs(walletStore)

const chargeModalOpen = ref(false)

const formatNumber = (value: number) => {
  return new Intl.NumberFormat(
      'fa-IR',
  ).format(value)
}

const formatRialToToman = (
    rialAmount: number,
) => {
  return formatNumber(
      Math.trunc(rialAmount / 10),
  )
}

const formatDate = (date: string | undefined | null) => {
  if (!date) return '—'
  const d = new Date(date)
  if (!Number.isFinite(d.getTime())) return '—'
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return '—'
  }
}

const getTransactionTypeLabel = (
    type: WalletTransactionType,
) => {
  const labels: Record<
      WalletTransactionType,
      string
  > = {
    charge: 'شارژ کیف پول',
    purchase: 'پرداخت سفارش',
    refund: 'بازگشت وجه',
    adjustment: 'اصلاح موجودی',
  }

  return labels[type]
}

const getTransactionStatusLabel = (
    status: WalletTransactionStatus,
) => {
  const labels: Record<
      WalletTransactionStatus,
      string
  > = {
    pending: 'در انتظار',
    completed: 'موفق',
    failed: 'ناموفق',
  }

  return labels[status]
}

const getStatusClass = (
    status: WalletTransactionStatus,
) => {
  switch (status) {
    case 'completed':
      return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'

    case 'pending':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'

    case 'failed':
      return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
  }
}

const getDirectionClass = (
    transaction: WalletTransaction,
) => {
  return transaction.direction === 'credit'
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400'
}

const getDirectionSign = (
    transaction: WalletTransaction,
) => {
  return transaction.direction === 'credit'
      ? '+'
      : '−'
}

const totalCredits = computed(() => {
  return transactions.value
      .filter(transaction => {
        return (
            transaction.direction === 'credit' &&
            transaction.status === 'completed'
        )
      })
      .reduce((total, transaction) => {
        return total + transaction.amount
      }, 0)
})

const totalDebits = computed(() => {
  return transactions.value
      .filter(transaction => {
        return (
            transaction.direction === 'debit' &&
            transaction.status === 'completed'
        )
      })
      .reduce((total, transaction) => {
        return total + transaction.amount
      }, 0)
})

const openChargeModal = () => {
  walletStore.clearActionError()
  chargeModalOpen.value = true
}

const submitChargeWallet = async (
    amountInRial: number,
) => {
  const response =
      await walletStore.chargeWallet(
          amountInRial,
      )

  if (!response) {
    notification.error(
        'شارژ کیف پول ناموفق بود',
        actionError.value,
    )

    return
  }

  chargeModalOpen.value = false

  notification.success(
      'کیف پول شارژ شد',
      response.message ||
      'موجودی کیف پول با موفقیت افزایش یافت',
  )
}

const retryFetchWallet = async () => {
  await walletStore.fetchWalletData()
}

onMounted(async () => {
  await walletStore.fetchWalletData()
})
</script>

<template>
  <section class="space-y-6 px-10 py-28">
    <!-- عنوان صفحه -->
    <div
        class="flex flex-wrap items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-text">
          کیف پول
        </h1>

        <p class="mt-1 text-sm text-lightText">
          مدیریت موجودی و مشاهده تراکنش‌های
          کیف پول
        </p>
      </div>

      <BaseButton
          type="button"
          variant="primary"
          size="sm"
          :disabled="pending"
          @click="openChargeModal"
      >
        شارژ کیف پول
      </BaseButton>
    </div>

    <!-- خطای دریافت اطلاعات -->
    <div
        v-if="error"
        class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20"
    >
      <p class="text-sm text-red-600">
        {{ error }}
      </p>

      <button
          type="button"
          class="mt-3 text-sm font-medium text-red-700 underline"
          @click="retryFetchWallet"
      >
        تلاش مجدد
      </button>
    </div>

    <!-- کارت موجودی -->
    <div
        v-if="pending && !wallet"
        class="rounded-2xl border border-input p-8 text-center text-sm text-lightText"
    >
      در حال دریافت اطلاعات کیف پول...
    </div>

    <div
        v-else
        class="grid grid-cols-1 gap-4 lg:grid-cols-3"
    >
      <div
          class="rounded-2xl bg-gradient-to-l from-hover to-cups p-6 text-white shadow-lg lg:col-span-2"
      >
        <p class="text-sm text-white/80">
          موجودی قابل استفاده
        </p>

        <div
            class="mt-4 flex flex-wrap items-end gap-2"
        >
          <strong class="text-3xl font-bold">
            {{ formatNumber(balanceInToman) }}
          </strong>

          <span class="pb-1 text-sm">
            تومان
          </span>
        </div>

        <p
            v-if="wallet?.updatedAt"
            class="mt-6 text-xs text-white/70"
        >
          آخرین بروزرسانی:
          {{ formatDate(wallet.updatedAt) }}
        </p>
      </div>

      <div
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1"
      >
        <div
            class="rounded-2xl border border-input bg-bg p-5 shadow-sm"
        >
          <p class="text-sm text-lightText">
            مجموع واریزها
          </p>

          <p
              class="mt-2 text-lg font-bold text-green-600"
          >
            {{
              formatRialToToman(
                  totalCredits,
              )
            }}
            تومان
          </p>
        </div>

        <div
            class="rounded-2xl border border-input bg-bg p-5 shadow-sm"
        >
          <p class="text-sm text-lightText">
            مجموع برداشت‌ها
          </p>

          <p
              class="mt-2 text-lg font-bold text-red-600"
          >
            {{
              formatRialToToman(
                  totalDebits,
              )
            }}
            تومان
          </p>
        </div>
      </div>
    </div>

    <!-- تاریخچه تراکنش‌ها -->
    <div
        class="rounded-2xl border border-input bg-bg p-4 shadow-sm sm:p-6"
    >
      <div
          class="mb-5 flex items-center justify-between"
      >
        <div>
          <h2
              class="text-lg font-bold text-text"
          >
            تاریخچه تراکنش‌ها
          </h2>

          <p
              class="mt-1 text-sm text-lightText"
          >
            آخرین واریزها و پرداخت‌های کیف
            پول
          </p>
        </div>
      </div>

      <div
          v-if="transactionsPending"
          class="py-10 text-center text-sm text-lightText"
      >
        در حال دریافت تراکنش‌ها...
      </div>

      <div
          v-else-if="transactions.length === 0"
          class="rounded-xl border border-dashed border-input py-10 text-center"
      >
        <p class="text-sm text-lightText">
          هنوز تراکنشی برای کیف پول ثبت نشده
          است.
        </p>
      </div>

      <!-- نمایش دسکتاپ -->
      <div
          v-else
          class="hidden overflow-x-auto md:block"
      >
        <table class="w-full text-right">
          <thead>
          <tr
              class="border-b border-input text-sm text-lightText"
          >
            <th class="px-3 py-4 font-medium">
              عنوان
            </th>

            <th class="px-3 py-4 font-medium">
              مبلغ
            </th>

            <th class="px-3 py-4 font-medium">
              وضعیت
            </th>

            <th class="px-3 py-4 font-medium">
              شماره مرجع
            </th>

            <th class="px-3 py-4 font-medium">
              تاریخ
            </th>
          </tr>
          </thead>

          <tbody>
          <tr
              v-for="transaction in transactions"
              :key="transaction.id"
              class="border-b border-input last:border-0"
          >
            <td class="px-3 py-4">
              <p
                  class="font-medium text-text"
              >
                {{
                  transaction.title ||
                  getTransactionTypeLabel(
                      transaction.type,
                  )
                }}
              </p>

              <p
                  v-if="transaction.description"
                  class="mt-1 text-xs text-lightText"
              >
                {{ transaction.description }}
              </p>
            </td>

            <td class="px-3 py-4">
                <span
                    class="font-bold"
                    :class="
                    getDirectionClass(
                      transaction,
                    )
                  "
                >
                  {{
                    getDirectionSign(
                        transaction,
                    )
                  }}
                  {{
                    formatRialToToman(
                        transaction.amount,
                    )
                  }}
                  تومان
                </span>
            </td>

            <td class="px-3 py-4">
                <span
                    class="rounded-full px-3 py-1 text-xs font-medium"
                    :class="
                    getStatusClass(
                      transaction.status,
                    )
                  "
                >
                  {{
                    getTransactionStatusLabel(
                        transaction.status,
                    )
                  }}
                </span>
            </td>

            <td
                class="px-3 py-4 text-sm text-lightText"
            >
              {{
                transaction.referenceId ||
                '---'
              }}
            </td>

            <td
                class="whitespace-nowrap px-3 py-4 text-sm text-lightText"
            >
              {{
                formatDate(
                    transaction.createdAt,
                )
              }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- نمایش موبایل -->
      <div
          v-if="
          !transactionsPending &&
          transactions.length > 0
        "
          class="space-y-3 md:hidden"
      >
        <article
            v-for="transaction in transactions"
            :key="transaction.id"
            class="rounded-xl border border-input p-4"
        >
          <div
              class="flex items-start justify-between gap-3"
          >
            <div>
              <p class="font-medium text-text">
                {{
                  transaction.title ||
                  getTransactionTypeLabel(
                      transaction.type,
                  )
                }}
              </p>

              <p
                  class="mt-1 text-xs text-lightText"
              >
                {{
                  formatDate(
                      transaction.createdAt,
                  )
                }}
              </p>
            </div>

            <span
                class="font-bold"
                :class="
                getDirectionClass(transaction)
              "
            >
              {{
                getDirectionSign(transaction)
              }}
              {{
                formatRialToToman(
                    transaction.amount,
                )
              }}
              تومان
            </span>
          </div>

          <div
              class="mt-4 flex items-center justify-between gap-3"
          >
            <span
                class="rounded-full px-3 py-1 text-xs font-medium"
                :class="
                getStatusClass(
                  transaction.status,
                )
              "
            >
              {{
                getTransactionStatusLabel(
                    transaction.status,
                )
              }}
            </span>

            <span
                class="text-xs text-lightText"
            >
              {{
                transaction.referenceId ||
                'بدون شماره مرجع'
              }}
            </span>
          </div>

          <p
              v-if="transaction.description"
              class="mt-3 text-sm leading-6 text-lightText"
          >
            {{ transaction.description }}
          </p>
        </article>
      </div>
    </div>

    <ChargeWalletModal
        v-model="chargeModalOpen"
        :pending="submitting"
        :error-message="actionError"
        @submit="submitChargeWallet"
    />
  </section>
</template>