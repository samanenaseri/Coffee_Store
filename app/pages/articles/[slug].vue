<script setup lang="ts">
import type {Article} from "#shared/article";

const route = useRoute()
const slug = route.params.slug as string
const { apiFetch } = useApi()
const { settings, fetchSettings } = useSettings()

await fetchSettings()

const { data, pending, error } = useAsyncData(
    `article-${slug}`,
    () => apiFetch<Article>(`/articles/${slug}`),
)

const article = computed(() => data.value ?? null)

const siteUrl = computed(() => settings.value.site_url || 'https://coffee-store.example.com')

useSeoMeta({
  title: () => article.value?.meta_title || (article.value
      ? `${article.value.title} | ${settings.value.default_meta_title}`
      : `مقاله | ${settings.value.default_meta_title}`),

  description: () => article.value?.meta_description || article.value?.description || settings.value.default_meta_description,

  ogTitle: () => article.value?.og_title || article.value?.title || '',

  ogDescription: () => article.value?.og_description || article.value?.description || '',

  ogImage: () => article.value?.og_image || article.value?.image || settings.value.default_og_image,
})

useHead({
  link: [
    { rel: 'canonical', href: `${siteUrl.value}/articles/${slug}` },
  ],
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
        مقاله ی مورد نظر یافت نشد
      </div>

      <article v-else-if="article" class="mt-8 grid grid-cols-1 md:grid-cols-1 gap-8">
        <div>
          <img
              :src="article.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop'"
              :alt="article.image_alt || article.imageAlt"
              class="w-full rounded-lg shadow-md"
          />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-text">{{ article.title }}</h1>
          <p class="text-lightText mt-2">{{ article.description }}</p>
          <div class="flex flex-col gap-4 mt-4">
            <p class="text-xl items-center font-medium text-text">
              {{ article.content}}
            </p>
            <p class="text-lightText text-sm mt-2">تهیه شده توسط: {{ article.author }}</p>
          </div>

        </div>
      </article>
    </div>
  </section>
</template>