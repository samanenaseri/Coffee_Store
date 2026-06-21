<template>
  <header :class="[
    'fixed top-0 left-0 w-full z-50 transition-all duration-300 py-2',
     isScrolled
      ? 'bg-background/80 backdrop-blur-md shadow-sm'
      : isHome
        ? 'bg-transparent'
        : 'bg-background'

    ]">

    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between h-16" aria-label="main navigation">
        <NuxtLink to="/" class="text-xl font-bold text-amber-800 dark:text-amber-400">
          <Logo :class="['h-24 w-auto dark:text-lightText text-testimonial mt-3 mb-3',
          ]"
          />
        </NuxtLink>
        <div class="flex items-center gap-6">
          <ul :class="[
              'flex flex-col lg:flex-row items-center gap-6',
            isHome
             ? (isScrolled ? 'text-lightText' : 'text-white')
               : 'text-lightText'
            ] ">
            <li>
              <NuxtLink to="/" class=" hover:text-lightText">
                خانه
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/products" class=" hover:text-lightText">
                محصولات
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/articles" class="hover:text-lightText ">
                مقالات
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="hover:text-lightText ">
                درباره ما
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="hover:text-lightText ">
                تماس
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cart" class="hover:text-lightText ">
              <CartDropdown />
              </NuxtLink>
            </li>
          </ul>
          <ThemeToggle/>
        </div>
      </nav>
    </div>
  </header>
</template>
<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import ThemeToggle from "~/components/common/ThemeToggle.vue";
import Logo from '~/assets/icons/logo.svg'
import { RiShoppingCartLine } from "@remixicon/vue"
import CartDropdown from "~/components/ui/CartDropdown.vue";
const route = useRoute()

const isHome = computed(() => route.path === "/")
const isScrolled = ref(false)
const cartStore = useCartStore()
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