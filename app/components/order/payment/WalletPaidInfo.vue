<script setup lang="ts">
defineProps<{
  orderId: number
}>()
</script>

<template>
  <div class="rounded-2xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 space-y-3">
    <h3 class="text-lg font-bold text-emerald-800 dark:text-emerald-300">
      پرداخت با کیف پول انجام شد
    </h3>
    <p class="text-sm text-lightText leading-7">
      سفارش
      <strong class="text-text">#{{ orderId }}</strong>
      با موفقیت ثبت و مبلغ آن از کیف پول شما کسر شد.
    </p>
  </div>
</template>
