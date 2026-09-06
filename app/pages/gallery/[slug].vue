<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { apiFetch } = useApi()
const { resolveUrl } = useImageUrl()
const { fetchSettings } = useSettings()
const {
  defaultMetaDescription,
  defaultMetaTitle,
  resolveSeoImage,
} = useSiteSeo()

await fetchSettings()

const { data: galleryResponse, pending, error } = useAsyncData(
    `gallery-${slug}`,
    () => apiFetch<any>(`/gallery/${slug}`),
)

const item = computed(() => galleryResponse.value?.data ?? galleryResponse.value ?? null)
const itemImage = computed(() => {
  const image = item.value?.image || item.value?.imageUrl
  return resolveUrl(image) || '/images/great-coffee-bean.jpeg'
})

useSeoMeta({
  title: () => item.value?.metaTitle || item.value?.meta_title || (item.value
      ? `${item.value.title} | ${defaultMetaTitle.value}`
      : `گالری | ${defaultMetaTitle.value}`),

  description: () => item.value?.metaDescription || item.value?.meta_description || item.value?.description || defaultMetaDescription.value,

  ogTitle: () => item.value?.ogTitle || item.value?.og_title || item.value?.title || '',

  ogDescription: () => item.value?.ogDescription || item.value?.og_description || item.value?.description || '',

  ogImage: () => resolveSeoImage(item.value?.ogImage || item.value?.og_image || item.value?.image),
})
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-20">

      <div v-if="pending" class="mt-8 animate-pulse space-y-4">
        <div class="bg-text rounded-lg h-96 w-full" />
        <div class="bg-text rounded h-8 w-1/3" />
        <div class="bg-text rounded h-4 w-2/3" />
      </div>

      <div v-else-if="error" class="mt-8 text-center text-red-500">
        تصویر مورد نظر یافت نشد
      </div>

      <article v-else-if="item" class="mt-8 space-y-8">
        <div>
          <img
              :src="itemImage"
              :alt="item.image_alt || item.imageAlt || item.title"
              class="w-full rounded-lg shadow-md object-cover max-h-[600px]"
          />
        </div>

        <div>
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-bold text-text">
              {{ item.title }}
            </h1>

            <span
                v-if="item.category"
                class="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
            >
              {{ item.category }}
            </span>
          </div>

          <p
              v-if="item.description"
              class="mt-4 text-lg leading-8 text-lightText"
          >
            {{ item.description }}
          </p>
        </div>

        <div>
          <NuxtLink
              to="/gallery"
              class="inline-flex items-center gap-2 text-sm font-medium text-amber-700 transition hover:text-amber-800"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
              <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
              />
            </svg>
            بازگشت به گالری
          </NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>
