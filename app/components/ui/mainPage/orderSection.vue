
<template>
<section>
  <div class="container mx-auto mt-20 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 justify-items-center gap-10">
    <div class="border border-dashed border-border rounded-lg border-2 bg-delivery">
      <div class="flex items-start justify-around gap-4 p-8">
        <Order class="h-16 w-16 text-cups"></Order>
        <div class="flex flex-col gap-4">
          <p class="text-lg text-text">سفارش قهوه</p>
          <p class="text-base text-text">انتخاب طعم دلخواهت و یک فنجان تازه، فقط چند قدم تا تو!</p>
        </div>
      </div>
    </div>
    <div class="border border-dashed border-border rounded-lg border-2 bg-delivery">
      <div class="flex items-start justify-around gap-4 p-8">
          <FastDelivery class="h-16 w-16 text-cups"></FastDelivery>
        <div class="flex flex-col gap-4">
          <p class="text-lg text-text">ارسال فوری قهوه</p>
          <p class="text-base text-text">رسال فوری قهوه؛ طعم تازه و گرم، در کوتاه‌ترین زمان کنار تو!</p>
        </div>
      </div>
    </div>
    <div class="border border-dashed border-border rounded-lg border-2 bg-delivery">
      <div class="flex items-start justify-around gap-4 p-8">
        <Delivered class="h-16 w-16 text-cups"></Delivered>
        <div class="flex flex-col gap-4">
          <p class="text-lg text-text">تحویل قهوه</p>
          <p class="text-base text-text">تحویل قهوه؛ رساندن عطر و طعم تازه، درست تا دمِ در!</p>
        </div>
      </div>

  </div>
  </div>
</section>
</template>

<script setup lang="ts">
import Order from '~/assets/icons/order.svg'
import FastDelivery from '~/assets/icons/fast-delivery.svg'
import Delivered from '~/assets/icons/delivered.svg'
</script>
<style scoped>

</style>