
<template>
<section>
  <div class="container mx-auto px-4 mt-20 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 justify-items-center gap-10">
    <div v-for="(card, index) in displayCards" :key="index" class="border border-dashed border-border rounded-lg border-2 bg-delivery">
      <div class="flex items-start justify-around gap-4 p-8">
        <component :is="getServiceIcon(card.icon)" class="h-16 w-16 text-cups" />
        <div class="flex flex-col gap-4">
          <p class="text-lg text-text">{{ card.title }}</p>
          <p class="text-base text-text">{{ card.description }}</p>
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

const props = defineProps({
  cards: {
    type: Array as () => { title: string; description: string; icon: string }[],
    default: () => [
      { title: 'سفارش قهوه', description: 'انتخاب طعم دلخواهت و یک فنجان تازه، فقط چند قدم تا تو!', icon: 'order' },
      { title: 'ارسال فوری قهوه', description: 'رسال فوری قهوه؛ طعم تازه و گرم، در کوتاه‌ترین زمان کنار تو!', icon: 'fast-delivery' },
      { title: 'تحویل قهوه', description: 'تحویل قهوه؛ رساندن عطر و طعم تازه، درست تا دمِ در!', icon: 'delivered' },
    ]
  },
})

const iconMap: Record<string, any> = {
  'order': Order,
  'fast-delivery': FastDelivery,
  'delivered': Delivered,
}

function getServiceIcon(icon: string) {
  return iconMap[icon] || Order
}

const displayCards = computed(() => props.cards || [])
</script>
