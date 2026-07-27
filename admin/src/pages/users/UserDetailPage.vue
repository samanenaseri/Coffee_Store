<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">جزئیات کاربر</h1>
      <Button icon="pi pi-arrow-right" label="بازگشت" severity="secondary" text @click="goBack" />
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>

    <template v-else-if="user">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <template #title>اطلاعات کاربر</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500">شناسه:</span>
                <span class="font-medium">{{ user.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">ایمیل:</span>
                <span>{{ user.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">تلفن:</span>
                <span>{{ user.phone || '-' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">نقش:</span>
                <Tag
                  :value="user.is_admin ? 'مدیر' : 'کاربر'"
                  :severity="user.is_admin ? 'danger' : 'info'"
                />
              </div>
              <div v-if="user.wallet" class="flex justify-between">
                <span class="text-gray-500">موجودی کیف پول:</span>
                <span class="font-medium">{{ formatPrice(user.wallet.balance) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">تاریخ عضویت:</span>
                <span>{{ formatDate(user.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">آخرین بروزرسانی:</span>
                <span>{{ formatDate(user.updated_at) }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>ویرایش اطلاعات</template>
          <template #content>
            <form @submit.prevent="saveUser" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">نام</label>
                <InputText v-model="form.name" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                <InputText v-model="form.email" class="w-full" type="email" />
              </div>
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">مدیر سیستم</label>
                <InputSwitch v-model="form.is_admin" />
              </div>
              <div class="flex justify-end">
                <Button
                  type="submit"
                  label="ذخیره تغییرات"
                  icon="pi pi-check"
                  :loading="saving"
                />
              </div>
            </form>
          </template>
        </Card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import api from '@/composables/useAdminApi'
import type { User } from '@/types'

import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import Tag from 'primevue/tag'

interface UserDetail extends User {
  orders_count?: number
  wallet?: { balance: number }
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

const user = ref<UserDetail | null>(null)
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  name: '',
  email: '',
  is_admin: false,
})

onMounted(() => {
  fetchUser()
})

async function fetchUser() {
  loading.value = true
  try {
    const res = await api.get(`/admin/users/${route.params.id}`)
    user.value = res.data
    if (user.value) {
      form.name = user.value.name
      form.email = user.value.email
      form.is_admin = user.value.is_admin
    }
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری اطلاعات کاربر انجام نشد', life: 3000 })
    router.push('/users')
  } finally {
    loading.value = false
  }
}

async function saveUser() {
  if (!user.value) return
  saving.value = true
  try {
    const res = await api.put(`/admin/users/${user.value.id}`, form)
    user.value = { ...user.value, ...res.data }
    toast.add({ severity: 'success', summary: 'موفق', detail: 'اطلاعات کاربر بروزرسانی شد', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بروزرسانی اطلاعات کاربر انجام نشد', life: 3000 })
  } finally {
    saving.value = false
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price) + ' ریال'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fa-IR')
}

function goBack() {
  router.push('/users')
}
</script>
