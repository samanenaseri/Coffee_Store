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
          <img
            v-if="logoSrc"
            :src="logoSrc"
            :alt="settings.store_name"
            class="h-8 w-auto mt-3 mb-3"
          />
          <Logo v-else :class="['h-8 w-auto dark:text-lightText text-testimonial mt-3 mb-3']" />
        </NuxtLink>
        <div class="flex items-center gap-6">
          <ul :class="[
              'flex flex-col lg:flex-row items-center gap-6',
            isHome
             ? (isScrolled ? 'text-lightText' : 'text-white')
               : 'text-lightText'
            ] ">
            <li v-for="link in settings.header_links" :key="link.url">
              <NuxtLink :to="link.url" class="hover:text-lightText">
                {{ link.label }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cart" class="hover:text-lightText ">
              <CartDropdown class="hover:text-lightText"/>
              </NuxtLink>
            </li>
            <li v-if="isLoggedIn">
              <NuxtLink to="/profile" class="hover:text-lightText flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span class="text-sm hidden lg:inline">پروفایل</span>
              </NuxtLink>
            </li>
            <li v-else>
              <NuxtLink
                :to="loginUrl"
                class="bg-amber-600/90 hover:bg-amber-500 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-amber-600/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                <span class="hidden lg:inline">ورود</span>
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
import CartDropdown from "~/components/ui/CartDropdown.vue";
const route = useRoute()
const { isLoggedIn } = useAuth()
const { settings, fetchSettings } = useSettings()
const { resolveUrl } = useImageUrl()
const { loginUrl } = useAuthRedirect()

const isHome = computed(() => route.path === "/")
const isScrolled = ref(false)
const heroHeight = ref(0)
const isDark = ref(false)

const handleScroll = () => {
  if (!isHome.value) return
  isScrolled.value = window.scrollY >= heroHeight.value - window.innerHeight
}

const checkDark = () => {
  isDark.value = document.documentElement.classList.contains('dark')
}

const logoSrc = computed(() => {
  const main = settings.value.store_logo?.trim() || ''
  const alternate = settings.value.store_dark_logo?.trim() || ''
  const innerLogo = settings.value.store_inner_logo?.trim() || ''
  const innerDarkLogo = settings.value.store_inner_dark_logo?.trim() || ''

  if (isHome.value) {
    if (isScrolled.value) {
      const src = alternate || main
      return src ? resolveUrl(src) : ''
    }
    const src = main || alternate
    return src ? resolveUrl(src) : ''
  }

  if (isDark.value) {
    const src = innerLogo || main
    return src ? resolveUrl(src) : ''
  }
  const src = innerDarkLogo || main
  return src ? resolveUrl(src) : ''
})

onMounted(() => {
  fetchSettings()
  checkDark()
  const heroEl = document.querySelector('[data-hero]') as HTMLElement | null
  if (heroEl) {
    heroHeight.value = heroEl.offsetHeight
  }
  handleScroll()
  window.addEventListener('scroll', handleScroll)

  const observer = new MutationObserver(() => checkDark())
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  onUnmounted(() => observer.disconnect())
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>