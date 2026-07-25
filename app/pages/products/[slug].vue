<script setup lang="ts">
import type { Product, WeightPackage } from "#shared/product"
import { formatWeightLabel, getProductWeightPackages } from "#shared/product"
import ProductComments from "~/components/products/ProductComments.vue"

const route = useRoute()
const slug = route.params.slug as string
const { apiFetch } = useApi()
const { resolveUrl } = useImageUrl()
const { settings, fetchSettings } = useSettings()
const cartStore = useCartStore()
const notification = useNotification()

await fetchSettings()

const { data, pending, error } = useAsyncData(
  `product-${slug}`,
  () => apiFetch<Product>(`/products/${slug}`),
)

const product = computed(() => data.value ?? null)

const packages = computed(() => {
  if (!product.value) return [] as WeightPackage[]
  return getProductWeightPackages(product.value)
})

const hasPackages = computed(() => packages.value.length > 0)

const selectedPackageId = ref<string | null>(null)
const quantity = ref(1)
const isAdding = ref(false)

watch(
  packages,
  (list) => {
    if (list.length > 0 && !selectedPackageId.value) {
      selectedPackageId.value = list[0].id
    }
  },
  { immediate: true },
)

const selectedPackage = computed(() => {
  if (!hasPackages.value) return null
  return packages.value.find(p => p.id === selectedPackageId.value) ?? packages.value[0] ?? null
})

/** Display price in Toman (API stores Rial) */
const unitTomanPrice = computed(() => {
  if (!product.value) return 0
  const rial = selectedPackage.value?.price ?? product.value.price
  return Math.round(rial / 10)
})

const totalTomanPrice = computed(() => unitTomanPrice.value * quantity.value)

const weightLabel = computed(() => {
  if (selectedPackage.value) {
    return formatWeightLabel(selectedPackage.value.weight, selectedPackage.value.unit)
  }
  if (!product.value?.weight) return null
  const unit = product.value.weight_unit || product.value.weightUnit || 'g'
  return formatWeightLabel(product.value.weight, unit)
})

const productImage = computed(() => {
  if (!product.value?.image) {
    return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop'
  }
  return resolveUrl(product.value.image)
})

const inStock = computed(() => (product.value?.inventory ?? 0) > 0)

function selectPackage(pkg: WeightPackage) {
  selectedPackageId.value = pkg.id
}

function addToCart() {
  if (!product.value || !inStock.value) return

  isAdding.value = true

  cartStore.addToCartWithQuantity(
    product.value,
    quantity.value,
    selectedPackage.value,
  )

  const weightPart = weightLabel.value ? ` (${weightLabel.value})` : ''
  notification.success(
    'افزوده شد',
    `${product.value.title}${weightPart} × ${quantity.value} به سبد خرید اضافه شد`,
  )

  setTimeout(() => {
    isAdding.value = false
  }, 800)
}

const siteUrl = computed(() => settings.value.site_url || 'https://coffee-store.example.com')

useSeoMeta({
  title: () => product.value?.meta_title || (product.value
      ? `${product.value.title} | ${settings.value.default_meta_title}`
      : `محصول | ${settings.value.default_meta_title}`),

  description: () => product.value?.meta_description || product.value?.description || settings.value.default_meta_description,

  ogTitle: () => product.value?.og_title || product.value?.title || '',

  ogDescription: () => product.value?.og_description || product.value?.description || '',

  ogImage: () => product.value?.og_image || product.value?.image || settings.value.default_og_image,
})

useHead({
  link: [
    { rel: 'canonical', href: `${siteUrl.value}/products/${slug}` },
  ],
})
</script>

