<template>
  <div class="relative pr-6">

    <!-- Progress Bar -->
    <div class="mb-6 h-2 w-full rounded-full bg-[#E7DCCF] dark:bg-hover">
      <div
          class="h-2 rounded-full bg-background transition-all duration-700"
          :style="{width: (progressMap[history.at(-1)?.status ?? 'pending' ] ?? 0) + '%'
}"
      />
    </div>

    <!-- Timeline -->
    <div
        v-for="(item, index) in history"
        :key="index"
        class="flex gap-4"
    >

      <!-- LEFT SIDE (ICON + LINE) -->
      <div class="relative flex flex-col items-center">

        <!-- Circle -->
        <div
            class="flex items-center justify-center rounded-full transition-all duration-500"
            :class="[
            'h-10 w-10',
            index <= currentIndex ? 'bg-background' : 'bg-gray-200'
          ]"
        >
          <component
              :is="icons[item.status]"
              class="h-6 w-6 svg-animate"
              :class="[iconColor[item.status]]"
              :style="{ animationDelay: `${index * 150}ms`, }"
          />
        </div>

        <!-- Line -->
        <div
            v-if="index !== history.length - 1"
            class="w-1 flex-1 transition-all duration-500"
            :class="index < currentIndex ? 'bg-background' : 'bg-gray-200'"
        />
      </div>

      <!-- CONTENT -->
      <div class="flex-1 pb-6">

        <p class="font-semibold text-text">
          {{ item.description }}
        </p>

        <p class="text-xs text-lightText mt-1">
          {{ timeAgo(item.date) }}
        </p>

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { OrderStatusHistory } from '#shared/order'
import Pending from '~/assets/icons/orderTimeLine/pending.svg'
import Processing from '~/assets/icons/orderTimeLine/processing.svg'
import Shipped from '~/assets/icons/orderTimeLine/shipped.svg'
import Delivered from '~/assets/icons/orderTimeLine/delivered.svg'
import Canceled from '~/assets/icons/orderTimeLine/cancel.svg'
const props = defineProps<{
  history: OrderStatusHistory[]
}>()
const history = computed(() => props.history)
const icons = {
  order_created:Pending,
  pending: Pending,
  processing: Processing,
  shipped: Shipped,
  delivered: Delivered,
  canceled: Canceled,
  cancel_requested:Canceled,
  return_requested:Pending,
  cancel_approved:Pending,
  cancel_rejected:Pending,
  return_approved:Pending,
  return_rejected:Pending,
  returned:Pending,
}
const iconColor = {
  order_created:'text-amber-600',
  pending: 'text-amber-600',
  processing: 'text-blue-600',
  shipped: 'text-purple-600',
  delivered: 'text-green-600',
  canceled: 'text-red-600',
  cancel_requested:'text-red-600',
  cancel_approved:'',
  cancel_rejected:'',
  return_requested:'text-gray-600',
  return_approved:'',
  return_rejected:'',
  returned:'',
}
const statusStyle = {
  pending: 'bg-amber-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  canceled: 'bg-red-500',
}
const iconGlow = {
  pending: 'drop-shadow(0 0 6px #f59e0b)',
  processing: 'drop-shadow(0 0 6px #3b82f6)',
  shipped: 'drop-shadow(0 0 6px #8b5cf6)',
  delivered: 'drop-shadow(0 0 6px #22c55e)',
  canceled: 'drop-shadow(0 0 6px #ef4444)',
}

// 🟣 relative time
const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()

  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (mins < 60) return `${mins} دقیقه پیش`
  if (hours < 24) return `${hours} ساعت پیش`
  return `${days} روز پیش`
}

// 🟢 progress map
const progressMap = {
  pending: 10,
  processing: 40,
  shipped: 75,
  delivered: 100,
  canceled: 0,
  cancel_requested:0,
  return_requested:0,
}
const currentIndex = computed(() =>
    history.value.findIndex(
        item => item.status === history.value.at(-1)?.status
    )
)
</script>

<style scoped>
@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.svg-animate {
  animation: pop 0.6s ease-out forwards;
}
</style>