<script setup lang="ts">
defineProps<{
  orderId: number
  payableAmount: number
}>()

const formatPrice = (n: number) =>
  new Intl.NumberFormat('fa-IR').format(Math.round(n / 10))
</script>

<template>
  <div class="rounded-2xl border border-sky-200 bg-sky-50/50 dark:bg-sky-950/20 p-5 space-y-4">
    <h3 class="text-lg font-bold text-text">
      پرداخت در محل (درب منزل)
    </h3>
    <p class="text-sm text-lightText leading-7">
      سفارش شما با موفقیت ثبت شد. وضعیت پرداخت فعلاً
      <strong class="text-text">در انتظار پرداخت</strong>
      است و مبلغ هنگام تحویل کالا از شما دریافت می‌شود.
    </p>
    <div class="rounded-xl bg-menu border border-input p-4 text-sm space-y-2">
      <div class="flex justify-between">
        <span class="text-lightText">شماره سفارش:</span>
        <span class="font-bold text-text">#{{ orderId }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-lightText">مبلغ قابل پرداخت هنگام تحویل:</span>
        <span class="font-bold text-amber-800">{{ formatPrice(payableAmount) }} تومان</span>
      </div>
      <div class="flex justify-between">
        <span class="text-lightText">وضعیت پرداخت:</span>
        <span class="text-amber-700 font-medium">در انتظار پرداخت</span>
      </div>
    </div>
    <p class="text-xs text-lightText">
      می‌توانید وضعیت سفارش را از بخش «سفارش‌های من» در پروفایل پیگیری کنید.
    </p>
  </div>
</template>
