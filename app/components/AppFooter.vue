<script setup lang="ts">
import {RiMailFill,RiPhoneFill, RiMapPinFill} from '@remixicon/vue'
import { onMounted } from 'vue'

const { settings, fetchSettings } = useSettings()
const { resolveUrl } = useImageUrl()

onMounted(() => {
  fetchSettings()
})

function toPersianDigits(str: string) {
  const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d)])
}

const currentYear = computed(() => {
  return new Date().toLocaleDateString('fa-IR', { year: 'numeric' })
})
</script>

<template>
  <footer class="relative overflow-hidden text-white">
    <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${resolveUrl(settings.footer_background)})` }"
    ></div>
    <div
        class="absolute inset-0 bg-black/70 dark:bg-black/70"
    ></div>

    <!-- footer content -->
    <div class="relative z-10 container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 class="font-bold text-lg text-white">
            {{ settings.store_name }}
          </h3>

          <p class="mt-2 text-sm text-stone-200 leading-7">
            {{ settings.store_description || 'در گوشه‌ای دنج و آرام، عطر قهوه تازه با حس خوب آرامش درهم می‌آمیزد.' }}
          </p>
        </div>

        <div>
          <h3 class="font-bold text-lg text-white">
            لینک‌ها
          </h3>

          <ul class="mt-2 space-y-1 text-sm text-stone-200">
            <li v-for="link in settings.footer_links" :key="link.url">
              <NuxtLink :to="link.url" class="inline-block hover:text-amber-400 hover:scale-105 transition-all duration-300">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-lg text-white">
            ارتباط
          </h3>

          <ul class="mt-2 space-y-1 text-sm text-stone-200 leading-7">
            <li class="flex items-center gap-2">
              <RiPhoneFill class="w-4 h-4" />
              <span>تلفن: {{ toPersianDigits(settings.store_phone) }}</span>
            </li>
            <li class="flex items-center gap-2">
              <RiMailFill class="w-4 h-4 " />
              <span>ایمیل: {{ settings.store_email }}</span>
            </li>
            <li class="flex items-center gap-2">
              <RiMapPinFill class="w-4 h-4 " />
              <span>آدرس: {{ settings.store_address }}</span>
            </li>

          </ul>
        </div>
        <div>
          <h3 class="font-bold text-lg text-white">
            ساعات کاری
          </h3>

          <ul class="mt-2 space-y-1 text-sm text-stone-200 leading-7">
            <li>هر روز هفته از ساعت {{ settings.store_working_hours }}</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/20 mt-8 pt-4 text-center text-sm text-stone-300">
        &copy; {{ currentYear }} - تمامی حقوق محفوظ است
      </div>
    </div>
  </footer>
</template>