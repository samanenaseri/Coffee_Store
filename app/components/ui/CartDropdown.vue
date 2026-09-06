<script setup lang="ts">
import { useCartStore } from "~/stores/cart"
import { ref } from "vue"
import { RiShoppingCartLine } from "@remixicon/vue"

const cartStore = useCartStore()
const { resolveUrl } = useImageUrl()
const showDropdown = ref(false)

const toggleDropdown = (state?: boolean) => {
  if (state !== undefined) showDropdown.value = state
  else showDropdown.value = !showDropdown.value
}


const closeDropdown = () => {
  showDropdown.value = false
}

const goToCart = () => {
  closeDropdown()
  navigateTo('/cart')
}

const goToCheckout = () => {
  closeDropdown()
  navigateTo(cartStore.items.length > 0 ? '/checkout' : '/cart')
}
</script>

<template>
  <div class="relative">
    <!-- آیکن سبد خرید -->
    <button
        type="button"
        @mouseenter="toggleDropdown(true)"
        @click="goToCart"
        aria-label="مشاهده سبد خرید"
        class="relative flex items-center justify-center text-text"
    >
      <RiShoppingCartLine class="size-6" />

      <!-- تعداد محصولات -->
      <span
          v-if="cartStore.totalItems > 0"
          class="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs text-white"
      >
        {{ cartStore.totalItems }}
      </span>
    </button>

    <!-- dropdown -->
    <div
        v-show="showDropdown"
        @mouseenter="toggleDropdown(true)"
        @mouseleave="toggleDropdown(false)"
        class="absolute left-0 mt-2 w-80 bg-white dark:bg-stone-900 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-4 z-50 transition-all duration-300 opacity-100"
    >
      <h3 class="text-text font-bold mb-3">سبد خرید شما</h3>

      <div v-if="cartStore.items.length === 0" class="text-stone-500">
        سبد خرید شما خالی است
      </div>

      <div v-else class="space-y-3 max-h-64 overflow-y-auto">
        <div
            v-for="item in cartStore.items"
            :key="`${item.product.id}:${item.weightPackageId ?? 'default'}`"
            class="flex items-center gap-3"
        >
          <img
              :src="resolveUrl(item.product.image) || '/images/great-coffee-bean.jpeg'"
              :alt="item.product.title"
              class="w-12 h-12 object-cover rounded-lg"
          />

          <div class="flex-1">
            <h4 class="text-sm font-medium text-text">
              {{ item.product.title }}
            </h4>
            <p v-if="item.selectedWeight" class="text-xs text-stone-400">
              {{ item.selectedWeight }}{{ item.selectedWeightUnit === 'kg' ? 'kg' : 'g' }}
            </p>
            <p class="text-xs text-stone-500">
              {{ cartStore.formatPrice(Math.round(item.product.price / 10)) }} × {{ item.quantity }}
            </p>
          </div>

          <button
              class="text-red-500 hover:text-red-600 text-sm"
              @click="cartStore.removeFromCart(item.product.id, item.weightPackageId)"
          >
            حذف
          </button>
        </div>
      </div>

      <!-- دکمه‌ها -->
      <div class="mt-4 flex gap-3" @mouseleave="toggleDropdown(true)">

        <base-button @click="goToCart">مشاهده سبد</base-button>
        <base-button @click="goToCheckout">تسویه حساب</base-button>
      </div>
    </div>
  </div>
</template>
