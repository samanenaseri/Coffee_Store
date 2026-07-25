<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '#shared/product'
import { formatWeightLabel, getProductWeightPackages } from '#shared/product'
import {
  RiHeartFill,
  RiHeartLine,
  RiLoader4Line,
} from '@remixicon/vue'

import cartCup from '~/assets/icons/cart-cup.svg'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
const notification = useNotification()

const isFilling = ref(false)

const isProductFavorite = computed(() => {
  return favoriteStore.isFavorite(props.product.id)
})

const favoritePending = computed(() => {
  return favoriteStore.isActionPending(props.product.id)
})

const packages = computed(() => getProductWeightPackages(props.product))

const displayTomanPrice = computed(() => {
  if (packages.value.length > 0) {
    const minRial = Math.min(...packages.value.map(p => p.price))
    return Math.round(minRial / 10)
  }
  return Math.round(props.product.price / 10)
})

const pricePrefix = computed(() => (packages.value.length > 1 ? 'از ' : ''))

const weightHint = computed(() => {
  if (packages.value.length > 0) {
    if (packages.value.length === 1) {
      return formatWeightLabel(packages.value[0].weight, packages.value[0].unit)
    }
    return `${packages.value.length} بسته وزنی`
  }
  if (props.product.weight) {
    return formatWeightLabel(
      props.product.weight,
      props.product.weight_unit || props.product.weightUnit,
    )
  }
  return null
})

const addToCartWithAnimation = (product: Product) => {
  if (isFilling.value) {
    return
  }

  // Multiple packages: go to detail page to pick weight
  if (packages.value.length > 1) {
    navigateTo(`/products/${product.slug}`)
    return
  }

  isFilling.value = true
  const pkg = packages.value[0] ?? null
  cartStore.addToCart(product, pkg)

  setTimeout(() => {
    isFilling.value = false
  }, 900)
}

const toggleFavorite = async () => {
  if (favoritePending.value) {
    return
  }

  const result = await favoriteStore.toggleFavorite(props.product)

  if (!result.success) {
    notification.error(
        'عملیات ناموفق بود',
        'تغییر وضعیت علاقه‌مندی انجام نشد.',
    )

    return
  }

  notification.success(
      result.isFavorite
          ? 'به علاقه‌مندی‌ها اضافه شد'
          : 'از علاقه‌مندی‌ها حذف شد',
      props.product.title,
  )
}
</script>

<template>
  <article
      class="group relative overflow-hidden rounded-2xl bg-bg shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl card-des"
  >
    <div class="relative overflow-hidden">
      <button
          type="button"
          class="absolute left-3 top-3 z-20 flex size-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
          :class="{
    'text-red-500': isProductFavorite,
    'text-gray-600': !isProductFavorite,
  }"
          :disabled="favoritePending"
          :aria-label="
    isProductFavorite
      ? 'حذف از علاقه‌مندی‌ها'
      : 'افزودن به علاقه‌مندی‌ها'
  "
          @click.stop="toggleFavorite"
      >
        <RiLoader4Line
            v-if="favoritePending"
            class="size-6 animate-spin"
        />

        <RiHeartFill
            v-else-if="isProductFavorite"
            class="size-6 scale-110 text-red-500 transition-transform duration-300"
        />

        <RiHeartLine
            v-else
            class="size-6 text-gray-600 transition-transform duration-300"
        />
      </button>
      <img
          :src="product.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'"
          :alt="product.title"
          class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div
          class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      ></div>
    </div>

    <svg
        class="product-info-curve"
        viewBox="0 0 400 70"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
      <path
          d="
  M 0 40
  C 45 40, 58 40, 72 32
  C 82 20, 89 8, 101 4
  C 112 0, 123 0, 130 4
  C 141 8, 148 20, 156 32
  C 168 40, 185 40, 400 40
  L 400 100
  L 0 100
  Z
