

<template>
  <header :class="[
    'fixed top-0 left-0 w-full z-50 transition-all duration-300 ',
    isScrolled
    ? 'bg-bg shadow-sm text-text '
    : 'bg-transparent '
    ]">

    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between h-16" aria-label="main navigation">
        <NuxtLink to="/" class="text-xl font-bold text-amber-800 dark:text-amber-400">
          <Logo :class="['h-24 w-auto text-lightText mt-3 mb-3',
                isScrolled ? 'text-lightText': 'text-stone-300 dark:text-text'] " />
        </NuxtLink>
        <div class="flex items-center gap-6">
          <ul :class="['flex items-center gap-6 text-text',
            isScrolled ? 'text-lightText' : 'text-white'] ">
            <li>
              <NuxtLink to="/" class=" hover:text-background">
                خانه
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/products" class=" hover:text-background">
                محصولات
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/gallery" class="hover:text-background ">
                دسته‌بندی
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="hover:text-background ">
                درباره ما
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="hover:text-background ">
                تماس
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cart" class=" hover:text-background">
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
import Logo from '~/assets/icons/logo.svg'
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