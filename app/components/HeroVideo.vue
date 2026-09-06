<template>
  <section id="hero" data-hero class="relative w-full" :style="{ height: heroHeightStyle }">
    <div class="relative h-screen overflow-hidden">
      <!-- تصویر سبک و قابل اتکا برای بنر اصلی -->
      <img
          :src="heroImageSrc"
          :alt="activeSlides[activeSlide]?.heading || heading"
          class="absolute inset-0 h-full w-full object-cover"
          width="2000"
          height="1125"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          @error="handleImageError"
      />

      <div
          class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90"
      />

      <div
          class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <Transition :name="slideDirection" mode="out-in">
          <div :key="activeSlide" class="slide-content">
            <h1
                class="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-wider transition-all duration-700"
            >
              {{ activeSlides[activeSlide]?.heading }}
            </h1>

            <div class="mt-4 text-base sm:text-lg md:text-2xl text-stone-200 space-y-2">
              <p
                  v-for="(line, i) in activeSlides[activeSlide]?.lines"
                  :key="i"
                  class="transition-all duration-500"
                  :style="{ transitionDelay: `${i * 150}ms` }"
              >
                {{ line }}
              </p>
            </div>
          </div>
        </Transition>

        <!-- Slide indicators -->
        <div class="absolute bottom-20 flex gap-3">
          <button
              v-for="(_, i) in activeSlides"
              :key="i"
              type="button"
              :aria-label="`نمایش اسلاید ${i + 1}`"
              class="w-3 h-3 rounded-full transition-all duration-500"
              :class="activeSlide === i
                ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/40'
                : 'bg-white/30 hover:bg-white/50'"
              @click="goToSlide(i)"
          />
        </div>

        <div class="absolute bottom-0">
          <button
              type="button"
              class="flex items-center justify-center w-12 h-12 rounded-full bg-stone-400 text-text animate-bounce shadow-lg"
              aria-label="اسکرول به پایین"
              @click="scrollToContent"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  // Kept for CMS compatibility; the homepage intentionally uses an image banner.
  mediaType: { type: String, default: 'image' },
  imageSrc: { type: String, default: '/images/Coffee_Beans.webp' },
  mobileImageSrc: { type: String, default: '' },
  heading: { type: String, default: 'عطر قهوه' },
  subtitle: { type: String, default: 'هر فنجان، یک داستان' },
  slides: { type: Array, default: null },
})

const fallbackImage = '/images/Coffee_Beans.webp'

const defaultSlides = computed(() => [
  {
    heading: props.heading || 'عطر قهوه',
    lines: [props.subtitle || 'هر فنجان، یک داستان'],
  },
  {
    heading: 'از دانه تا فنجان',
    lines: ['با عشق برشته شده', 'عطری که بیدار می‌کند', 'طعمی که می‌ماند'],
  },
  {
    heading: 'جادوی دانه‌ها',
    lines: ['در هر جرعه، با طعم قهوه'],
  },
])

const activeSlides = computed(() => {
  if (props.slides && props.slides.length > 0) return props.slides
  return defaultSlides.value
})

const activeSlide = ref(0)
const slideDirection = ref('slide-up')
const isMobile = ref(false)
const imageHasError = ref(false)

const heroHeightStyle = computed(() => {
  return '100vh'
})

const heroImageSrc = computed(() => {
  if (imageHasError.value) return fallbackImage
  if (isMobile.value && props.mobileImageSrc) return props.mobileImageSrc
  return props.imageSrc || fallbackImage
})

let autoSlideTimer = null
let resizeHandler = null

function goToSlide(index) {
  if (index === activeSlide.value) return
  slideDirection.value = index > activeSlide.value ? 'slide-up' : 'slide-down'
  activeSlide.value = index
}

function startAutoSlide() {
  stopAutoSlide()
  autoSlideTimer = setInterval(() => {
    const next = (activeSlide.value + 1) % activeSlides.value.length
    goToSlide(next)
  }, 4000)
}

function stopAutoSlide() {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
}

function handleImageError(event) {
  const image = event?.target
  if (image && image.src && !image.src.endsWith(fallbackImage)) {
    imageHasError.value = true
  }
}

function scrollToContent() {
  if (!import.meta.client) return

  const heroSection = document.getElementById('hero')
  const nextPosition = (heroSection?.offsetTop || 0) + window.innerHeight
  window.scrollTo({ top: nextPosition, behavior: 'smooth' })
}

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  const onResize = () => {
    isMobile.value = window.innerWidth < 768
  }
  resizeHandler = onResize
  window.addEventListener('resize', onResize)
  startAutoSlide()
})

onUnmounted(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  stopAutoSlide()
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-40px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
</style>
