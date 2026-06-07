<template>
  <section class="bg-background py-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <div class="flex flex-col gap-10 ">
      <p class="font-bold sm:text-3xl text-3xl text-cups">طعم خوب لحظه ها با قهوه ی ناب</p>
      <p class="font-normal sm:text-lg text-base text-lightText">قهوه فقط یک نوشیدنی نیست؛ برای خیلی‌ها شروع آرامِ یک روز شلوغ است.
        عطرش فضا را پر می‌کند و طعمش انگار چند دقیقه به آدم فرصت مکث و نفس کشیدن می‌دهد.</p>

     <div class="flex flex-cols-2 gap-10  items-start justify-start text-l font-bold">
        <div class="flex flex-1 items-start gap-6">
       <div class="flex justify-center items-start "><TeaCupIcon class="h-16 w-16 text-cups "/></div>
       <div class="flex flex-col items-start gap-6">
         <p class="text-lg font-bold text-cups"> دمنوش معطر </p>
         <p class="text-base font-medium text-lightText"> نوشیدنی گرم و خوش‌عطری که حس آرامش و تازگی می‌دهد. </p>
       </div>
     </div>
       <div class="flex flex-1 items-start gap-6">
         <div class="flex justify-center items-start "><CoffeeCup class="h-16 w-16 text-cups "/></div>
         <div class="flex flex-col items-start gap-6">
           <p class="text-lg font-bold text-cups">  اسپرسو </p>
           <p class="text-base font-medium text-lightText">  قهوه‌ای غلیظ و پرانرژی با طعمی عمیق و ماندگار. </p>
         </div>
       </div>
      </div>
      <div class="flex  flex-cols-2 gap-4 items-start justify-start text-l font-bold">
        <div class="flex flex-1 items-start gap-6">
          <div class="flex justify-center items-start "><ColdCoffee class="h-16 w-16 text-cups "/></div>
          <div class="flex flex-col items-start gap-6">
            <p class="text-lg font-bold text-cups" >  آیس کافی </p>
            <p class="text-base font-medium text-lightText">  قهوه‌ای خنک و دل‌چسب، مناسب روزهای گرم. </p>
          </div>
        </div>
        <div class="flex flex-1 items-start gap-6">
          <div class="flex justify-center items-start "><Cuppoccino class="h-16 w-16 text-cups "/></div>
          <div class="flex flex-col items-start gap-6">
            <p class="text-lg font-bold text-cups"> لاته </p>
            <p class="text-base font-medium text-lightText">  ترکیب لطیف قهوه و شیر با طعمی نرم و خامه‌ای. </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex py-12 items-end justify-end">
      <div class="relative w-[400px] h-[400px]">
        <!-- دایره بزرگ -->
        <div class="w-[400px] h-[400px] rounded-full bg-stone-700 border border-border border-[12px]">
          <img
              src="/images/woman-coffee.jpg"
              class="w-full h-full object-cover rounded-full"
              alt=""
          />
        </div>

        <!-- دایره کوچک -->
        <div
            class="absolute -top-5 left-22 translate-x-1/3
           w-40 h-40 rounded-full bg-card border border-border border-[12px]"
        ></div>
        <div
            class="absolute -bottom-10 left-10 -translate-x-1/2
           w-40 h-40 rounded-full overflow-hidden
            border border-border border-[12px]
         "
        >
          <img
              src="/images/circle.webp"
              class="w-full h-full object-cover animate-[spin_12s_linear_infinite]"
              alt=""
          />
        </div>
      </div>
    </div>
      </div>
    </div>
  </section>

</template>
<script setup lang="ts">
import TeaCupIcon from '~/assets/icons/tea-cup.svg'
import CoffeeCup from '~/assets/icons/coffee-cup.svg'
import ColdCoffee from '~/assets/icons/cold-coffee.svg'
import Cuppoccino from '~/assets/icons/cuppoccino.svg'
</script>
<style scoped>

</style>