<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">تیکت پشتیبانی #{{ ticket?.id }}</h1>
      <Button icon="pi pi-arrow-right" label="بازگشت" severity="secondary" text @click="goBack" />
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>

    <template v-else-if="ticket">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card class="lg:col-span-1">
          <template #title>اطلاعات تیکت</template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500">موضوع:</span>
                <span class="font-medium">{{ ticket.subject }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">وضعیت:</span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(ticket.status)"
                >
                  {{ getStatusLabel(ticket.status) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">اولویت:</span>
                <span>{{ getPriorityLabel(ticket.priority) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">کاربر:</span>
                <span>{{ ticket.user?.name || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">تاریخ ایجاد:</span>
                <span>{{ formatDate(ticket.created_at) }}</span>
              </div>
            </div>

            <Divider />

            <div>
              <h4 class="font-medium text-gray-700 mb-2">تغییر وضعیت</h4>
              <div class="flex gap-2">
                <Dropdown
                  v-model="selectedStatus"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="flex-1"
                />
                <Button
                  icon="pi pi-check"
                  :loading="savingStatus"
                  @click="saveStatus"
                />
              </div>
            </div>
          </template>
        </Card>

        <Card class="lg:col-span-2">
          <template #title>پیام‌ها</template>
          <template #content>
            <div class="space-y-4 max-h-[500px] overflow-y-auto mb-4">
              <div v-if="ticket.description" class="flex justify-end">
                <div class="bg-blue-50 border border-blue-100 rounded-xl rounded-tl-none p-4 max-w-[80%]">
                  <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ ticket.description }}</p>
                  <p class="text-xs text-gray-400 mt-2">{{ ticket.user?.name }} - {{ formatDate(ticket.created_at) }}</p>
                </div>
              </div>

              <div
                v-for="reply in ticket.replies"
                :key="reply.id"
                :class="reply.is_admin_reply ? 'justify-start' : 'justify-end'"
                class="flex"
              >
                <div
                  :class="reply.is_admin_reply
                    ? 'bg-gray-50 border border-gray-200 rounded-xl rounded-tr-none'
                    : 'bg-blue-50 border border-blue-100 rounded-xl rounded-tl-none'"
                  class="p-4 max-w-[80%]"
                >
                  <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ reply.message }}</p>
                  <p class="text-xs text-gray-400 mt-2">
                    {{ reply.is_admin_reply ? 'مدیر' : reply.user?.name }} - {{ formatDate(reply.created_at) }}
                  </p>
                </div>
              </div>

              <p v-if="!ticket.replies?.length && !ticket.description" class="text-center text-gray-400 py-8">
                پیامی موجود نیست
              </p>
            </div>

            <Divider />

            <form @submit.prevent="sendReply" class="flex gap-2">
              <Textarea
                v-model="replyMessage"
                placeholder="پیام خود را بنویسید..."
                class="flex-1"
                rows="3"
                autoResize
              />
              <Button
                type="submit"
                icon="pi pi-send"
                :loading="sendingReply"
                :disabled="!replyMessage.trim()"
                severity="success"
              />
            </form>
          </template>
        </Card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import api from '@/composables/useAdminApi'
import type { SupportTicket } from '@/types'

import Card from 'primevue/card'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Divider from 'primevue/divider'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const ticket = ref<SupportTicket | null>(null)
const loading = ref(true)
const selectedStatus = ref('')
const savingStatus = ref(false)
const replyMessage = ref('')
const sendingReply = ref(false)

const statusOptions = [
  { label: 'باز', value: 'open' },
  { label: 'در حال بررسی', value: 'in_progress' },
  { label: 'بسته شده', value: 'closed' },
]

const statusMap: Record<string, { label: string; class: string }> = {
  open: { label: 'باز', class: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'در حال بررسی', class: 'bg-yellow-100 text-yellow-800' },
  closed: { label: 'بسته شده', class: 'bg-green-100 text-green-800' },
}

const priorityMap: Record<string, string> = {
  low: 'پایین',
  medium: 'متوسط',
  high: 'بالا',
  urgent: 'فوری',
}

onMounted(() => {
  fetchTicket()
})

async function fetchTicket() {
  loading.value = true
  try {
    const res = await api.get(`/admin/support/${route.params.id}`)
    ticket.value = res.data
    if (ticket.value) {
      selectedStatus.value = ticket.value.status
    }
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری تیکت انجام نشد', life: 3000 })
    router.push('/support')
  } finally {
    loading.value = false
  }
}

async function saveStatus() {
  if (!ticket.value) return
  savingStatus.value = true
  try {
    await api.put(`/admin/support/${ticket.value.id}/status`, {
      status: selectedStatus.value,
    })
    ticket.value.status = selectedStatus.value
    toast.add({ severity: 'success', summary: 'موفق', detail: 'وضعیت تیکت بروزرسانی شد', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بروزرسانی وضعیت انجام نشد', life: 3000 })
  } finally {
    savingStatus.value = false
  }
}

async function sendReply() {
  if (!ticket.value || !replyMessage.value.trim()) return
  sendingReply.value = true
  try {
    const res = await api.post(`/admin/support/${ticket.value.id}/reply`, {
      message: replyMessage.value,
    })
    if (!ticket.value.replies) ticket.value.replies = []
    ticket.value.replies.push(res.data)
    replyMessage.value = ''
    toast.add({ severity: 'success', summary: 'موفق', detail: 'پیام ارسال شد', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'ارسال پیام انجام نشد', life: 3000 })
  } finally {
    sendingReply.value = false
  }
}

function getStatusClass(status: string): string {
  return statusMap[status]?.class || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: string): string {
  return statusMap[status]?.label || status
}

function getPriorityLabel(priority: string): string {
  return priorityMap[priority] || priority
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fa-IR')
}

function goBack() {
  router.push('/support')
}
</script>
