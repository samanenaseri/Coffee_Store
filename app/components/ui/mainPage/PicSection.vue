
<template>
  <section class="relative overflow-hidden mt-20">
    <div class="absolute inset-0 bg-[url('/images/great-coffee-bean.jpeg')] bg-cover bg-[center_60%] brightness-50"></div>
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative z-10 container mx-auto px-4">
      <div class="flex flex-col items-center justify-center gap-8 min-h-[24rem]">
        <p class="text-white text-xl text-center leading-[40px] font-bold max-w-3xl tracking-[3px]">
          نوشیدن قهوه فقط چشیدن یک طعم نیست؛ انگار چند دقیقه آرامش را در یک فنجان نگه داشته‌ای.
          عطر گرم و طعم دلنشینش خستگی را کم می‌کند و حال‌وهوای روز را عوض می‌کند.
        </p>
        <div>
          <cupCoffeeIcon class="text-white h-24 w-24" />
        </div>

      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import cupCoffeeIcon  from '~/assets/icons/cup-coffee.svg'
</script>