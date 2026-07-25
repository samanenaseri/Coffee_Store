<script setup lang="ts">
import {
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
  RiTimeLine,
  RiInstagramLine,
  RiSendPlaneLine
} from '@remixicon/vue'
const { settings, fetchSettings } = useSettings()
const { resolveUrl } = useImageUrl()
await fetchSettings()

useSeoMeta({
  title: () => `${settings.value.contact_title} | قهوه‌فروشی`,
  description: () => settings.value.contact_hero_description?.substring(0, 160),
})

useHead({
  link: [
    { rel: 'canonical', href: `${settings.value.site_url || 'https://coffee-store.example.com'}/contact` },
  ],
})

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const toPersianDigits = (str: string) => {
  const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d)])
}

const submitForm = () => {
  console.log('Contact form:', form)
}
</script>

<template>
  <main class="pt-20">
    <section class="flex items-center gap-20 bg-gradient-to-b from-navbar to-bg">
      <div class="group h-[300px] w-[300px] overflow-hidden">
        <img
            :src="resolveUrl(settings.contact_hero_image)"
            :alt="settings.contact_title"
            class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:rotate-[-10deg]"
        >
      </div>
      <div>
        <h1 class="text-4xl font-bold text-text">
          {{ settings.contact_title }}
        </h1>

        <p class="mt-4 text-base font-medium leading-8 text-lightText">
          {{ settings.contact_hero_description }}
        </p>
      </div>
    </section>

    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <!-- info cards -->
          <div class="lg:col-span-5">
            <div class="rounded-3xl bg-bg p-6 shadow-lg card-des">
              <h2 class="text-2xl font-bold text-text">
                {{ settings.contact_info_title }}
              </h2>

              <p class="mt-3 text-sm leading-8 text-text">
                {{ settings.contact_info_description }}
              </p>

              <div class="mt-8 space-y-5">
                <div class="flex items-start gap-4">
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background text-text">
                    <RiMapPinLine class="size-6" />
                  </div>
                  <div>
                    <h3 class="font-bold text-text">آدرس فروشگاه</h3>
                    <p class="mt-1 text-sm leading-7 text-lightText">
                      {{ settings.store_address }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background text-text">
                    <RiPhoneLine class="size-6" />
                  </div>
                  <div>
                    <h3 class="font-bold text-text">تلفن تماس</h3>
                    <p class="mt-1 text-sm text-lightText">
                      {{ toPersianDigits(settings.store_phone) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background text-text">
                    <RiMailLine class="size-6" />
                  </div>
                  <div>
                    <h3 class="font-bold text-text">ایمیل</h3>
                    <p class="mt-1 text-sm text-lightText">
                      {{ settings.store_email }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-background text-text">
                    <RiTimeLine class="size-6" />
                  </div>
                  <div>
                    <h3 class="font-bold text-text">ساعت کاری</h3>
                    <p class="mt-1 text-sm leading-7 text-lightText">
                      {{ settings.store_working_hours }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-8 border-t border-border pt-6">
                <a
                    :href="`https://instagram.com/${settings.store_instagram}`"
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
                {{ settings.contact_form_title }}
              </h2>

              <p class="mt-3 text-sm leading-8 text-text">
                {{ settings.contact_form_description }}
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
          <div class="flex h-72 items-center justify-center bg-cover bg-center" :style="{ backgroundImage: `url(${settings.contact_map_background})` }">
            <div class="rounded-2xl bg-black/60 px-6 py-4 text-center text-white backdrop-blur">
              <p class="font-bold">
                {{ settings.contact_map_title }}
              </p>
              <p class="mt-2 text-sm text-stone-200">
                {{ settings.contact_map_description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
