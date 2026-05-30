<script setup lang="ts">
</script>

<template>
  <footer class="relative text-stone-300">
    <!-- background image -->
    <div
        class="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('/images/footer.webp')]"
    ></div>

    <!-- dark overlay -->
    <div class="absolute inset-0 "></div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-white font-bold text-lg">قهوه‌فروشی</h3>
          <p class="mt-2 text-sm">فروشگاه تخصصی قهوه با بهترین کیفیت</p>
        </div>
        <div>
          <h3 class="text-white font-bold text-lg">لینک‌ها</h3>
          <ul class="mt-2 space-y-1 text-sm">
            <li><NuxtLink to="/products" class="hover:text-amber-400">محصولات</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-amber-400">درباره ما</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-amber-400">تماس با ما</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-white font-bold text-lg">ارتباط</h3>
          <ul class="mt-2 space-y-1 text-sm">
            <li>تلفن: ۱۲۳۴۵۶۷۸-۰۲۱</li>
            <li>ایمیل: info@coffee-store.ir</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-stone-700 mt-8 pt-4 text-center text-sm">
        &copy; ۱۴۰۴ - تمامی حقوق محفوظ است
      </div>
    </div>
  </footer>
</template>