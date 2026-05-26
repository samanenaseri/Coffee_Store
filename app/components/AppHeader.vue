<script setup lang="ts">
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between h-16" aria-label="main navigation">
        <NuxtLink to="/" class="text-xl font-bold text-amber-800">
          ☕ قهوه‌فروشی
        </NuxtLink>
        <ul class="flex items-center gap-6">
          <li>
            <NuxtLink to="/" class="text-stone-600 hover:text-amber-700">خانه</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/products" class="text-stone-600 hover:text-amber-700">محصولات</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/categories" class="text-stone-600 hover:text-amber-700">دسته‌بندی</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="text-stone-600 hover:text-amber-700">درباره ما</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" class="text-stone-600 hover:text-amber-700">تماس</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/cart" class="text-stone-600 hover:text-amber-700">
              سبد خرید
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>