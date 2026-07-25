<script setup lang="ts">
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDoubleQuotesR
} from '@remixicon/vue'

const props = defineProps({
  heading: { type: String, default: 'نظر مشتریان ما' },
  subtitle: { type: String, default: 'تجربه مشتریان از خرید قهوه و محصولات ما' },
  backgroundImage: { type: String, default: '/images/testimonal-bg.jpg' },
})

const { testimonials, pending, error } = useTestimonials()

const activeIndex = ref(0)
let autoSlideTimer: ReturnType<typeof setInterval> | null = null

const goToNext = () => {
  if (!testimonials.value.length) return

  activeIndex.value =
      activeIndex.value === testimonials.value.length - 1
          ? 0
          : activeIndex.value + 1
}

const goToPrev = () => {
  if (!testimonials.value.length) return

  activeIndex.value =
      activeIndex.value === 0
          ? testimonials.value.length - 1
          : activeIndex.value - 1
}

const goToSlide = (index: number) => {
  activeIndex.value = index
}

const startAutoSlide = () => {
  stopAutoSlide()

  autoSlideTimer = setInterval(() => {
    goToNext()
  }, 2000)
}

const stopAutoSlide = () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
}

watch(
    testimonials,
    (items) => {
      if (items.length > 0) {
        activeIndex.value = 0
        startAutoSlide()
      }
    },
    { immediate: true }
)

onBeforeUnmount(() => {
  stopAutoSlide()
})
</script>

<template>
  <section
      class="group relative overflow-hidden py-24"
      @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide"
  >
    <!-- background image -->
    <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url('${backgroundImage}')` }"
    ></div>

    <!-- dark overlay روی عکس، نه روی متن -->
    <div class="absolute inset-0 dark:bg-black/50"></div>

    <!-- content -->
    <div class="relative z-10 container mx-auto px-4">
      <div class=" text-center">
        <h2 class="text-4xl font-bold text-lightText">
          {{ heading }}
        </h2>

        <p class="mt-3 text-lg text-lightText">
          {{ subtitle }}
        </p>
      </div>

      <div
          v-if="pending"
          class="mx-auto max-w-4xl rounded-3xl bg-white/10 p-10 text-center text-white backdrop-blur"
      >
        در حال دریافت نظرات...
      </div>

      <div
          v-else-if="error"
          class="text-center text-red-300"
      >
        خطا در دریافت نظرات مشتریان
      </div>

      <div
          v-else
          class="relative mx-auto max-w-4xl overflow-hidden rounded-3xl"
      >
        <!-- prev button -->
        <button
            type="button"
            class="absolute right-4 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-testimonial text-stone-800 opacity-0 shadow-lg transition-all duration-300 hover:bg-lightText hover:text-white group-hover:opacity-100"
            aria-label="نظر قبلی"
            @click="goToPrev"
        >
          <RiArrowRightSLine class="size-8" />
        </button>

        <!-- next button -->
        <button
            type="button"
            class="absolute left-4 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-testimonial text-stone-800 opacity-0 shadow-lg transition-all duration-300 hover:bg-lightText hover:text-white group-hover:opacity-100"
            aria-label="نظر بعدی"
            @click="goToNext"
        >
          <RiArrowLeftSLine class="size-8" />
        </button>

        <!-- slider track -->
        <div
            class="flex transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateX(${activeIndex * 100}%)` }"
        >
          <article
              v-for="testimonial in testimonials"
              :key="testimonial.id"
              class="min-w-full px-4"
          >
            <div class="mx-auto rounded-3xl bg-transparent px-8 py-12 text-center ">
              <div class="mx-auto flex  items-center justify-center">
                <RiDoubleQuotesR class="size-20 text-lightText"/>
              </div>

              <div class="mt-6 flex justify-center gap-1 text-lightText">
                <span
                    v-for="star in 5"
                    :key="star"
                    class="text-lg"
                    :class="star <= testimonial.rating ? 'opacity-100' : 'opacity-25'"
                >
                  ★
                </span>
              </div>

              <p class="mx-auto mt-6 max-w-2xl text-base leading-9 text-stone-700 dark:text-stone-200">
                {{ testimonial.comment }}
              </p>

              <div class="mt-8 flex flex-col items-center">
                <img
                    v-if="testimonial.image"
                    :src="testimonial.image"
                    :alt="testimonial.name"
                    class="size-16 rounded-full object-cover ring-4 ring-testimonial"
                />

                <div
                    v-else
                    class="flex size-16 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-800"
                >
                  {{ testimonial.name.charAt(0) }}
                </div>

                <h3 class="mt-4 font-bold text-stone-800 dark:text-white">
                  {{ testimonial.name }}
                </h3>

                <p
                    v-if="testimonial.role"
                    class="mt-1 text-sm text-stone-500 dark:text-stone-400"
                >
                  {{ testimonial.role }}
                </p>
              </div>
            </div>
          </article>
        </div>

        <!-- dots -->
        <div class="mt-8 flex items-center justify-center gap-2">
          <button
              v-for="(_, index) in testimonials"
              :key="index"
              type="button"
              class="h-2.5 rounded-full transition-all duration-300"
              :class="activeIndex === index
              ? 'w-8 bg-testimonial'
              : 'w-2.5 bg-testimonial hover:bg-hover'"
              @click="goToSlide(index)"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>