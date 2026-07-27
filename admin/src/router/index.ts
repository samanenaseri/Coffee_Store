import { createRouter, createWebHistory } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue'),
        },
        // Products
        {
          path: 'products',
          name: 'products',
          component: () => import('@/pages/products/ProductsPage.vue'),
        },
        {
          path: 'products/new',
          name: 'products-create',
          component: () => import('@/pages/products/ProductEditPage.vue'),
        },
        {
          path: 'products/:id/edit',
          name: 'products-edit',
          component: () => import('@/pages/products/ProductEditPage.vue'),
        },
        // Categories
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/pages/categories/CategoriesPage.vue'),
        },
        {
          path: 'categories/new',
          name: 'categories-create',
          component: () => import('@/pages/categories/CategoryEditPage.vue'),
        },
        {
          path: 'categories/:id/edit',
          name: 'categories-edit',
          component: () => import('@/pages/categories/CategoryEditPage.vue'),
        },
        // Menu Categories
        {
          path: 'menu-categories',
          name: 'menu-categories',
          component: () => import('@/pages/menu/MenuCategoriesPage.vue'),
        },
        {
          path: 'menu-categories/new',
          name: 'menu-categories-create',
          component: () => import('@/pages/menu/MenuCategoryEditPage.vue'),
        },
        {
          path: 'menu-categories/:id/edit',
          name: 'menu-categories-edit',
          component: () => import('@/pages/menu/MenuCategoryEditPage.vue'),
        },
        // Menu Items
        {
          path: 'menu-items',
          name: 'menu-items',
          component: () => import('@/pages/menu/MenuItemsPage.vue'),
        },
        {
          path: 'menu-items/new',
          name: 'menu-items-create',
          component: () => import('@/pages/menu/MenuItemEditPage.vue'),
        },
        {
          path: 'menu-items/:id/edit',
          name: 'menu-items-edit',
          component: () => import('@/pages/menu/MenuItemEditPage.vue'),
        },
        // Orders
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/pages/orders/OrdersPage.vue'),
        },
        {
          path: 'orders/:id',
          name: 'orders-detail',
          component: () => import('@/pages/orders/OrderDetailPage.vue'),
        },
        // Articles
        {
          path: 'articles',
          name: 'articles',
          component: () => import('@/pages/articles/ArticlesPage.vue'),
        },
        {
          path: 'articles/new',
          name: 'articles-create',
          component: () => import('@/pages/articles/ArticleEditPage.vue'),
        },
        {
          path: 'articles/:id/edit',
          name: 'articles-edit',
          component: () => import('@/pages/articles/ArticleEditPage.vue'),
        },
        // Gallery
        {
          path: 'gallery',
          name: 'gallery',
          component: () => import('@/pages/gallery/GalleryPage.vue'),
        },
        {
          path: 'gallery/new',
          name: 'gallery-create',
          component: () => import('@/pages/gallery/GalleryEditPage.vue'),
        },
        {
          path: 'gallery/:id/edit',
          name: 'gallery-edit',
          component: () => import('@/pages/gallery/GalleryEditPage.vue'),
        },
        // Staff
        {
          path: 'staff',
          name: 'staff',
          component: () => import('@/pages/staff/StaffPage.vue'),
        },
        {
          path: 'staff/new',
          name: 'staff-create',
          component: () => import('@/pages/staff/StaffEditPage.vue'),
        },
        {
          path: 'staff/:id/edit',
          name: 'staff-edit',
          component: () => import('@/pages/staff/StaffEditPage.vue'),
        },
        // Product comments
        {
          path: 'product-comments',
          name: 'product-comments',
          component: () => import('@/pages/comments/ProductCommentsPage.vue'),
        },
        // Testimonials
        {
          path: 'testimonials',
          name: 'testimonials',
          component: () => import('@/pages/testimonials/TestimonialsPage.vue'),
        },
        {
          path: 'testimonials/new',
          name: 'testimonials-create',
          component: () => import('@/pages/testimonials/TestimonialEditPage.vue'),
        },
        {
          path: 'testimonials/:id/edit',
          name: 'testimonials-edit',
          component: () => import('@/pages/testimonials/TestimonialEditPage.vue'),
        },
        // Users
        {
          path: 'users',
          name: 'users',
          component: () => import('@/pages/users/UsersPage.vue'),
        },
        {
          path: 'users/:id',
          name: 'users-detail',
          component: () => import('@/pages/users/UserDetailPage.vue'),
        },
        // Support
        {
          path: 'support',
          name: 'support',
          component: () => import('@/pages/support/SupportPage.vue'),
        },
        {
          path: 'support/:id',
          name: 'support-detail',
          component: () => import('@/pages/support/TicketDetailPage.vue'),
        },
        // Homepage
        {
          path: 'homepage',
          name: 'homepage',
          component: () => import('@/pages/homepage/HomepageSectionsPage.vue'),
        },
        // Settings
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/settings/SettingsPage.vue'),
        },
        {
          path: 'settings/header-footer',
          name: 'settings-header-footer',
          component: () => import('@/pages/settings/HeaderFooterPage.vue'),
        },
        {
          path: 'settings/about',
          name: 'settings-about',
          component: () => import('@/pages/settings/AboutPage.vue'),
        },
        {
          path: 'settings/contact',
          name: 'settings-contact',
          component: () => import('@/pages/settings/ContactPage.vue'),
        },
        {
          path: 'settings/seo',
          name: 'settings-seo',
          component: () => import('@/pages/settings/SeoPage.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const { isLoggedIn, loadStoredUser } = useAdminAuth()
  loadStoredUser()

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next({ name: 'login' })
  } else if (to.meta.guest && isLoggedIn.value) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
