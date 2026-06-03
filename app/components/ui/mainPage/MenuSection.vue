<template>
  <section class="py-14 mt-10">
    <div class="container mx-auto px-4">
      <div class="mb-10 text-center">
        <h2 class="text-3xl font-bold text-text">
          منوی کافه
        </h2>

        <p class="mt-3 text-sm text-text">
          دسته‌بندی موردنظر را انتخاب کنید
        </p>
      </div>

      <div v-if="pending" class="py-12 text-center text-text">
        در حال دریافت منو...
      </div>

      <div v-else-if="error" class="py-12 text-center text-red-500">
        خطا در دریافت منو
      </div>

      <div v-else>
        <!-- categories -->
        <div class="mb-10 overflow-x-auto pb-3">
          <ul class="flex min-w-max items-center justify-center gap-3">
            <li
                v-for="category in menuCategories"
                :key="category.id"
            >
              <button
                  type="button"
                  class="rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300"
                  :class="activeCategorySlug === category.slug
                  ? 'bg-amber-700 text-white shadow-lg shadow-amber-900/20 scale-105'
                  : 'bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-800 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700'"
                  @click="setActiveCategory(category.slug)"
              >
                {{ category.title }}
              </button>
            </li>
          </ul>
        </div>

        <!-- active category menu -->
        <Transition name="menu-fade" mode="out-in">
          <div
              v-if="activeCategory"
              :key="activeCategory.slug"
              class="mx-auto max-w-5xl rounded-lg  p-6 shadow-xl ring-1 ring-black/5 backdrop-blur bg-delivery dark:bg-background dark:ring-white/10"
          >
            <div class="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-5 dark:border-stone-700 sm:flex-row sm:items-center sm:justify-between">
              <div >
                <div class="flex items-center gap-3">
                  <h3 class="text-2xl font-bold text-text">
                    {{ activeCategory.title }}
                  </h3>
                  <span class="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-900 bg-items dark:text-amber-600">
                {{ activeCategory.items.length }} آیتم
              </span>
                </div>

                <p
                    v-if="activeCategory.description"
                    class="mt-2 text-sm leading-7 text-lightText"
                >
                  {{ activeCategory.description }}
                </p>
              </div>

              <span class="w-fit rounded-full bg-amber-100 px-4 py-4 text-sm bg-items items-center text-center ">
                 <component
                     v-if="activeCategory?.icon"
                     :is="categoryIcons[activeCategory.icon as keyof typeof categoryIcons]"
                     class="h-16 w-16 text-amber-700 dark:text-amber-600"
                 />
              </span>
            </div>

            <div
                v-if="activeCategory.items.length"
                class="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1"
            >
              <article
                  v-for="item in activeCategory.items"
                  :key="item.id"
                  class="group relative rounded-lg p-5 transition-all duration-300 hover:-translate-y-1  hover:shadow-md bg-menuCard "
                  :class="!item.isAvailable ? 'opacity-30' : ''"
              >
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h4 class="font-bold text-text transition-colors duration-300 group-hover:text-amber-900 dark:text-text dark:group-hover:text-amber-600">
                      {{ item.title }}
                    </h4>

                    <span
                        v-if="item.isPopular"
                        class="mt-2 inline-block rounded-full bg-items px-2 py-0.5 text-xs text-amber-800 dark:text-amber-600"
                    >
                      پرفروش
                    </span>
                  </div>

                  <span class="whitespace-nowrap rounded-full bg-items px-3 py-1 text-xs font-bold text-amber-900 shadow-sm  dark:text-amber-500">
                    {{ formatPrice(item.price) }}
                    تومان
                  </span>
                </div>

                <p class="text-sm leading-7 text-lightText ">
                  {{ item.description }}
                </p>

                <p
                    v-if="!item.isAvailable"
                    class="mt-3 text-sm font-medium text-red-500"
                >
                  فعلاً موجود نیست
                </p>
              </article>
            </div>

            <div
                v-else
                class="rounded-lg bg-stone-50 p-6 text-center text-sm text-stone-500 dark:bg-stone-800 dark:text-stone-300"
            >
              برای این دسته‌بندی هنوز آیتمی ثبت نشده است.
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import TeaIcon from '~/assets/icons/menu-category/tea.svg'
import CakeIcon from '~/assets/icons/menu-category/cake.svg'
import CoffeeIcon from '~/assets/icons/menu-category/coffee.svg'
import HotDrinkIcon from '~/assets/icons/menu-category/hot-drink.svg'
import ColdDrinkIcon from '~/assets/icons/menu-category/cold-drink.svg'

const {
  menuCategories,
  activeCategorySlug,
  activeCategory,
  setActiveCategory,
  formatPrice,
  pending,
  error,
} = useMenuCategories();

const categoryIcons = {
  tea: TeaIcon,
  cake: CakeIcon,
  coffee: CoffeeIcon,
  hotDrink: HotDrinkIcon,
  coldDrink: ColdDrinkIcon,
}
</script>
<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.98);
}
</style>