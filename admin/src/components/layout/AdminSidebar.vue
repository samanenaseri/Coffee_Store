<template>
  <aside
    class="fixed top-0 right-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 flex flex-col"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center justify-center border-b border-gray-700">
      <router-link to="/" class="flex items-center gap-2">
        <i class="pi pi-coffee text-2xl text-primary-400"></i>
        <span v-if="!collapsed" class="text-lg font-bold">پنل مدیریت</span>
      </router-link>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-2">
        <li v-for="item in menuItems" :key="item.to">
          <router-link
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-gray-800"
            :class="{ 'bg-primary-600 text-white': isActive(item.to) }"
          >
            <i :class="item.icon" class="text-lg"></i>
            <span v-if="!collapsed">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Collapse Toggle -->
    <div class="p-2 border-t border-gray-700">
      <button
        @click="$emit('toggle')"
        class="w-full flex items-center justify-center py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <i :class="collapsed ? 'pi pi-angle-left' : 'pi pi-angle-right'" class="text-lg"></i>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (e: 'toggle'): void
}>()

const route = useRoute()

const menuItems = [
  { to: '/', icon: 'pi pi-home', label: 'داشبورد' },
  { to: '/homepage', icon: 'pi pi-desktop', label: 'صفحه اول' },
  { to: '/products', icon: 'pi pi-box', label: 'محصولات' },
  { to: '/product-comments', icon: 'pi pi-comments', label: 'نظرات محصولات' },
  { to: '/categories', icon: 'pi pi-tags', label: 'دسته‌بندی‌ها' },
  { to: '/menu-categories', icon: 'pi pi-list', label: 'دسته‌بندی منو' },
  { to: '/menu-items', icon: 'pi pi-bars', label: 'آیتم‌های منو' },
  { to: '/orders', icon: 'pi pi-shopping-cart', label: 'سفارشات' },
  { to: '/articles', icon: 'pi pi-file-edit', label: 'مقالات' },
  { to: '/gallery', icon: 'pi pi-images', label: 'گالری' },
  { to: '/staff', icon: 'pi pi-users', label: 'کارکنان' },
  { to: '/testimonials', icon: 'pi pi-comment', label: 'نظرات مشتریان' },
  { to: '/users', icon: 'pi pi-user', label: 'کاربران' },
  { to: '/support', icon: 'pi pi-headphones', label: 'پشتیبانی' },
  { to: '/settings', icon: 'pi pi-cog', label: 'تنظیمات' },
  { to: '/settings/header-footer', icon: 'pi pi-arrow-circle-left', label: 'هدر و فوتر' },
  { to: '/settings/about', icon: 'pi pi-info-circle', label: 'درباره ما' },
  { to: '/settings/contact', icon: 'pi pi-envelope', label: 'تماس با ما' },
  { to: '/settings/seo', icon: 'pi pi-search', label: 'تنظیمات سئو' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  if (path === '/settings') return route.path === '/settings'
  return route.path.startsWith(path)
}
</script>
