<script setup lang="ts">
const { fetchSettings } = useSettings()
await fetchSettings()
const { siteName } = useSiteSeo()
const { apiFetch } = useApi()

const { data, pending, error } = useAsyncData(
  'categories',
  () => apiFetch<any[]>('/categories'),
)

const categories = computed(() => {
  const value = data.value
  if (Array.isArray(value)) return value
  return Array.isArray(value?.data) ? value.data : []
})

useSeoMeta({
  title: () => `دسته‌بندی محصولات | ${siteName.value}`,
  description: () => `مشاهده و خرید محصولات ${siteName.value} بر اساس دسته‌بندی`,
  ogTitle: () => `دسته‌بندی محصولات | ${siteName.value}`,
  ogDescription: () => `مشاهده و خرید محصولات ${siteName.value} بر اساس دسته‌بندی`,
})
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-20">
      <h1 class="text-3xl font-bold text-text">دسته‌بندی محصولات</h1>
      <p class="mt-2 text-lightText">محصولات را بر اساس دسته‌بندی مرور کنید</p>

      <div v-if="pending" class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="item in 6" :key="item" class="h-40 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
      </div>

      <p v-else-if="error" class="mt-8 text-center text-red-500">
        دریافت دسته‌بندی‌ها با خطا مواجه شد.
      </p>

      <div v-else-if="categories.length" class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="category in categories"
          :key="category.id || category.slug"
          :to="`/categories/${category.slug}`"
          class="rounded-2xl border border-input bg-menu p-6 transition hover:-translate-y-1 hover:border-amber-700 hover:shadow-lg"
        >
          <div class="flex items-start justify-between gap-4">
            <h2 class="text-xl font-bold text-text">{{ category.title }}</h2>
            <span v-if="category.icon" class="text-3xl" aria-hidden="true">{{ category.icon }}</span>
          </div>
          <p v-if="category.description" class="mt-3 text-sm leading-7 text-lightText">
            {{ category.description }}
          </p>
          <span class="mt-5 inline-block text-sm font-medium text-amber-700 dark:text-amber-400">
            مشاهده محصولات
          </span>
        </NuxtLink>
      </div>

      <p v-else class="mt-8 text-center text-lightText">
        هنوز دسته‌بندی‌ای ثبت نشده است.
      </p>
    </div>
  </section>
</template>