"
      />
    </svg>

    <!-- دکمه آیکن با انیمیشن پر شدن -->
    <button
        type="button"
        class="cart-curve-button rounded-full items-center text-center p-1 bg-background "
        :class="{ 'is-filling': isFilling }"
        @click="addToCartWithAnimation(product)"
    >
      <span class="cup-wrapper">
        <!-- آیکن پایه -->
        <cartCup class="h-8 w-8 cup-base text-center " />
          <span
              class="tooltip-text absolute -translate-x-1 mb-10  w-max min-w-max whitespace-nowrap rounded bg-lightText px-2 py-1 text-xs text-white opacity-0 pointer-events-none transition-opacity duration-200"
          >
    افزودن به سبد خرید
  </span>

        <!-- لایه پر شدن -->
       <span class="fake-liquid"></span>
      </span>
    </button>

    <div class="p-5">
      <h3
          class="text-lg font-bold text-text transition-colors duration-300 group-hover:text-divider"
      >
        {{ product.title }}
      </h3>

      <p class="mt-2 text-sm leading-6 text-lightText ">
        {{ product.description }}
      </p>

      <p v-if="weightHint" class="mt-1 text-xs text-lightText">
        {{ weightHint }}
      </p>

      <div class="mt-4 flex items-center justify-between">
        <span class="font-bold text-divider">
          {{ pricePrefix }}{{ displayTomanPrice.toLocaleString('fa-IR') }} تومان
        </span>

        <NuxtLink
          :to="`/products/${product.slug}`"
          class="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 main-button txt-btn shadow-theme-xs hover:bg-brand-600 px-4 py-2 text-sm opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        >
          مشاهده
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-info-curve {
  position: absolute;
  left: 0;
  right: 0;
  top: 43%;
  width: 100%;
  height: 70px;
  z-index: 5;

}

.product-info-curve path {
  fill: var(--color-bg, #f7f2ea);
}
/* دکمه آیکن */
.cart-curve-button {
  position: absolute;
  top: 44%;
  left: 22.3%;
  z-index: 10;

  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #5b341c;
  background: var(--color-background);
  border: none;
  cursor: pointer;

  transition: transform 0.3s ease, color 0.3s ease;
}

.cart-curve-button:hover {
  transform: translateY(-2px) scale(1);
}
.cart-curve-button:hover .cup-base {
  color: var(--color-cupHover) !important;
}
.is-filling .cup-base {
  color: var(--color-lightText) !important;
}

/* wrapper دو لایه ای برای پر شدن */
.cup-wrapper {
  position: relative;
  width: 32px;
  height: 32px;
  overflow: hidden;
}

/* آیکن پایه */
.cup-base {
  position: absolute;
  inset: 0;
  color: currentColor;
}
.cup-base :deep(svg) {
  fill: currentColor;
  stroke: currentColor;
}

.cup-fill :deep(path),
.cup-fill :deep(svg) {
  fill: currentColor;
  stroke: currentColor;
}

.fake-liquid {
  position: absolute;
  bottom: 6px;
  left: 5px;
  right: 8px;
  height: 0;
  background: var(--color-liquid);
  border-radius: 0 0 6px 6px;
  transition: height 2s ease-in-out;
}
.cart-curve-button.is-filling .fake-liquid {
  height: 25px; /* ارتفاع پر شدن */
}
/* وقتی کلیک شد، انیمیشن پر شدن فعال میشه */
.cart-curve-button.is-filling .cup-fill {
  animation: cupFill 1s ease-in-out forwards;
}

/* حرکت نرم پر شدن از پایین به بالا */
@keyframes cupFill {
  0% {
    clip-path: inset(100% 0 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}
.cup-base {
  color: #9F6B2A !important;
}
.cart-curve-button:hover .tooltip-text {
  opacity: 1 !important;
}
.tooltip-text {
  z-index: 99999;
  position: fixed;
  top: -20px;
  right: -40px;
}
</style>