<script setup lang="ts">
import {RiMailFill,RiPhoneFill, RiMapPinFill} from '@remixicon/vue'
</script>

<template>
  <footer class="relative overflow-hidden text-white">
    <div
        class="absolute inset-0 bg-[url('/images/footer.webp')] bg-cover bg-center"
    ></div>
    <div
        class="absolute inset-0 bg-black/70 dark:bg-black/70"
    ></div>

    <!-- footer content -->
    <div class="relative z-10 container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 class="font-bold text-lg text-white">
            قهوه‌فروشی
          </h3>

          <p class="mt-2 text-sm text-stone-200 leading-7">
            در گوشه‌ای دنج و آرام، عطر قهوه تازه با حس خوب آرامش درهم می‌آمیزد.
            اینجا جایی‌ست برای چند دقیقه فاصله گرفتن از شلوغی و لذت بردن از یک فنجان قهوه دل‌چسب.
          </p>
        </div>

        <div>
          <h3 class="font-bold text-lg text-white">
            لینک‌ها
          </h3>

          <ul class="mt-2 space-y-1 text-sm text-stone-200">
            <li>
              <NuxtLink to="/products" class="inline-block hover:text-amber-400 hover:scale-105 transition-all duration-300">
                محصولات
              </NuxtLink>
            </li>

            <li>
              <NuxtLink to="/about" class="inline-block hover:text-amber-400 hover:scale-105 transition-all duration-300">
                درباره ما
              </NuxtLink>
            </li>

            <li>
              <NuxtLink to="/images/contact" class="inline-block hover:text-amber-400 hover:scale-105 transition-all duration-300">
                تماس با ما
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
              <span>تلفن: ۱۲۳۴۵۶۷۸-۰۲۱</span>
            </li>
            <li class="flex items-center gap-2">
              <RiMailFill class="w-4 h-4 " />
              <span>ایمیل: info@coffee-store.ir</span>
            </li>
            <li class="flex items-center gap-2">
              <RiMapPinFill class="w-4 h-4 " />
              <span>آدرس: تهران, خیابان ملاصدرا</span>
            </li>

          </ul>
        </div>
        <div>
          <h3 class="font-bold text-lg text-white">
            ساعات کاری
          </h3>

          <ul class="mt-2 space-y-1 text-sm text-stone-200 leading-7">
            <li>هر روز هفته از ساعت ۸ صبح تا ۱۱ شب </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/20 mt-8 pt-4 text-center text-sm text-stone-300">
        &copy; ۱۴۰۴ - تمامی حقوق محفوظ است
      </div>
    </div>
  </footer>
</template>