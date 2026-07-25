<script setup lang="ts">
import StaffSection from "~/components/ui/StaffSection.vue";

const { settings, fetchSettings } = useSettings()
const { resolveUrl } = useImageUrl()

// Always refresh so admin updates show up immediately
await fetchSettings({ force: true })

const mainImage = computed(() => {
  const url = resolveUrl(settings.value.about_main_image)
  return url || '/images/about/about-main.jpg'
})

const secondImage = computed(() => {
  const url = resolveUrl(settings.value.about_second_image)
  return url || '/images/about/about-second.jpg'
})

useSeoMeta({
  title: () => `${settings.value.about_title || 'درباره ما'} | قهوه‌فروشی`,
  description: () => settings.value.about_description?.substring(0, 160) || '',
})

useHead({
  link: [
    { rel: 'canonical', href: `${settings.value.site_url || 'https://coffee-store.example.com'}/about` },
  ],
})
</script>

<template>
  <section>
    <div class="container flex flex-col md:flex-row gap-10 justify-around mx-auto px-4 py-24">
      <div class="relative w-full max-w-[400px] mx-auto md:mx-0 h-[400px] shrink-0">
        <div class="w-full h-[420px] md:h-[520px] rounded-lg overflow-hidden bg-stone-200 shadow-md">
          <img
            :src="mainImage"
            class="w-full h-full object-cover"
            :alt="settings.about_title || 'درباره ما'"
            loading="eager"
          />
        </div>
        <div
          class="absolute -bottom-6 left-4 md:-bottom-10 md:left-0 md:-translate-x-1/2
                 w-36 h-48 md:w-40 md:h-56 overflow-hidden
                 border-[8px] md:border-[10px] border-bg bg-stone-100 shadow-lg rounded-sm"
        >
          <img
            :src="secondImage"
            class="w-full h-full object-cover"
            :alt="settings.about_title || 'درباره ما'"
            loading="lazy"
          />
        </div>
      </div>

      <div class="flex-1 pt-10 md:pt-16">
        <h1 class="text-3xl font-bold text-text">
          {{ settings.about_title || 'درباره ما' }}
        </h1>
        <p class="text-lightText mt-4 leading-relaxed max-w-2xl whitespace-pre-line">
          {{ settings.about_description }}
        </p>
      </div>
    </div>

    <StaffSection
      :heading="settings.about_staff_heading || 'تیم ما'"
      :subheading="settings.about_staff_description || ''"
    />
  </section>
</template>
