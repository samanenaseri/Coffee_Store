<script setup lang="ts">
const { settings, fetchSettings } = useSettings()
await fetchSettings()

const {
  defaultMetaDescription,
  defaultOgImage,
  logoUrl,
  siteName,
  siteUrl,
  socialLinks,
} = useSiteSeo()

useHead({
  script: [
    {
      key: 'store-structured-data',
      type: "application/ld+json",
      innerHTML: () => {
        const schema: Record<string, unknown> = {
          "@context": "https://schema.org",
          "@type": "Store",
          "@id": `${siteUrl.value}/#store`,
          name: siteName.value,
          url: `${siteUrl.value}/`,
          description: defaultMetaDescription.value,
          image: defaultOgImage.value,
          address: {
            "@type": "PostalAddress",
            addressCountry: "IR",
          },
          sameAs: socialLinks.value,
        }

        const phone = settings.value.store_phone?.trim()
        const address = settings.value.store_address?.trim()
        if (phone) schema.telephone = phone
        if (address) {
          schema.address = {
            "@type": "PostalAddress",
            streetAddress: address,
            addressCountry: "IR",
          }
        }
        if (logoUrl.value) schema.logo = logoUrl.value

        return JSON.stringify(schema)
      },
    },
  ],
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
