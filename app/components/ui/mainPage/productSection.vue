<script setup lang="ts">
import ProductCard from "~/components/products/ProductCard.vue";

const props = defineProps({
  heading: { type: String, default: 'محصولات' },
  subtitle: { type: String, default: '' },
  limit: { type: Number, default: 4 },
})

const { products, pending, error } = useProducts()

const homeProducts = computed(() => {
  return products.value.slice(0, props.limit)
})
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-8 text-center mt-10">
      <h2 class="text-3xl font-bold text-text">{{ heading }}</h2>
      <p v-if="subtitle" class="text-lightText mt-2">{{ subtitle }}</p>
      <div v-if="pending" class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="animate-pulse bg-stone-200 rounded-lg h-64" />
      </div>

      <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <ProductCard
              v-for="product in homeProducts"
              :key="product.id"
              :product="product"
          >
          </ProductCard>
              </div>
    </div>
  </section>
</template>
