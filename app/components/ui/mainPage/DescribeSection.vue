<template>
  <section ref="sectionRef" class="bg-background py-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <div class="flex flex-col gap-10 ">
      <p class="font-bold sm:text-3xl text-3xl text-cups">{{ heading }}</p>
      <p class="font-normal sm:text-lg text-base text-lightText">{{ paragraph }}</p>

     <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start text-l font-bold">
        <div v-for="(drink, i) in displayedDrinksTop" :key="i" class="flex items-start gap-4">
       <div class="flex-shrink-0 flex justify-center items-start ">
         <img v-if="isImageUrl(drink.icon)" :src="drink.icon" :alt="drink.title" class="h-14 w-14 sm:h-16 sm:w-16 object-contain" />
         <component v-else :is="getDrinkIcon(drink.icon)" class="h-14 w-14 sm:h-16 sm:w-16 text-cups" />
       </div>
       <div class="flex flex-col items-start gap-4">
         <p class="text-base sm:text-lg font-bold text-cups">{{ drink.title }}</p>
         <p class="text-sm sm:text-base font-medium text-lightText">{{ drink.description }}</p>
       </div>
     </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start text-l font-bold">
        <div v-for="(drink, i) in displayedDrinksBottom" :key="i" class="flex items-start gap-4">
          <div class="flex-shrink-0 flex justify-center items-start ">
            <img v-if="isImageUrl(drink.icon)" :src="drink.icon" :alt="drink.title" class="h-14 w-14 sm:h-16 sm:w-16 object-contain" />
            <component v-else :is="getDrinkIcon(drink.icon)" class="h-14 w-14 sm:h-16 sm:w-16 text-cups" />
          </div>
          <div class="flex flex-col items-start gap-4">
            <p class="text-base sm:text-lg font-bold text-cups">{{ drink.title }}</p>
            <p class="text-sm sm:text-base font-medium text-lightText">{{ drink.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex py-12 items-center justify-center lg:items-end lg:justify-end">
      <div class="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px]">
        <!-- دایره بزرگ -->
        <div class="w-full h-full rounded-full bg-stone-700 border border-border border-[8px] sm:border-[12px]">
          <img
              :src="mainImage"
              class="w-full h-full object-cover rounded-full"
              alt=""
          />
        </div>

        <!-- دایره عدد تجربه -->
        <div
            class="absolute -top-12 left-28 sm:-top-5 sm:left-22 translate-x-1/3
           w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full bg-card border border-border border-[8px] sm:border-[12px]
           flex flex-col items-center justify-center"
        >
          <span class="text-2xl sm:text-3xl font-black text-cups">+{{ animatedNumber }}</span>
          <span class="text-[10px] sm:text-xs text-lightText mt-1">{{ experienceLabel }}</span>
        </div>

        <!-- دایره چرخان -->
        <div
            class="absolute -bottom-6 sm:-bottom-10 left-4 sm:left-10 -translate-x-1/2
           w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden
            border border-border border-[8px] sm:border-[12px]
         "
        >
          <img
              :src="secondaryImage"
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

const props = defineProps({
  heading: { type: String, default: 'طعم خوب لحظه ها با قهوه ی ناب' },
  paragraph: { type: String, default: 'قهوه فقط یک نوشیدنی نیست؛ برای خیلی‌ها شروع آرامِ یک روز شلوغ است. عطرش فضا را پر می‌کند و طعمش انگار چند دقیقه به آدم فرصت مکث و نفس کشیدن می‌دهد.' },
  mainImage: { type: String, default: '/images/woman-coffee.jpg' },
  secondaryImage: { type: String, default: '/images/circle.webp' },
  experienceNumber: { type: Number, default: 7 },
  experienceLabel: { type: String, default: 'سال تجربه' },
  drinks: {
    type: Array as () => { title: string; description: string; icon: string }[],
    default: () => [
      { title: 'دمنوش معطر', description: 'نوشیدنی گرم و خوش‌عطری که حس آرامش و تازگی می‌دهد.', icon: 'tea-cup' },
      { title: 'اسپرسو', description: 'قهوه‌ای غلیظ و پرانرژی با طعمی عمیق و ماندگار.', icon: 'coffee-cup' },
      { title: 'آیس کافی', description: 'قهوه‌ای خنک و دل‌چسب، مناسب روزهای گرم.', icon: 'cold-coffee' },
      { title: 'لاته', description: 'ترکیب لطیف قهوه و شیر با طعمی نرم و خامه‌ای.', icon: 'cuppoccino' },
    ]
  },
})

const iconMap: Record<string, any> = {
  'tea-cup': TeaCupIcon,
  'coffee-cup': CoffeeCup,
  'cold-coffee': ColdCoffee,
  'cuppoccino': Cuppoccino,
}

const sectionRef = ref<HTMLElement | null>(null)
const animatedNumber = ref(0)
const hasAnimated = ref(false)

function isImageUrl(icon: string): boolean {
  if (!icon) return false
  return icon.startsWith('/') || icon.startsWith('http') || icon.includes('.')
}

function getDrinkIcon(icon: string) {
  return iconMap[icon] || TeaCupIcon
}

function animateCount(target: number) {
  if (hasAnimated.value) return
  hasAnimated.value = true
  const duration = 2000
  const startTime = performance.now()
  const startVal = 0

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedNumber.value = Math.round(startVal + (target - startVal) * eased)
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

onMounted(() => {
  if (!sectionRef.value) return
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCount(props.experienceNumber)
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  observer.observe(sectionRef.value)
  onUnmounted(() => observer.disconnect())
})

const displayedDrinksTop = computed(() => (props.drinks || []).slice(0, 2))
const displayedDrinksBottom = computed(() => (props.drinks || []).slice(2, 4))
</script>
