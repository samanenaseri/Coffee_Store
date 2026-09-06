<script setup lang="ts">
import { RiInstagramLine } from "@remixicon/vue"

const props = defineProps<{
  heading?: string
  subheading?: string
}>()

const { staffs, pending, error } = useStaffs()
const { resolveUrl } = useImageUrl()
const { socialUrl } = useSiteSeo()

const imageSrc = (staff: any) => {
  return resolveUrl(staff?.image) || '/images/great-coffee-bean.jpeg'
}
</script>

<template>
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold text-text">
          {{ props.heading || 'تیم ما' }}
        </h2>

        <p class="mt-3 text-sm text-lightText">
          {{ props.subheading || 'با اعضای حرفه‌ای قهوه‌فروشی ما آشنا شوید' }}
        </p>
      </div>

      <div
          v-if="pending"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div
            v-for="n in 4"
            :key="n"
            class="h-80 animate-pulse rounded-3xl bg-text"
        />
      </div>

      <div
          v-else-if="error"
          class="text-center text-red-500"
      >
        خطا در دریافت اطلاعات پرسنل
      </div>

      <div
          v-else
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <article
            v-for="staff in staffs"
            :key="staff.id"
            class="group overflow-hidden rounded-lg bg-delivery shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-background"
        >
          <div class="relative overflow-hidden">
            <img
                :src="imageSrc(staff)"
                :alt="staff.name"
                class="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              <a
                v-if="staff.instagram"
                :href="socialUrl(staff.instagram, 'https://instagram.com')"
                target="_blank"
                rel="noopener noreferrer"
                class="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-stone-800 opacity-0 transition-all duration-300 hover:bg-amber-600 hover:text-white group-hover:opacity-100"
            >
              <RiInstagramLine class="size-5" />
            </a>
          </div>

          <div class="p-5 text-center">
            <h3 class="text-lg font-bold text-text transition-colors duration-300 group-hover:text-hover dark:group-hover:text-border">
              {{ staff.name }}
            </h3>

            <p class="mt-1 text-sm font-medium text-lightText ">
              {{ staff.role }}
            </p>

            <p class="mt-3 text-sm leading-7 text-text">
              {{ staff.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
