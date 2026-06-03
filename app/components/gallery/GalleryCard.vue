<script setup lang="ts">
defineProps<{
  gallery: any
}>()
</script>
<template>
  <article class="bg-bg rounded-lg  overflow-hidden sm:rounded-md p-5 card-des">
    <div class="rounded-lg">
      <img
          :src="gallery.image"
          :alt="gallery.imageAlt"
          class="rounded-md w-full h-48 object-cover"
          loading="lazy"
      />
    </div>

    <div class="p-4 ">
      <h2 class=" font-semibold text-text text-center">
        <NuxtLink :to="`/gallery/${gallery.slug}`">
          {{ gallery.title }}
        </NuxtLink>
      </h2>
      <p class="text-stone-500 text-sm mt-1">{{gallery.description}}</p>
      <div class="flex items-center justify-between mt-3">
      </div>
    </div>

  </article>
</template>