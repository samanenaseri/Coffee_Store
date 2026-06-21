<script setup lang="ts">
import ProductCard from "~/components/products/ProductCard.vue";

const { products, pending, error } = useProducts()
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-20">
      <h1 class="text-3xl text-center font-bold text-text">محصولات</h1>

      <div v-if="pending" class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="animate-pulse bg-stone-200 rounded-lg h-64" />
      </div>

      <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-10">
        <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
        >
        </ProductCard>
      </div>
    </div>
  </section>
</template>