<script setup lang="ts">
useSeoMeta({
  ogImage: "/og-image.jpg",
  twitterImage: "/og-image.jpg",
})

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Store",
        name: "قهوه‌فروشی | Coffee Store",
        url: "https://coffee-store.example.com",
        description: "فروشگاه تخصصی قهوه با انواع قهوه‌های اسپرسو، لاته، کاپوچینو",
        telephone: "+98-21-12345678",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IR",
        },
        sameAs: [
          "https://instagram.com/coffeeshop",
          "https://t.me/coffeeshop",
        ],
      }),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-200">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
