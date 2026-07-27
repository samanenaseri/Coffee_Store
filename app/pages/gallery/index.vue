<script setup lang="ts">
import {useGallery} from "~/composables/useGallery";
import GalleryCard from "~/components/gallery/GalleryCard.vue";

const { settings, fetchSettings } = useSettings()
await fetchSettings()

useSeoMeta({
  title: "گالری عکس | قهوه‌فروشی",
  description: "تصاویر محیط فروشگاه، نوشیدنی‌ها و فضای داخلی قهوه‌فروشی",
  ogTitle: "گالری عکس | قهوه‌فروشی",
  ogDescription: "گالری تصاویر فروشگاه قهوه‌فروشی",
})

useHead({
  link: [
    { rel: 'canonical', href: `${settings.value.site_url || 'https://coffee-store.example.com'}/gallery` },
  ],
})

const {gallery, pending, error} = useGallery()
</script>
<template>
  <section>
    <div class="container mx-auto px-4 py-10 ">
      <h1 class="text-3xl font-bold text-text text-center">گالری عکس</h1>

      <div v-if="pending" class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div v-for="n in 6" :key="n" class="animate-pulse bg-stone-200 rounded-lg h-64" />
      </div>

      <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <GalleryCard
            v-for="picture in gallery"
            :key="picture.id"
            :gallery="picture"
        >
        </GalleryCard>
      </div>
    </div>
  </section>
</template>
