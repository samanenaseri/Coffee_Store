<script setup lang="ts">
import ProductCard from '~/components/products/ProductCard.vue'

const route = useRoute()
const categorySlug = route.params.slug as string
const { apiFetch } = useApi()
const { fetchSettings } = useSettings()

await fetchSettings()

const { data, pending, error } = useAsyncData(
  `category-${categorySlug}`,
  () => apiFetch<any>(`/categories/${categorySlug}`),
)

const category = computed(() => data.value?.data ?? data.value ?? null)
const products = computed(() => category.value?.products ?? [])
const { defaultMetaTitle, siteName, resolveSeoImage } = useSiteSeo()

useSeoMeta({
  title: () => category.value?.metaTitle || category.value?.meta_title || `${category.value?.title || categorySlug} | ${defaultMetaTitle.value}`,
  description: () => category.value?.metaDescription || category.value?.meta_description || category.value?.description || `مشاهده محصولات دسته ${categorySlug} در ${siteName.value}`,
  ogTitle: () => category.value?.ogTitle || category.value?.og_title || category.value?.title || categorySlug,
  ogDescription: () => category.value?.ogDescription || category.value?.og_description || category.value?.description || '',
  ogImage: () => resolveSeoImage(category.value?.ogImage || category.value?.og_image || category.value?.image),
})
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-20">
      <div v-if="pending" class="animate-pulse space-y-4">
        <div class="h-10 w-1/3 rounded bg-stone-200 dark:bg-stone-800" />
        <div class="h-5 w-2/3 rounded bg-stone-200 dark:bg-stone-800" />
      </div>

      <div v-else-if="error || !category" class="text-center text-red-500">
        دسته‌بندی مورد نظر یافت نشد.
      </div>

      <template v-else>
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-text">{{ category.title }}</h1>
            <p v-if="category.description" class="mt-3 max-w-2xl leading-8 text-lightText">
              {{ category.description }}
            </p>
          </div>
          <span v-if="category.icon" class="text-4xl" aria-hidden="true">{{ category.icon }}</span>
        </div>

        <div v-if="products.length" class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>

        <p v-else class="mt-10 text-center text-lightText">
          محصولی در این دسته‌بندی ثبت نشده است.
        </p>
      </template>
    </div>
  </section>
</template>