<template>
  <section>
    <div class="container mx-auto px-4 py-20">
      <div v-if="pending" class="mt-8 animate-pulse space-y-4">
        <div class="bg-text/10 rounded-lg h-96 w-full" />
        <div class="bg-text/10 rounded h-8 w-1/3" />
        <div class="bg-text/10 rounded h-4 w-2/3" />
      </div>

      <div v-else-if="error" class="mt-8 text-center text-red-500">
        محصول مورد نظر یافت نشد
      </div>

      <article v-else-if="product" class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div class="overflow-hidden rounded-2xl shadow-md bg-menu">
          <img
            :src="productImage"
            :alt="product.image_alt || product.imageAlt || product.title"
            class="w-full h-full min-h-[280px] object-cover"
          />
        </div>

        <div class="flex flex-col">
          <h1 class="text-3xl font-bold text-text">
            {{ product.title }}
          </h1>

          <p v-if="weightLabel && !hasPackages" class="text-lightText mt-1 text-sm">
            وزن بسته: {{ weightLabel }}
          </p>

          <p class="text-lightText mt-3 leading-7">
            {{ product.description }}
          </p>

          <div class="mt-4 flex gap-1 text-amber-500">
            <span
              v-for="star in 5"
              :key="star"
              class="text-lg"
              :class="star <= Math.round(product.rating || 0) ? 'opacity-100' : 'opacity-25'"
            >
              ★
            </span>
          </div>

          <!-- Weight package selector -->
          <div v-if="hasPackages" class="mt-6">
            <p class="text-sm font-medium text-text mb-2">
              انتخاب وزن بسته
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="pkg in packages"
                :key="pkg.id"
                type="button"
                class="px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                :class="selectedPackageId === pkg.id
                  ? 'border-amber-700 bg-amber-700 text-white shadow-sm'
                  : 'border-input bg-menu text-text hover:border-amber-700'"
                @click="selectPackage(pkg)"
              >
                {{ formatWeightLabel(pkg.weight, pkg.unit) }}
                <span class="opacity-80 mr-1">
                  — {{ Math.round(pkg.price / 10).toLocaleString('fa-IR') }} ت
                </span>
              </button>
            </div>
          </div>

          <div class="mt-5 flex items-baseline gap-3">
            <span class="text-2xl font-bold text-text">
              {{ unitTomanPrice.toLocaleString("fa-IR") }} تومان
            </span>
            <span v-if="weightLabel" class="text-sm text-lightText">
              / {{ weightLabel }}
            </span>
          </div>

          <p class="text-lightText mt-2 text-sm">
            موجودی:
            <span :class="inStock ? 'text-emerald-600' : 'text-red-500'">
              {{ inStock ? product.inventory.toLocaleString("fa-IR") : 'ناموجود' }}
            </span>
          </p>

          <!-- Add to cart -->
          <div v-if="inStock" class="mt-8 space-y-4">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center border border-input rounded-xl overflow-hidden bg-menu">
                <button
                  type="button"
                  class="px-4 py-3 text-text hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-lg font-bold"
                  aria-label="کاهش تعداد"
                  @click="quantity = Math.max(1, quantity - 1)"
                >
                  −
                </button>
                <span class="px-5 py-3 text-text font-medium min-w-[3rem] text-center tabular-nums">
                  {{ quantity }}
                </span>
                <button
                  type="button"
                  class="px-4 py-3 text-text hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-lg font-bold"
                  aria-label="افزایش تعداد"
                  @click="quantity = Math.min(product.inventory, quantity + 1)"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                class="flex-1 min-w-[180px] px-6 py-3.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                :disabled="isAdding"
                @click="addToCart"
              >
                <span v-if="isAdding" class="inline-block animate-pulse">در حال افزودن…</span>
                <template v-else>
                  <span aria-hidden="true">🛒</span>
                  افزودن به سبد خرید
                </template>
              </button>
            </div>

            <p class="text-sm text-lightText">
              جمع:
              <span class="font-bold text-text">
                {{ totalTomanPrice.toLocaleString("fa-IR") }} تومان
              </span>
            </p>
          </div>

          <div v-else class="mt-8">
            <span class="inline-flex px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium">
              این محصول در حال حاضر ناموجود است
            </span>
          </div>
        </div>
      </article>

      <!-- نظرات مشتریان — ثبت و نمایش کامنت -->
      <div v-if="product && !pending && !error" class="mt-4">
        <ProductComments :product-slug="product.slug || slug" />
      </div>
    </div>
  </section>
</template>
