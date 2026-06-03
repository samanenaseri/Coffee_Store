<script setup lang="ts">
defineProps<{
  product: any
}>()
</script>
<template>
  <article
      class="group overflow-hidden rounded-2xl bg-bg shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl card-des"
  >
    <div class="relative overflow-hidden">
      <img
          :src="product.image"
          :alt="product.title"
          class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <!-- soft overlay on hover -->
      <div
          class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      ></div>
    </div>

    <div class="p-5">
      <h3
          class="text-lg font-bold text-text transition-colors duration-300 group-hover:text-divider"
      >
        {{ product.title }}
      </h3>

      <p class="mt-2 text-sm leading-6 text-lightText ">
        {{ product.description }}
      </p>

      <div class="mt-4 flex items-center justify-between">
        <span class="font-bold text-divider">
          {{ product.price }} تومان
        </span>
        <NuxtLink :to="`/products/${product.slug}`">
        <button
            class="rounded-full bg-amber-700 px-4 py-2 text-sm text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          مشاهده
        </button>
          </NuxtLink>
      </div>
    </div>
  </article>
</template>

