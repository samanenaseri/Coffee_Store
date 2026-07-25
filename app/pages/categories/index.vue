<script setup lang="ts">
const { settings, fetchSettings } = useSettings()
await fetchSettings()

useSeoMeta({
  title: "دسته‌بندی محصولات | قهوه‌فروشی",
  description: "مشاهده محصولات بر اساس دسته‌بندی",
})

useHead({
  link: [
    { rel: 'canonical', href: `${settings.value.site_url || 'https://coffee-store.example.com'}/categories` },
  ],
})
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-stone-800">دسته‌بندی محصولات</h1>
      <p class="text-stone-500 mt-2">محصولات را بر اساس دسته‌بندی مرور کنید</p>
    </div>
  </section>
</template>