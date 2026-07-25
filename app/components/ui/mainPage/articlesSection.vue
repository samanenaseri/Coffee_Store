<template>
  <section class="py-24">
    <div class="container mx-auto px-4">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold text-text ">
          {{ heading }}
        </h2>
        <p class="mt-3 text-sm text-lightText ">
          {{ subtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
        <!-- ۴ مقاله کوچک سمت چپ (۲x۲) -->
        <div class="lg:col-span-8 grid grid-cols-2 grid-rows-2 gap-6">
          <NuxtLink
              v-for="article in articles.slice(1,5)"
              :key="article.id"
              :to="`/articles/${article.slug}`"
              class="group flex rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <img
                :src="article.image"
                :alt="article.imageAlt"
                class="w-full object-cover"
            />
            <div class="p-4 bg-transparent">
              <h4 class="font-bold text-text dark:text-white">{{ article.title }}</h4>
              <p class="text-sm mt-1 text-lightText  line-clamp-3">{{ article.description }}</p>
            </div>
          </NuxtLink>
        </div>

        <!-- مقاله بزرگ سمت راست -->
        <NuxtLink
            v-if="articles.length"
            :to="`/articles/${articles[0]?.slug}`"
            class="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <img
              :src="articles[0]?.image"
              :alt="articles[0]?.imageAlt"
              class="w-full h-[680px] object-cover"
          />
          <div class="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
            <h3 class="text-3xl font-bold text-white">{{ articles[0]?.title }}</h3>
            <p class="text-white mt-2 line-clamp-4">{{ articles[0]?.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  heading: { type: String, default: 'مقالات' },
  subtitle: { type: String, default: 'جدیدترین مقالات و نکات درباره قهوه' },
  limit: { type: Number, default: 5 },
})

const { articles, pending, error } = useArticles()
</script>
