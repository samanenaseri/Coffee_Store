<script setup lang="ts">
defineProps<{
  product: any
}>()
</script>
<template>
  <article class="rounded-lg shadow-lg overflow-hidden sm:rounded-md ">
    <img
        :src="product.image"
        :alt="product.imageAlt"
        class="w-full h-48 object-cover"
        loading="lazy"
    />
    <div class="p-4 bg-card">
      <span class="text-yellow-500 text-sm prd-title">★ {{ product.rating }}</span>
      <h2 class="font-semibold text-text">
        <NuxtLink :to="`/products/${product.slug}`">
          {{ product.title }}
        </NuxtLink>
      </h2>
      <p class="text-stone-500 text-sm mt-1">{{product.description}}</p>
      <div class="flex items-center justify-between mt-3">
        <span class="text-amber-700 font-bold">{{ product.price.toLocaleString("fa-IR") }} تومان</span>

      </div>
    </div>

  </article>
</template>

