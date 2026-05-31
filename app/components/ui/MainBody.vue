<template>
  <section class=" flex flex-col-2 bg-[#3B302C] py-12">
    <div class="flex flex-col  px-10 gap-10 py-12">
      <p class="font-semibold sm:text-3xl text-3xl text-secondary">طعم خوب لحظه ها با قهوه ی ناب</p>
      <p class="font-medium sm:text-xl text-xl text-secondary">طعم خوب لحظه با قهوه ی ناب طعم خوب لحظه با قهوه ی ناب طعم خوب لحظه با قهوه ی ناب طعم خوب لحظه با قهوه ی ناب</p>

     <div class="flex flex-cols-2 gap-4  items-start justify-around text-l text-text font-bold">
        <div class="flex items-start gap-6">
       <div class="flex justify-center items-start "><RiDrinksLine class="h-16 w-16 "/></div>
       <div class="flex flex-col items-start gap-6">
         <p >  کافه ی دلنشین </p>
         <p>  کافه ی دلنشین, طعم خوب لحظه با قهوه ی ناب طعم </p>
       </div>
     </div>
       <div class="flex items-start gap-6">
         <div class="flex justify-center items-start "><RiDrinksLine class="h-16 w-16 "/></div>
         <div class="flex flex-col items-start gap-6">
           <p >  کافه ی دلنشین </p>
           <p>  کافه ی دلنشین, طعم خوب لحظه با قهوه ی ناب طعم </p>
         </div>
       </div>
      </div>
      <div class="flex flex-cols-2 gap-4  items-start justify-around text-l text-text font-bold">
        <div class="flex items-start gap-6">
          <div class="flex justify-center items-start "><RiDrinksLine class="h-16 w-16 "/></div>
          <div class="flex flex-col items-start gap-6">
            <p >  کافه ی دلنشین </p>
            <p>  کافه ی دلنشین, طعم خوب لحظه با قهوه ی ناب طعم </p>
          </div>
        </div>
        <div class="flex items-start gap-6">
          <div class="flex justify-center items-start "><RiDrinksLine class="h-16 w-16 "/></div>
          <div class="flex flex-col items-start gap-6">
            <p >  کافه ی دلنشین </p>
            <p>  کافه ی دلنشین, طعم خوب لحظه با قهوه ی ناب طعم </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-2/3 py-12 items-center justify-center">
      <div class="relative w-[400px] h-[400px]">
        <!-- دایره بزرگ -->
        <div class="w-[400px] h-[400px] rounded-full bg-stone-700 border border-secondary border-[12px]">
          <img
              src="/images/woman-coffee.jpg"
              class="w-full h-full object-cover rounded-full"
              alt=""
          />

        </div>

        <!-- دایره کوچک -->
        <div
            class="absolute -top-5 left-22 translate-x-1/3
           w-40 h-40 rounded-full bg-card border border-secondary border-[12px]"
        ></div>
        <div
            class="absolute -bottom-10 left-10 -translate-x-1/2
           w-40 h-40 rounded-full overflow-hidden
            border border-secondary border-[12px]
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
  </section>

</template>
<script setup lang="ts">
import { RiDrinksLine } from 'vue-remix-icons'
</script>
<style scoped>

</style>