<script setup lang="ts">
import ThemeToggle from "~/components/common/ThemeToggle.vue";
</script>

<template>
  <header class="bg-white shadow-sm dark:bg-stone-900 dark:border-b dark:border-stone-700">
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
              <NuxtLink to="/categories" class="text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400">
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
