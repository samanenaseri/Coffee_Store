<script setup lang="ts">
import DescribeSection from "~/components/ui/mainPage/DescribeSection.vue";
import GallerySection from "~/components/ui/mainPage/GallerySection.vue";
import OrderSection from "~/components/ui/mainPage/orderSection.vue";
import PicSection from "~/components/ui/mainPage/PicSection.vue";
import MenuSection from "~/components/ui/mainPage/MenuSection.vue";
import ProductSection from "~/components/ui/mainPage/productSection.vue";
import TestimonialSection from "~/components/ui/mainPage/testimonialSection.vue";
import ArticlesSection from "~/components/ui/mainPage/articlesSection.vue";

const { public: { apiBase } } = useRuntimeConfig()
const { resolveUrl } = useImageUrl()

interface Section {
  id: number
  type: string
  title: string
  subtitle: string | null
  description: string | null
  content: any
  image: string | null
  link: string | null
  link_text: string | null
  sort_order: number
  is_active: boolean
}

const { settings, fetchSettings } = useSettings()
await fetchSettings()
const {
  absoluteUrl,
  defaultMetaDescription,
  defaultMetaTitle,
  defaultOgImage,
} = useSiteSeo()

const sections = ref<Section[]>([])
const loading = ref(true)

async function fetchSections() {
  try {
    const res = await $fetch<Section[]>(`${apiBase}/homepage`)
    sections.value = res
  } catch {
    // silently fail - will show hardcoded fallback
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchSections())

// Check if a section type exists and is active
function hasSection(type: string): boolean {
  return sections.value.some(s => s.type === type && s.is_active)
}

// Get section data by type
function getSection(type: string): Section | undefined {
  return sections.value.find(s => s.type === type && s.is_active)
}

useSeoMeta({
  title: () => defaultMetaTitle.value,
  ogTitle: () => defaultMetaTitle.value,
  description: () => defaultMetaDescription.value,
  ogDescription: () => defaultMetaDescription.value,
  ogImage: () => defaultOgImage.value,
  ogUrl: () => absoluteUrl('/'),
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroVideo
      v-if="hasSection('hero')"
      :image-src="resolveUrl(getSection('hero')?.content?.imageSrc) || '/images/Coffee_Beans.webp'"
      :mobile-image-src="resolveUrl(getSection('hero')?.content?.mobileImageSrc)"
      :heading="getSection('hero')?.title"
      :subtitle="getSection('hero')?.subtitle"
      :slides="getSection('hero')?.content?.slides"
    />
    <HeroVideo v-else :image-src="'/images/Coffee_Beans.webp'" />

    <!-- About Section -->
    <DescribeSection
      v-if="hasSection('about')"
      :heading="getSection('about')?.title"
      :paragraph="getSection('about')?.description"
      :main-image="resolveUrl(getSection('about')?.image)"
      :secondary-image="resolveUrl(getSection('about')?.content?.secondaryImage)"
      :experience-number="getSection('about')?.content?.experienceNumber"
      :experience-label="getSection('about')?.content?.experienceLabel"
      :drinks="getSection('about')?.content?.drinks"
    />
    <DescribeSection v-else />

    <!-- Products Section -->
    <ProductSection
      v-if="hasSection('products')"
      :heading="getSection('products')?.title"
      :subtitle="getSection('products')?.subtitle"
      :limit="getSection('products')?.content?.limit"
    />
    <ProductSection v-else />

    <!-- Services Section -->
    <OrderSection
      v-if="hasSection('services')"
      :cards="getSection('services')?.content?.cards"
    />
    <OrderSection v-else />

    <!-- Menu Section -->
    <MenuSection
      v-if="hasSection('menu')"
      :heading="getSection('menu')?.title"
      :subtitle="getSection('menu')?.subtitle"
    />
    <MenuSection v-else />

    <!-- Testimonials Section -->
    <TestimonialSection
      v-if="hasSection('testimonials')"
      :heading="getSection('testimonials')?.title"
      :subtitle="getSection('testimonials')?.subtitle"
      :background-image="resolveUrl(getSection('testimonials')?.image)"
    />
    <TestimonialSection v-else />

    <!-- Gallery Section -->
    <GallerySection
      v-if="hasSection('gallery')"
      :heading="getSection('gallery')?.title"
      :subtitle="getSection('gallery')?.subtitle"
      :limit="getSection('gallery')?.content?.limit"
    />
    <GallerySection v-else />

    <!-- Banner Section -->
    <PicSection
      v-if="hasSection('banner')"
      :background-image="resolveUrl(getSection('banner')?.image)"
      :quote="getSection('banner')?.description"
      :link="getSection('banner')?.link"
      :link-text="getSection('banner')?.link_text"
    />
    <PicSection v-else />

    <!-- Articles Section -->
    <ArticlesSection
      v-if="hasSection('articles')"
      :heading="getSection('articles')?.title"
      :subtitle="getSection('articles')?.subtitle"
      :limit="getSection('articles')?.content?.limit"
    />
    <ArticlesSection v-else />
  </div>
</template>
