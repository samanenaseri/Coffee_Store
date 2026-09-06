<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
  <AppNotifications />
</template>

<script setup lang="ts">
const { settings, fetchSettings } = useSettings()
const { resolveUrl } = useImageUrl()
const route = useRoute()

// Load settings early so favicon / brand assets apply globally
await fetchSettings()

const {
  absoluteUrl,
  defaultMetaDescription,
  defaultMetaTitle,
  defaultOgImage,
  siteName,
} = useSiteSeo()

useSeoMeta({
  title: () => defaultMetaTitle.value,
  description: () => defaultMetaDescription.value,
  ogTitle: () => defaultMetaTitle.value,
  ogDescription: () => defaultMetaDescription.value,
  ogType: 'website',
  ogSiteName: () => siteName.value,
  ogUrl: () => absoluteUrl(route.path),
  ogImage: () => defaultOgImage.value,
  ogImageAlt: () => `${siteName.value} - فروشگاه تخصصی قهوه`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => defaultMetaTitle.value,
  twitterDescription: () => defaultMetaDescription.value,
  twitterImage: () => defaultOgImage.value,
})

const faviconHref = computed(() => {
  const raw = settings.value.site_favicon?.trim()
  if (!raw) return '/favicon.ico'
  return resolveUrl(raw)
})

const faviconType = computed(() => {
  const href = faviconHref.value.toLowerCase()
  if (href.includes('.svg')) return 'image/svg+xml'
  if (href.includes('.png')) return 'image/png'
  if (href.includes('.webp')) return 'image/webp'
  if (href.includes('.gif')) return 'image/gif'
  if (href.includes('.jpg') || href.includes('.jpeg')) return 'image/jpeg'
  return 'image/x-icon'
})

useHead({
    script: [
        {
            innerHTML: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`,
        },
    ],
    link: [
      () => ({
        key: 'canonical',
        rel: 'canonical',
        href: absoluteUrl(route.path),
      }),
      () => ({
        key: 'site-favicon',
        rel: 'icon',
        type: faviconType.value,
        href: faviconHref.value,
      }),
      () => ({
        key: 'site-favicon-shortcut',
        rel: 'shortcut icon',
        type: faviconType.value,
        href: faviconHref.value,
      }),
      () => ({
        key: 'site-apple-touch-icon',
        rel: 'apple-touch-icon',
        href: faviconHref.value,
      }),
    ],
})

const { token, isLoggedIn, fetchUser } = useAuth()
const favoriteStore = useFavoriteStore()
const addressStore = useAddressStore()

onMounted(async () => {
  if (token.value && !isLoggedIn.value) {
    await fetchUser()
  }

  if (isLoggedIn.value) {
    favoriteStore.fetchFavorites()
    addressStore.fetchAddresses()
  }
})
</script>
