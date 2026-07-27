<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">تعداد کاربران</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ formatNumber(stats.total_users) }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <i class="pi pi-users text-xl text-blue-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">تعداد سفارشات</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ formatNumber(stats.total_orders) }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <i class="pi pi-shopping-cart text-xl text-green-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">تعداد محصولات</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ formatNumber(stats.total_products) }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <i class="pi pi-box text-xl text-purple-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">مجموع درآمد</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ formatPrice(stats.total_revenue) }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
            <i class="pi pi-wallet text-xl text-primary-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">درآمد ماهانه</h2>
      <div class="h-80">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">آخرین سفارشات</h2>
        <router-link to="/orders" class="text-sm text-primary-600 hover:text-primary-700">
          مشاهده همه
          <i class="pi pi-arrow-left mr-1"></i>
        </router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-right py-3 px-4 font-medium text-gray-500">شماره سفارش</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">کاربر</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">مبلغ</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">وضعیت</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in stats.recent_orders" :key="order.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-3 px-4 font-medium">#{{ order.id }}</td>
              <td class="py-3 px-4">{{ order.user?.name || '-' }}</td>
              <td class="py-3 px-4">{{ formatPrice(order.final_amount) }}</td>
              <td class="py-3 px-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="statusClass(order.status)"
                >
                  {{ statusLabel(order.status) }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-500">{{ formatDate(order.created_at) }}</td>
            </tr>
            <tr v-if="!stats.recent_orders?.length">
              <td colspan="5" class="py-8 text-center text-gray-400">سفارشی یافت نشد</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import api from '@/composables/useAdminApi'
import type { DashboardStats } from '@/types'

Chart.register(...registerables)

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const stats = ref<DashboardStats>({
  total_users: 0,
  total_orders: 0,
  total_products: 0,
  total_revenue: 0,
  recent_orders: [],
  monthly_revenue: [],
})

onMounted(async () => {
  try {
    const response = await api.get('/admin/dashboard')
    stats.value = response.data
    await nextTick()
    renderChart()
  } catch (e) {
    console.error('Failed to load dashboard:', e)
  }
})

function renderChart() {
  if (!chartCanvas.value || !stats.value.monthly_revenue?.length) return

  const months = stats.value.monthly_revenue.map((m) => m.month)
  const revenues = stats.value.monthly_revenue.map((m) => m.revenue)

  new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'درآمد (ریال)',
          data: revenues,
          backgroundColor: 'rgba(214, 128, 32, 0.8)',
          borderColor: 'rgba(214, 128, 32, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              const num = Number(value)
              if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'M'
              if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
              if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
              return num.toString()
            },
          },
        },
      },
    },
  })
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('fa-IR').format(num)
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price) + ' ریال'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fa-IR')
}

function statusClass(status: string) {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'در انتظار',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل شده',
    cancelled: 'لغو شده',
    returned: 'مرجوع شده',
  }
  return labels[status] || status
}
</script>
