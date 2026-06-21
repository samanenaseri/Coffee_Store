<script setup lang="ts">
import {
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
  RiTimeLine,
  RiInstagramLine,
  RiSendPlaneLine
} from '@remixicon/vue'

useSeoMeta({
  title: 'تماس با ما | قهوه‌فروشی',
  description: 'راه‌های ارتباط با فروشگاه قهوه‌فروشی'
})

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const submitForm = () => {
  console.log('Contact form:', form)
}
</script>

<template>
  <main class="pt-20">
    <section class="flex items-center gap-20 bg-gradient-to-b from-navbar to-bg">
      <div class="group h-[300px] w-[300px] overflow-hidden">
        <img
            src="/images/cup-about.png"
            alt="ارتباط با قهوه فروشی"
            class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:rotate-[-10deg]"
        >
      </div>
      <div class=" ">
        <h1 class="text-4xl font-bold text-text">
          تماس با ما
        </h1>

        <p class="mt-4 text-base font-medium leading-8 text-lightText">
          اگر سوالی درباره محصولات، سفارش‌ها یا انتخاب قهوه مناسب دارید،
          خوشحال می‌شویم با ما در ارتباط باشید.
        </p>
      </div>

    </section>

    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <!-- info cards -->
          <div class="lg:col-span-5 ">
            <div class="rounded-3xl bg-bg p-6 shadow-lg card-des">
              <h2 class="text-2xl font-bold text-text">
                اطلاعات تماس
              </h2>

              <p class="mt-3 text-sm leading-8 text-text">
                برای ثبت سفارش، پیگیری خرید یا دریافت مشاوره انتخاب قهوه،
                از راه‌های زیر با ما در ارتباط باشید.
              </p>

              <div class="mt-8 space-y-5">
                <div class="flex items-start gap-4">
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background text-text">
                    <RiMapPinLine class="size-6" />
                  </div>

                  <div>
                    <h3 class="font-bold text-text">
                      آدرس فروشگاه
                    </h3>
                    <p class="mt-1 text-sm leading-7 text-lightText">
                      تهران، خیابان ولیعصر، نبش کوچه قهوه، پلاک ۱۲
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background text-text">
                    <RiPhoneLine class="size-6" />
                  </div>

                  <div>
                    <h3 class="font-bold text-text">
                      تلفن تماس
                    </h3>
                    <p class="mt-1 text-sm text-lightText">
                      ۰۲۱-۱۲۳۴۵۶۷۸
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background text-text">
                    <RiMailLine class="size-6" />
                  </div>

                  <div>
                    <h3 class="font-bold text-text">
                      ایمیل
                    </h3>
                    <p class="mt-1 text-sm text-lightText">
                      info@coffee-store.ir
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background text-text">
                    <RiTimeLine class="size-6" />
                  </div>

                  <div>
                    <h3 class="font-bold text-text">
                      ساعت کاری
                    </h3>
                    <p class="mt-1 text-sm leading-7 text-lightText">
                      شنبه تا پنجشنبه از ساعت ۹ صبح تا ۹ شب
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-8 border-t border-border pt-6 ">
                <a
                    href="https://instagram.com"
                    target="_blank"
                    class="inline-flex items-center gap-2 rounded-full bg-text px-5 py-3 text-sm text-white transition-all duration-300 hover:-translate-y-1 hover:bg-background hover:text-text hover:shadow-lg"
                >
                  <RiInstagramLine class="size-5" />
                  اینستاگرام ما
                </a>
              </div>
            </div>
          </div>

          <!-- contact form -->
          <div class="lg:col-span-7">
            <div class="rounded-3xl bg-bg p-6 shadow-lg card-des">
              <h2 class="text-2xl font-bold text-text">
                ارسال پیام
              </h2>

              <p class="mt-3 text-sm leading-8 text-text">
              پیامتون رو از این قسمت برای ما ارسال کنید.
              </p>

              <form class="mt-6 space-y-5" @submit.prevent="submitForm">
                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-text">
                      نام شما
                    </label>

                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="مثلاً سمانه ناصری"
                        class="w-full resize-none rounded-2xl border border-background bg-input px-4 py-2 text-sm leading-8 text-stone-800 outline-none transition-all duration-300 placeholder:text-divider focus:border-testimonial"
                    />
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-medium text-text">
                      ایمیل
                    </label>

                    <input
                        v-model="form.email"
                        type="email"
                        placeholder="example@email.com"
                        class="w-full resize-none rounded-2xl border border-background bg-input px-4 py-2 text-sm leading-8 text-stone-800 outline-none transition-all duration-300 placeholder:text-divider focus:border-testimonial"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-text">
                    پیام شما
                  </label>

                  <textarea
                      v-model="form.message"
                      rows="6"
                      placeholder="پیام خود را بنویسید..."
                      class="w-full resize-none rounded-2xl border border-background bg-input px-4 py-3 text-sm leading-8 text-stone-800 outline-none transition-all duration-300 placeholder:text-divider focus:border-testimonial"
                  ></textarea>
                </div>

                <button
                    type="submit"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-text px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-background hover:text-text hover:shadow-lg"
                >
                  <RiSendPlaneLine class="size-5" />
                  ارسال پیام
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- map placeholder -->
        <div class="mt-10 overflow-hidden rounded-3xl bg-stone-200 shadow-lg dark:bg-stone-800">
          <div class="flex h-72 items-center justify-center bg-[url('/images/footer.webp')] bg-cover bg-center">
            <div class="rounded-2xl bg-black/60 px-6 py-4 text-center text-white backdrop-blur">
              <p class="font-bold">
                موقعیت فروشگاه روی نقشه
              </p>
              <p class="mt-2 text-sm text-stone-200">
                بعداً می‌تونی این قسمت رو با Google Map یا Leaflet جایگزین کنی.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>