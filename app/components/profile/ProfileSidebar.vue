<script setup lang="ts">
import {
  RiCustomerService2Line,
  RiHeart3Line,
  RiLogoutBoxRLine,
  RiMapPinLine,
  RiShoppingBag3Line,
  RiUserLine,
  RiWallet3Line,
} from '@remixicon/vue'

const route = useRoute()
const userStore = useUserStore()
const { logout } = useAuth()

const menuItems = [
  {
    title: 'اطلاعات کاربری',
    to: '/profile',
    icon: RiUserLine,
  },
  {
    title: 'سفارش‌های من',
    to: '/profile/orders',
    icon: RiShoppingBag3Line,
  },
  {
    title: 'علاقه‌مندی‌ها',
    to: '/profile/favorites',
    icon: RiHeart3Line,
  },
  {
    title: 'آدرس‌های من',
    to: '/profile/addresses',
    icon: RiMapPinLine,
  },
  {
    title: 'کیف پول',
    to: '/profile/wallet',
    icon: RiWallet3Line,
  },
  {
    title: 'پشتیبانی',
    to: '/profile/support',
    icon: RiCustomerService2Line,
  },
]

const isActive = (path: string) => {
  if (path === '/profile') {
    return route.path === '/profile'
  }

  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await logout()
  userStore.resetUser()
  window.location.href = '/'
}
</script>

<template>
  <div
      class="overflow-hidden rounded-xl p-3 border border border-delivery dark:border-hover bg-bg shadow-sm dark:border-gray-700"
  >
    <!-- اطلاعات خلاصه کاربر -->
    <div class="border-b border-delivery dark:border-hover">
      <div class="flex items-center gap-3">
        <div
            class="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
        >
          <RiUserLine class="size-6" />
        </div>

        <div class="min-w-0">
          <p class="truncate font-bold text-text">
            {{ userStore.user.name || 'کاربر فروشگاه' }}
          </p>

          <p class="mt-1 text-xs text-lightText">
            {{ userStore.user.phone || 'شماره موبایل ثبت نشده' }}
          </p>
        </div>
      </div>
    </div>

    <!-- منوی پروفایل -->
    <nav class="p-3">
      <ul class="space-y-1">
        <li
            v-for="item in menuItems"
            :key="item.to"
        >
          <NuxtLink
              :to="item.to"
              class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300"
              :class="
              isActive(item.to)
                ? 'bg-menu font-semibold text-text shadow-sm'
                : 'text-lightText hover:bg-menu/60 hover:text-text'
            "
          >
            <component
                :is="item.icon"
                class="size-5 shrink-0"
            />

            <span>
              {{ item.title }}
            </span>
          </NuxtLink>
        </li>
      </ul>

      <!-- خروج -->
      <div class="mt-3 border-t border-delivery dark:border-hover pt-3 ">
        <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 transition-colors duration-300 hover:bg-red-50 dark:hover:bg-red-950/30"
            @click="handleLogout"
        >
          <RiLogoutBoxRLine class="size-5 shrink-0" />

          <span>خروج از حساب</span>
        </button>
      </div>
    </nav>
  </div>
</template>