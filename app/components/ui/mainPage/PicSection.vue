
<template>
  <section class="relative overflow-hidden mt-20">
    <div class="absolute inset-0 bg-cover bg-[center_60%] brightness-50" :style="{ backgroundImage: `url('${backgroundImage}')` }"></div>
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative z-10 container mx-auto px-4">
      <div class="flex flex-col items-center justify-center gap-8 min-h-[24rem]">
        <p class="text-white text-xl text-center leading-[40px] font-bold max-w-3xl tracking-[3px]">
          {{ quote }}
        </p>
        <div>
          <cupCoffeeIcon class="text-white h-24 w-24" />
        </div>
        <a v-if="link" :href="link" class="mt-4 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all">
          {{ linkText }}
        </a>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import cupCoffeeIcon  from '~/assets/icons/cup-coffee.svg'

defineProps({
  backgroundImage: { type: String, default: '/images/great-coffee-bean.jpeg' },
  quote: { type: String, default: 'نوشیدن قهوه فقط چشیدن یک طعم نیست؛ انگار چند دقیقه آرامش را در یک فنجان نگه داشته‌ای. عطر گرم و طعم دلنشینش خستگی را کم می‌کند و حال‌وهوای روز را عوض می‌کند.' },
  link: { type: String, default: '' },
  linkText: { type: String, default: 'مشاهده محصولات' },
})
</script>
