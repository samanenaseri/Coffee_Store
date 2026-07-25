<script setup lang="ts">
import ProductCard from "~/components/products/ProductCard.vue";

definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'علاقه‌مندی‌های من',
  robots: 'noindex, nofollow',
})

const favoriteStore = useFavoriteStore()

const {
  items,
  pending,
  error,
  totalItems,
} = storeToRefs(favoriteStore)

onMounted(async () => {
  await favoriteStore.fetchFavorites()
})
</script>

<template>
  <section>
    <!-- عنوان صفحه -->
    <header
        class="mb-6 flex flex-wrap items-start justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-text">
          علاقه‌مندی‌های من
        </h1>

        <p class="mt-2 text-sm text-lightText">
          محصولاتی که برای مشاهده یا خرید بعدی ذخیره کرده‌اید.
        </p>
      </div>

      <span
          v-if="!pending"
          class="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-950/20 dark:text-amber-300"
      >
        {{ totalItems }} محصول
      </span>
    </header>

    <!-- loading -->
    <div
        v-if="pending"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      <div
          v-for="item in 6"
          :key="item"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-bg dark:border-gray-700"
      >
        <div class="h-56 animate-pulse bg-gray-200 dark:bg-gray-800" />

        <div class="space-y-4 p-5">
          <div
              class="h-5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
          />

          <div
              class="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800"
          />

          <div
              class="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
          />
        </div>
      </div>
    </div>

    <!-- خطا -->
    <div
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <p class="text-sm text-red-600 dark:text-red-300">
        {{ error }}
      </p>

      <button
          type="button"
          class="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          @click="favoriteStore.fetchFavorites"
      >
        تلاش دوباره
      </button>
    </div>

    <!-- خالی بودن علاقه‌مندی‌ها -->
    <div
        v-else-if="items.length === 0"
        class="rounded-2xl border border-dashed border-gray-300 px-5 py-16 text-center dark:border-gray-700"
    >
      <div
          class="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/20"
      >
        <span class="text-3xl">
          ♡
        </span>
      </div>

      <h2 class="mt-5 text-lg font-bold text-text">
        هنوز محصولی ذخیره نکرده‌اید
      </h2>

      <p class="mx-auto mt-2 max-w-md text-sm leading-7 text-lightText">
        با انتخاب آیکن قلب روی محصولات، آن‌ها را به فهرست علاقه‌مندی‌های خود اضافه کنید.
      </p>

      <NuxtLink
          to="/products"
          class="mt-6 inline-flex items-center justify-center rounded-xl bg-amber-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-800"
      >
        مشاهده محصولات
      </NuxtLink>
    </div>

    <!-- محصولات علاقه‌مندی -->
    <div
        v-else
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      <ProductCard
          v-for="product in items"
          :key="product.id"
          :product="product"
      />
    </div>
  </section>
</template>