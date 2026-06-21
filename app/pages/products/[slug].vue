<script setup lang="ts">
import type {Product} from "#shared/product";

const route = useRoute()
const slug = route.params.slug as string

const { data, pending, error } = useAsyncData(
  `product-${slug}`,
  () => $fetch(`/api/products/${slug}`),
)

const product = computed(() => (data.value as { data: Product } | null)?.data ?? null)

useSeoMeta({
  title: () => product.value
      ? `${product.value.title} | قهوه‌فروشی`
      : "محصول | قهوه‌فروشی",

  description: () => product.value?.description ?? "مشاهده جزئیات محصول",

  ogTitle: () => product.value?.title ?? "محصول | قهوه‌فروشی",

  ogDescription: () => product.value?.description ?? "مشاهده جزئیات محصول",

  ogImage: () => product.value?.image ?? "",
})
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-20">
      <div v-if="pending" class="mt-8 animate-pulse space-y-4">
        <div class="bg-text rounded-lg h-96 w-full" />
        <div class="bg-text rounded h-8 w-1/3" />
        <div class="bg-text rounded h-4 w-2/3" />
      </div>

      <div v-else-if="error" class="mt-8 text-center text-red-500">
        محصول مورد نظر یافت نشد
      </div>

      <article v-else-if="product" class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            :src="product.image"
            :alt="product.imageAlt"
            class="w-full rounded-lg shadow-md"
          />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-text">{{ product.title }}</h1>
          <p class="text-lightText mt-2">{{ product.description }}</p>
          <div class="flex flex-col gap-4 mt-4">
            <div class="mt-6 flex gap-1 text-lightText">
                <span
                    v-for="star in 5"
                    :key="star"
                    class="text-lg"
                    :class="star <= product.rating ? 'opacity-100' : 'opacity-25'"
                >
                  ★
                </span>
            </div>
            <span class="text-2xl font-bold text-text">
              {{ product.price.toLocaleString("fa-IR") }} تومان
            </span>
          </div>
          <p class="text-lightText mt-2">
            موجودی: {{ product.inventory.toLocaleString("fa-IR") }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>