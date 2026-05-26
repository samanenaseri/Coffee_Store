<script setup lang="ts">
const { products, pending, error } = useProducts()
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-stone-800">محصولات</h1>
      <p class="text-stone-500 mt-2">همه محصولات ما</p>

      <div v-if="pending" class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="animate-pulse bg-stone-200 rounded-lg h-64" />
      </div>

      <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <img
            :src="product.image"
            :alt="product.imageAlt"
            class="w-full h-48 object-cover"
            loading="lazy"
          />
          <div class="p-4">
            <h2 class="font-semibold text-stone-800">
              <NuxtLink :to="`/products/${product.slug}`">
                {{ product.title }}
              </NuxtLink>
            </h2>
            <p class="text-stone-500 text-sm mt-1">{{ product.description }}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-amber-700 font-bold">{{ product.price.toLocaleString("fa-IR") }} تومان</span>
              <span class="text-yellow-500 text-sm">★ {{ product.rating }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>