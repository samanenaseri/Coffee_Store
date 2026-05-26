<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.slug as string

useSeoMeta({
  title: `${categorySlug} | قهوه‌فروشی`,
  description: `مشاهده محصولات دسته ${categorySlug}`,
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