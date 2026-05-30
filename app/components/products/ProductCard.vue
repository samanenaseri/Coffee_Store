<script setup lang="ts">
defineProps<{
  product: any
}>()
</script>
<template>
  <article class="bg-[#2D1C07] rounded-lg shadow-lg overflow-hidden sm:rounded-md">
    <img
        :src="product.image"
        :alt="product.imageAlt"
        class="w-full h-48 object-cover"
        loading="lazy"
    />
    <div class="p-4">
      <span class="text-yellow-500 text-sm">★ {{ product.rating }}</span>
      <h2 class="font-semibold text-stone-800">
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

