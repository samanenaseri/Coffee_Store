<script setup lang="ts">
defineProps<{
  amount?: number | null
  refCode?: string | null
  date?: string | null
  reviewStatus?: string | null
}>()

const formatPrice = (n: number) =>
  new Intl.NumberFormat('fa-IR').format(Math.round((n || 0) / 10))
</script>

<template>
  <div class="rounded-2xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-4 shadow-sm">
    <div class="flex items-start gap-3">
      <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 text-xl">
        ⏳
      </div>
      <div>
        <h3 class="text-lg font-bold text-text">
          رسید واریز ثبت شد
        </h3>
        <p class="mt-1 text-sm text-lightText leading-7">
          اطلاعات کارت‌به‌کارت شما دریافت شد و در انتظار بررسی مدیر است.
        </p>
      </div>
    </div>

    <div class="rounded-xl bg-menu border border-input p-4 text-sm space-y-2.5">
      <div v-if="amount" class="flex justify-between gap-3">
        <span class="text-lightText">مبلغ اعلام‌شده</span>
        <span class="font-medium text-text">{{ formatPrice(amount) }} تومان</span>
      </div>
      <div v-if="refCode" class="flex justify-between gap-3">
        <span class="text-lightText">شماره تراکنش</span>
        <span class="font-mono text-text ltr" dir="ltr">{{ refCode }}</span>
      </div>
      <div v-if="date" class="flex justify-between gap-3">
        <span class="text-lightText">تاریخ واریز</span>
        <span class="text-text">{{ date }}</span>
      </div>
      <div class="flex justify-between gap-3 border-t border-input/60 pt-2.5">
        <span class="text-lightText">وضعیت</span>
        <span
          class="font-medium"
          :class="{
            'text-amber-700': reviewStatus === 'pending_review' || !reviewStatus,
            'text-emerald-700': reviewStatus === 'approved',
            'text-red-600': reviewStatus === 'rejected',
          }"
        >
          <template v-if="reviewStatus === 'approved'">تأیید شده</template>
          <template v-else-if="reviewStatus === 'rejected'">رد شده — مجدداً اطلاعات را ارسال کنید</template>
          <template v-else>در انتظار بررسی</template>
        </span>
      </div>
    </div>
  </div>
</template>
