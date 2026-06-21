<script setup lang="ts">
import type {Article} from "#shared/article";

const route = useRoute()
const slug = route.params.slug as string

const { data, pending, error } = useAsyncData(
    `article-${slug}`,
    () => $fetch(`/api/articles/${slug}`),
)

const article= computed(() => (data.value as { data: Article } | null)?.data ?? null)

useSeoMeta({
  title: () => article.value
      ? `${article.value.title} | قهوه‌فروشی`
      : "مقاله | قهوه‌فروشی",

  description: () => article.value?.description ?? "مشاهده جزئیات مقالات",

  ogTitle: () => article.value?.title ?? "مقاله | قهوه‌فروشی",

  ogDescription: () => article.value?.description ?? "مشاهده جزئیات مقالات",

  ogImage: () => article.value?.image ?? "",
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
              :src="article.image"
              :alt="article.imageAlt"
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