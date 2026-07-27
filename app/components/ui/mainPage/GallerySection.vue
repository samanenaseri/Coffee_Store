<template>
  <section class="py-20 bg-background">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-cups">{{ heading }}</h2>
        <p class="text-lightText mt-2">{{ subtitle }}</p>
      </div>

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="i in displayLimit"
          :key="i"
          class="aspect-square bg-gray-200 dark:bg-stone-700 rounded-xl animate-pulse"
        />
      </div>

      <div
        v-else-if="displayItems.length === 0"
        class="text-center text-lightText py-10"
      >
        هنوز تصویری در گالری ثبت نشده است.
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="item in displayItems"
          :key="item.id"
          :to="`/gallery/${item.slug}`"
          class="group relative aspect-square overflow-hidden rounded-xl cursor-pointer block"
        >
          <img
            :src="imageSrc(item)"
            :alt="item.imageAlt || item.image_alt || item.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <span class="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold px-2 text-center">
              {{ item.title }}
            </span>
          </div>
        </NuxtLink>
      </div>

      <div class="text-center mt-8">
        <NuxtLink
          to="/gallery"
          class="inline-block px-6 py-3 bg-cups text-white rounded-lg hover:opacity-90 transition"
        >
          مشاهده همه
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { resolveUrl } = useImageUrl()
const { apiFetch } = useApi()

const props = defineProps({
  heading: { type: String, default: 'گالری عکس' },
  subtitle: { type: String, default: 'تصاویر فروشگاه و محصولات ما' },
  limit: { type: Number, default: 6 },
})

const displayLimit = computed(() => props.limit || 6)
const items = ref<any[]>([])
const loading = ref(true)

const displayItems = computed(() => items.value.slice(0, displayLimit.value))

function imageSrc(item: any): string {
  const raw = item.image || ''
  return resolveUrl(raw) || raw
}

onMounted(async () => {
  try {
    const res = await apiFetch<any>('/gallery')
    const list = Array.isArray(res) ? res : (res.data || [])
    items.value = Array.isArray(list) ? list : []
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
})
</script>
