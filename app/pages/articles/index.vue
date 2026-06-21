<script setup lang="ts">

import articleCard from "~/components/articles/articleCard.vue";

const { articles, pending, error } = useArticles()
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-20">
      <h1 class="text-3xl text-center font-bold text-text">مقالات</h1>

           <div v-if="pending" class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="animate-pulse bg-stone-200 rounded-lg h-64" />
      </div>

      <div v-else class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-10">
        <articleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
        >
        </articleCard>
      </div>
    </div>
  </section>
</template>