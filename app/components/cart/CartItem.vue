<script setup lang="ts">
import type { CartItem as CartItemType } from "#shared/cart"
import { useCartStore } from "~/stores/cart"
import {RiDeleteBinLine} from '@remixicon/vue'

defineProps<{
  item: CartItemType
}>()

const cartStore = useCartStore()
</script>

<template>
  <div class="flex items-center gap-4 p-4 rounded-xl bg-background shadow-md hover:-translate-y-1">
    <img :src="item.product.image" :alt="item.product.title" class="w-24 h-24 object-cover rounded-xl" />

    <div class="flex-1 space-y-2">
      <h3 class="font-bold text-text">{{ item.product.title }}</h3>
      <p class="text-lightText text-sm mt-1">{{ item.product.description }}</p>
      <p class="text-text mt-1">{{ cartStore.formatPrice(item.product.price) }} تومان</p>

      <div class="flex items-center gap-2 mt-2">
        <button
            class="px-3 py-1 bg-input rounded-full"
            @click="cartStore.decreaseQuantity(item.product.id)"
        >-</button>
        <span class="text-text">{{ item.quantity }}</span>
        <button
            class="px-3 py-1 bg-input rounded-full"
            @click="cartStore.increaseQuantity(item.product.id)"
        >+</button>

        <button
            class="ml-auto text-red-500 hover:text-red-600"
            @click="cartStore.removeFromCart(item.product.id)"
        >
          <RiDeleteBinLine/>
        </button>
      </div>
    </div>
  </div>
</template>