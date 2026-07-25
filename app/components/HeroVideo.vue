<template>
  <section id="hero" data-hero class="relative w-full" :style="{ height: scrollHeight + 'vh' }">
    <div class="sticky top-0 h-screen overflow-hidden">
      <!-- Video mode -->
      <video
          v-if="mediaType === 'video'"
          ref="videoRef"
          class="absolute inset-0 w-full h-full object-cover scale-110"
          muted
          playsinline
          preload="auto"
      >
        <source :src="videoSrc" type="video/mp4" />
      </video>

      <!-- Image mode -->
      <img
          v-else
          :src="imageSrc"
          :alt="slides[activeSlide]?.heading"
          class="absolute inset-0 w-full h-full object-cover scale-110"
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
                class="text-5xl md:text-7xl font-bold text-white tracking-wider transition-all duration-700"
            >
              {{ activeSlides[activeSlide]?.heading }}
            </h1>

            <div class="mt-4 text-lg md:text-2xl text-stone-200 space-y-2">
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
  mediaType: { type: String, default: 'video' },
  videoSrc: { type: String, default: '/videos/scroll-video-final.mp4' },
  imageSrc: { type: String, default: '/images/hero-default.jpg' },
  heading: { type: String, default: 'عطر قهوه' },
  subtitle: { type: String, default: 'هر فنجان، یک داستان' },
  scrollHeight: { type: Number, default: 500 },
  slides: { type: Array, default: null },
})

const defaultSlides = [
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
]

const activeSlides = computed(() => {
  if (props.slides && props.slides.length > 0) return props.slides
  return defaultSlides
})

const activeSlide = ref(0)
const slideDirection = ref('slide-up')
const videoRef = ref(null)

function goToSlide(index) {
  if (index === activeSlide.value) return
  slideDirection.value = index > activeSlide.value ? 'slide-up' : 'slide-down'
  activeSlide.value = index
}

onMounted(() => {
  const heroSection = document.getElementById('hero')
  if (!heroSection) return

  const updateSlide = () => {
    const scrollTop = window.scrollY
    const start = heroSection.offsetTop
    const end = start + heroSection.offsetHeight - window.innerHeight

    const progress = Math.min(Math.max((scrollTop - start) / (end - start), 0), 1)

    const slideCount = activeSlides.value.length
    const newSlide = Math.min(Math.floor(progress * slideCount), slideCount - 1)

    if (newSlide !== activeSlide.value) {
      slideDirection.value = newSlide > activeSlide.value ? 'slide-up' : 'slide-down'
      activeSlide.value = newSlide
    }
  }

  window.addEventListener('scroll', updateSlide)

  // Video sync
  if (props.mediaType === 'video') {
    const video = videoRef.value
    if (video) {
      const updateVideo = () => {
        if (!video?.duration) return
        const scrollTop = window.scrollY
        const start = heroSection.offsetTop
        const end = start + heroSection.offsetHeight - window.innerHeight
        const progress = Math.min(Math.max((scrollTop - start) / (end - start), 0), 1)
        video.currentTime = progress * video.duration
      }
      video.addEventListener('loadedmetadata', updateVideo)
      window.addEventListener('scroll', updateVideo)
      onUnmounted(() => window.removeEventListener('scroll', updateVideo))
    }
  }

  onUnmounted(() => window.removeEventListener('scroll', updateSlide))
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
