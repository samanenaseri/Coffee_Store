<script setup lang="ts">
import StaffSection from "~/components/ui/StaffSection.vue";

useSeoMeta({
  title: "درباره ما | قهوه‌فروشی",
  description: "داستان قهوه‌فروشی ما و تعهد به کیفیت",
})
</script>

<template>
  <section>
    <div class="container flex  gap-10 justify-around mx-auto px-4 py-24">
      <div class="relative w-[400px] h-[400px]">
        <!-- مستطیل بزرگ -->
        <div class="w-[400px] h-[520px]  ">
          <img
              src="/images/about/about-main.jpg"
              class="w-full h-full object-cover"
              alt=""
          />
        </div>
        <!-- مستطیل کوچک -->
        <div
            class="absolute -bottom-10 left-0 -translate-x-1/2
           w-40 h-56  overflow-hidden
            border border-bg border-[10px] ">
          <img
              src="/images/about/about-second.jpg"
              class="w-full h-full object-cover "
              alt=""
          />
        </div>
      </div>
      <div >
              <h1 class="text-3xl font-bold text-text pt-16">درباره ما</h1>
              <p class="text-lightText mt-4 leading-relaxed max-w-2xl">
                ما یک فروشگاه تخصصی قهوه هستیم که با افتخار بهترین دانه‌های قهوه را از نقاط مختلف جهان انتخاب و به شما عزیزان ارائه می‌دهیم. باور ما این است که یک فنجان قهوه خوب، حاصل انتخاب دقیق، کیفیت بالا و توجه به جزئیات است.

                به همین دلیل، کیفیت و تازگی محصولات برای ما در اولویت قرار دارد و تلاش می‌کنیم بهترین تجربه را برای دوستداران قهوه فراهم کنیم. مجموعه ما با ارائه انواع دانه‌های قهوه، نوشیدنی‌های بر پایه قهوه و محصولات مرتبط، فضایی را ایجاد کرده است تا هر فرد بتواند طعم مورد علاقه خود را پیدا کند.

                هدف ما تنها فروش قهوه نیست؛ بلکه می‌خواهیم لحظاتی دلنشین و خاطره‌انگیز را در کنار عطر و طعم بی‌نظیر قهوه برای شما رقم بزنیم. رضایت مشتریان، ارائه محصولات باکیفیت و حفظ استانداردهای حرفه‌ای، ارزش‌هایی هستند که همواره به آن‌ها پایبند بوده‌ایم.

              </p>
      </div>
    </div>
    <staffSection></staffSection>
  </section>
</template>