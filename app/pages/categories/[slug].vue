<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.slug as string
const { apiFetch } = useApi()
const { settings, fetchSettings } = useSettings()

await fetchSettings()

const { data: category } = useAsyncData(
  `category-${categorySlug}`,
  () => apiFetch<any>(`/categories/${categorySlug}`),
)

const siteUrl = computed(() => settings.value.site_url || 'https://coffee-store.example.com')

useSeoMeta({
  title: () => category.value?.meta_title || `${category.value?.title || categorySlug} | ${settings.value.default_meta_title}`,
  description: () => category.value?.meta_description || category.value?.description || `مشاهده محصولات دسته ${categorySlug}`,
  ogTitle: () => category.value?.og_title || category.value?.title || categorySlug,
  ogDescription: () => category.value?.og_description || category.value?.description || '',
  ogImage: () => category.value?.og_image || category.value?.image || settings.value.default_og_image,
})

useHead({
  link: [
    { rel: 'canonical', href: `${siteUrl.value}/categories/${categorySlug}` },
  ],
})
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-stone-800">{{ categorySlug }}</h1>
      <p class="text-stone-500 mt-2">محصولات این دسته</p>
    </div>
  </section>
</template>