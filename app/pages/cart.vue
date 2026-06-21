<script setup lang="ts">
useSeoMeta({
  title: "سبد خرید | قهوه‌فروشی",
  robots: "noindex, nofollow",
})
import { useCartStore } from "~/stores/cart"
import CartItem from "~/components/cart/CartItem.vue"

const cartStore = useCartStore()
</script>

<template>
  <main class="pt-28 container mx-auto px-4">
    <h1 class="text-3xl font-bold text-text mb-6">سبد خرید شما</h1>

    <div v-if="cartStore.items.length === 0" class="text-center text-lightText py-20">
      سبد خرید شما خالی است.
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-12">
      <!-- لیست آیتم‌ها -->
      <div class="lg:col-span-8 space-y-4 ">
        <CartItem
            v-for="item in cartStore.items"
            :key="item.product.id"
            :item="item"
        />
      </div>

      <!-- خلاصه سفارش -->
      <div class="lg:col-span-4 bg-delivery rounded-xl p-6 shadow-lg ">
        <h2 class="text-2xl font-bold text-text mb-4">خلاصه سفارش</h2>

        <div class="flex justify-between mb-2">
          <span class="text-lightText text-base font-bold">تعداد کل آیتم‌ها:</span>
          <span class="text-lightText text-base font-medium">{{ cartStore.totalItems }}</span>
        </div>

        <div class="flex justify-between mb-2">
          <span class="text-lightText text-base font-bold">جمع کل:</span>
          <span class="text-lightText text-base font-medium">{{ cartStore.formatPrice(cartStore.totalPrice) }} تومان</span>
        </div>
        <NuxtLink
            to="/checkout"
            class="flex-1"
        >
        <base-button
            size="md"
            variant="primary"
            className="w-full"
        >ثبت سفارش</base-button>
          </NuxtLink>

      </div>
    </div>
  </main>
</template>