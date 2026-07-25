<script setup lang="ts">
import ProfileSidebar from "~/components/profile/ProfileSidebar.vue";

useSeoMeta({
  robots: "noindex, nofollow",
})
</script>
<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <AppHeader />
  <main class="min-h-screen bg-background pb-20 pt-28">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <!-- منوی پروفایل -->
        <aside class="lg:sticky lg:top-28 lg:col-span-3">
          <ProfileSidebar />
        </aside>

        <!-- محتوای هر صفحه پروفایل -->
        <section
            class="min-w-0 rounded-2xl bg-menu p-5 shadow-sm lg:col-span-9 lg:p-8"
        >
          <slot />
        </section>
      </div>
    </div>
  </main>
    <AppFooter />
  </div>
</template>