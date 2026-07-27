<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
    <!-- Right Side -->
    <div class="flex items-center gap-4">
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h1>
    </div>

    <!-- Left Side -->
    <div class="flex items-center gap-4">
      <!-- Notifications -->
      <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
        <i class="pi pi-bell text-xl text-gray-600"></i>
        <span class="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- User Menu -->
      <div class="relative">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <i class="pi pi-user text-primary-600"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ user?.name || 'ادمین' }}</span>
          <i class="pi pi-chevron-down text-xs text-gray-500"></i>
        </button>

        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showUserMenu"
            class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <div class="px-4 py-2 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-800">{{ user?.name }}</p>
              <p class="text-xs text-gray-500">{{ user?.email }}</p>
            </div>
            <button
              @click="handleLogout"
              class="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <i class="pi pi-sign-out"></i>
              خروج
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const route = useRoute()
const router = useRouter()
const { user, logout } = useAdminAuth()
const showUserMenu = ref(false)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: 'داشبورد',
    products: 'مدیریت محصولات',
    'products-create': 'افزودن محصول',
    'products-edit': 'ویرایش محصول',
    categories: 'مدیریت دسته‌بندی‌ها',
    'categories-create': 'افزودن دسته‌بندی',
    'categories-edit': 'ویرایش دسته‌بندی',
    homepage: 'مدیریت صفحه اول',
    'menu-categories': 'مدیریت دسته‌بندی منو',
    'menu-categories-create': 'افزودن دسته‌بندی منو',
    'menu-categories-edit': 'ویرایش دسته‌بندی منو',
    'menu-items': 'مدیریت آیتم‌های منو',
    'menu-items-create': 'افزودن آیتم منو',
    'menu-items-edit': 'ویرایش آیتم منو',
    orders: 'مدیریت سفارشات',
    'orders-detail': 'جزئیات سفارش',
    articles: 'مدیریت مقالات',
    'articles-create': 'افزودن مقاله',
    'articles-edit': 'ویرایش مقاله',
    gallery: 'مدیریت گالری',
    'gallery-create': 'افزودن تصویر',
    'gallery-edit': 'ویرایش تصویر',
    staff: 'مدیریت کارکنان',
    'staff-create': 'افزودن کارمند',
    'staff-edit': 'ویرایش کارمند',
    testimonials: 'مدیریت نظرات',
    'testimonials-create': 'افزودن نظر',
    'testimonials-edit': 'ویرایش نظر',
    users: 'مدیریت کاربران',
    'users-detail': 'جزئیات کاربر',
    support: 'مدیریت پشتیبانی',
    'support-detail': 'جزئیات تیکت',
    settings: 'تنظیمات',
  }
  return titles[route.name as string] || 'پنل مدیریت'
})

async function handleLogout() {
  showUserMenu.value = false
  await logout()
  router.push('/login')
}
</script>
