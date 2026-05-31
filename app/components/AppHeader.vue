

<template>
  <header :class="[
    'fixed top-0 left-0 w-full z-50 transition-all duration-300 ',
    isScrolled
    ? 'bg-bg  shadow-sm '
    : 'bg-transparent'
    ]">

    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between h-16" aria-label="main navigation">
        <NuxtLink to="/" class="text-xl font-bold text-amber-800 dark:text-amber-400">
          ☕ قهوه‌فروشی
        </NuxtLink>
        <div class="flex items-center gap-6">
          <ul class="flex items-center gap-6">
            <li>
              <NuxtLink to="/" class="text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400">
                خانه
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/products" class="text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400">
                محصولات
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/gallery" class="text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400">
                دسته‌بندی
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400">
                درباره ما
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400">
                تماس
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cart" class="text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400">
                سبد خرید
              </NuxtLink>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeToggle from "~/components/common/ThemeToggle.vue";

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 500
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>