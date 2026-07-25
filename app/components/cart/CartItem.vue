<script setup lang="ts">
import type { CartItem as CartItemType } from "#shared/cart"
import { formatWeightLabel } from "#shared/product"
import { useCartStore } from "~/stores/cart"
import { RiDeleteBinLine } from '@remixicon/vue'

const props = defineProps<{
  item: CartItemType
}>()

const cartStore = useCartStore()
const { resolveUrl } = useImageUrl()

const weightLabel = computed(() => {
  const w = props.item.selectedWeight ?? props.item.product.weight
  const u = props.item.selectedWeightUnit
    ?? props.item.product.weight_unit
    ?? props.item.product.weightUnit
  if (!w) return null
  return formatWeightLabel(w, u)
})

const imageSrc = computed(() => {
  if (!props.item.product.image) {
    return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop'
  }
  return resolveUrl(props.item.product.image)
})

const packageId = computed(() => props.item.weightPackageId ?? null)

const unitToman = computed(() => Math.round(props.item.product.price / 10))
</script>

<template>
  <div class="flex items-center gap-4 p-4 rounded-xl bg-background shadow-md hover:-translate-y-1 transition-transform">
    <img
      :src="imageSrc"
      :alt="item.product.title"
      class="w-24 h-24 object-cover rounded-xl"
    />

    <div class="flex-1 space-y-2">
      <h3 class="font-bold text-text">
        {{ item.product.title }}
      </h3>
      <p v-if="weightLabel" class="text-lightText text-sm">
        وزن: {{ weightLabel }}
      </p>
      <p class="text-text mt-1">
        {{ cartStore.formatPrice(unitToman) }} تومان
      </p>

      <div class="flex items-center gap-2 mt-2">
        <button
          type="button"
          class="px-3 py-1 bg-input rounded-full"
          @click="cartStore.decreaseQuantity(item.product.id, packageId)"
        >
          -
        </button>
        <span class="text-text min-w-[1.5rem] text-center">{{ item.quantity }}</span>
        <button
          type="button"
          class="px-3 py-1 bg-input rounded-full"
          @click="cartStore.increaseQuantity(item.product.id, packageId)"
        >
          +
        </button>

        <button
          type="button"
          class="ml-auto text-red-500 hover:text-red-600"
          aria-label="حذف از سبد"
          @click="cartStore.removeFromCart(item.product.id, packageId)"
        >
          <RiDeleteBinLine />
        </button>
      </div>
    </div>
  </div>
</template>
