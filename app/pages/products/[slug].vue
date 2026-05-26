<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data, pending, error } = useAsyncData(
  `product-${slug}`,
  () => $fetch(`/api/products/${slug}`),
)

const product = computed(() => (data.value as { data: Product } | null)?.data ?? null)

useSeoMeta(() => ({
  title: product.value ? `${product.value.title} | قهوه‌فروشی` : "محصول | قهوه‌فروشی",
  description: product.value?.description ?? "مشاهده جزئیات محصول",
  ogTitle: product.value?.title,
  ogDescription: product.value?.description,
  ogImage: product.value?.image,
}))
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-8">
      <NuxtLink to="/products" class="text-amber-700 hover:underline">
        ← بازگشت به محصولات
      </NuxtLink>

      <div v-if="pending" class="mt-8 animate-pulse space-y-4">
        <div class="bg-stone-200 rounded-lg h-96 w-full" />
        <div class="bg-stone-200 rounded h-8 w-1/3" />
        <div class="bg-stone-200 rounded h-4 w-2/3" />
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
          <h1 class="text-3xl font-bold text-stone-800">{{ product.title }}</h1>
          <p class="text-stone-600 mt-2">{{ product.description }}</p>
          <div class="flex items-center gap-4 mt-4">
            <span class="text-2xl font-bold text-amber-700">
              {{ product.price.toLocaleString("fa-IR") }} تومان
            </span>
            <span class="text-yellow-500 text-lg">★ {{ product.rating }}</span>
          </div>
          <p class="text-stone-500 mt-2">
            موجودی: {{ product.inventory.toLocaleString("fa-IR") }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>