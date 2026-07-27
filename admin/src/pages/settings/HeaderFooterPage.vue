<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">تنظیمات هدر و فوتر</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
    </div>

    <template v-else>
      <!-- Header Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-layout-top-line text-amber-600"></i>
          تنظیمات هدر
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">نام فروشگاه</label>
            <InputText v-model="form.store_name" class="w-full" placeholder="نام فروشگاه" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">شعار تبلیغاتی</label>
            <InputText v-model="form.store_slogan" class="w-full" placeholder="شعار تبلیغاتی" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">لوگوی اصلی</label>
            <p class="text-xs text-gray-400 mb-2">
              لوگوی پیش‌فرض سایت. اگر فقط همین را بگذارید، در همه حالت‌ها همین لوگو نمایش داده می‌شود.
            </p>
            <div class="flex items-center gap-4">
              <div v-if="form.store_logo" class="relative">
                <img :src="mediaUrl(form.store_logo)" :key="form.store_logo" alt="لوگو" class="h-20 w-auto border rounded-lg p-2" />
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="danger"
                  rounded
                  class="absolute -top-2 -left-2"
                  @click="form.store_logo = ''"
                />
              </div>
              <div class="flex-1">
                <InputText v-model="form.store_logo" class="w-full" placeholder="آدرس تصویر لوگو" />
              </div>
              <div>
                <label class="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2 transition-colors">
                  <i class="pi pi-upload"></i>
                  <span class="text-sm">آپلود</span>
                  <input type="file" accept="image/*" class="hidden" @change="uploadLogo" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              لوگوی جایگزین
              <span class="text-gray-400 font-normal">(اختیاری)</span>
            </label>
            <p class="text-xs text-gray-400 mb-2">
              برای هدر بعد از اسکرول. خالی بگذارید تا همان لوگوی اصلی استفاده شود.
            </p>
            <div class="flex items-center gap-4">
              <div v-if="form.store_dark_logo" class="relative">
                <img :src="mediaUrl(form.store_dark_logo)" :key="form.store_dark_logo" alt="لوگوی جایگزین" class="h-20 w-auto border rounded-lg p-2 bg-gray-100" />
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="danger"
                  rounded
                  class="absolute -top-2 -left-2"
                  @click="form.store_dark_logo = ''"
                />
              </div>
              <div class="flex-1">
                <InputText v-model="form.store_dark_logo" class="w-full" placeholder="آدرس تصویر لوگوی جایگزین (اختیاری)" />
              </div>
              <div>
                <label class="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2 transition-colors">
                  <i class="pi pi-upload"></i>
                  <span class="text-sm">آپلود</span>
                  <input type="file" accept="image/*" class="hidden" @change="uploadDarkLogo" />
                </label>
              </div>
            </div>
          </div>

          <div class="border-t pt-4 mt-2">
            <h3 class="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
              <i class="pi pi-eye text-amber-600"></i>
              لوگوی صفحات داخلی
            </h3>
            <p class="text-xs text-gray-400 mb-3">
              لوگوهایی که در صفحات غیر از صفحه اصلی نمایش داده می‌شوند.
            </p>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">لوگوی صفحات داخلی (حالت روز)</label>
                <p class="text-xs text-gray-400 mb-2">در حالت عادی (پس‌زمینه روشن) نمایش داده می‌شود</p>
                <div class="flex items-center gap-4">
                  <div v-if="form.store_inner_dark_logo" class="relative">
                    <img :src="mediaUrl(form.store_inner_dark_logo)" :key="form.store_inner_dark_logo" alt="لوگوی صفحات داخلی - روز" class="h-20 w-auto border rounded-lg p-2" />
                    <Button
                      type="button"
                      icon="pi pi-times"
                      severity="danger"
                      rounded
                      class="absolute -top-2 -left-2"
                      @click="form.store_inner_dark_logo = ''"
                    />
                  </div>
                  <div class="flex-1">
                    <InputText v-model="form.store_inner_dark_logo" class="w-full" placeholder="آدرس تصویر لوگوی صفحات داخلی (روز)" />
                  </div>
                  <div>
                    <label class="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2 transition-colors">
                      <i class="pi pi-upload"></i>
                      <span class="text-sm">آپلود</span>
                      <input type="file" accept="image/*" class="hidden" @change="uploadInnerDarkLogo" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">لوگوی صفحات داخلی (حالت شب)</label>
                <p class="text-xs text-gray-400 mb-2">در حالت شب (پس‌زمینه تیره) نمایش داده می‌شود</p>
                <div class="flex items-center gap-4">
                  <div v-if="form.store_inner_logo" class="relative">
                    <img :src="mediaUrl(form.store_inner_logo)" :key="form.store_inner_logo" alt="لوگوی صفحات داخلی - شب" class="h-20 w-auto border rounded-lg p-2 bg-gray-100" />
                    <Button
                      type="button"
                      icon="pi pi-times"
                      severity="danger"
                      rounded
                      class="absolute -top-2 -left-2"
                      @click="form.store_inner_logo = ''"
                    />
                  </div>
                  <div class="flex-1">
                    <InputText v-model="form.store_inner_logo" class="w-full" placeholder="آدرس تصویر لوگوی صفحات داخلی (شب)" />
                  </div>
                  <div>
                    <label class="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2 transition-colors">
                      <i class="pi pi-upload"></i>
                      <span class="text-sm">آپلود</span>
                      <input type="file" accept="image/*" class="hidden" @change="uploadInnerLogo" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">لینک‌های منوی هدر</label>
            <p class="text-xs text-gray-400 mb-3">
              با گرفتن آیکن
              <i class="pi pi-bars text-[10px] mx-0.5"></i>
              لینک‌ها را بکشید تا ترتیب منو عوض شود. سپس «ذخیره تنظیمات» را بزنید.
            </p>
            <div v-if="headerLinks.length === 0" class="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2">
              هنوز لینکی برای منوی هدر تعریف نشده. روی «افزودن لینک جدید» بزنید.
            </div>
            <div class="space-y-2">
              <div
                v-for="(link, index) in headerLinks"
                :key="link._id"
                class="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-transparent transition-all"
                :class="{
                  'opacity-50 border-amber-300 bg-amber-50': dragState.list === 'header' && dragState.from === index,
                  'ring-2 ring-amber-400 ring-offset-1': dragState.list === 'header' && dragState.over === index && dragState.from !== index,
                }"
                @dragover.prevent="onDragOver('header', index, $event)"
                @dragenter.prevent="onDragEnter('header', index)"
                @drop.prevent="onDrop('header', index)"
              >
                <button
                  type="button"
                  class="drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-amber-700 px-1 py-2 touch-none select-none"
                  title="جابه‌جایی با درگ"
                  aria-label="جابه‌جایی"
                  draggable="true"
                  @dragstart.stop="onDragStart('header', index, $event)"
                  @dragend="onDragEnd"
                >
                  <i class="pi pi-bars"></i>
                </button>
                <span class="text-xs text-gray-400 w-6 text-center tabular-nums shrink-0">{{ index + 1 }}</span>
                <InputText v-model="link.label" class="flex-1" placeholder="متن لینک (مثلاً محصولات)" />
                <InputText v-model="link.url" class="flex-1" placeholder="آدرس (مثلاً /products)" />
                <Button type="button" icon="pi pi-trash" severity="danger" text rounded @click="removeHeaderLink(index)" />
              </div>
            </div>
            <Button type="button" label="افزودن لینک جدید" icon="pi pi-plus" text class="mt-2" @click="addHeaderLink" />
          </div>
        </div>
      </div>

      <!-- Footer Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="ri-layout-bottom-line text-amber-600"></i>
          تنظیمات فوتر
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات فوتر</label>
            <Textarea v-model="form.store_description" class="w-full" rows="3" placeholder="توضیحات فوتر" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر پس‌زمینه فوتر</label>
            <p class="text-xs text-gray-400 mb-2">
              تصویر را آپلود کنید یا آدرس URL را وارد کنید. بعد از آپلود حتماً «ذخیره تنظیمات» را بزنید.
            </p>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div v-if="form.footer_background" class="relative shrink-0">
                <img
                  :src="mediaUrl(form.footer_background)"
                  :key="form.footer_background"
                  alt="پس‌زمینه فوتر"
                  class="h-24 w-40 object-cover border rounded-lg"
                />
                <Button
                  type="button"
                  icon="pi pi-times"
                  severity="danger"
                  rounded
                  class="absolute -top-2 -left-2"
                  @click="form.footer_background = ''"
                />
              </div>
              <div class="flex-1 flex flex-col gap-2 sm:flex-row sm:items-center">
                <InputText
                  v-model="form.footer_background"
                  class="w-full"
                  placeholder="/images/footer.webp یا آدرس آپلود"
                />
                <label class="cursor-pointer shrink-0 bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 flex items-center justify-center gap-2 transition-colors">
                  <i class="pi pi-upload"></i>
                  <span class="text-sm">آپلود</span>
                  <input type="file" accept="image/*" class="hidden" @change="uploadFooterBackground" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">لینک‌های فوتر</label>
            <p class="text-xs text-gray-400 mb-3">
              با گرفتن آیکن
              <i class="pi pi-bars text-[10px] mx-0.5"></i>
              لینک‌ها را بکشید تا ترتیب منو عوض شود. سپس «ذخیره تنظیمات» را بزنید.
            </p>
            <div v-if="footerLinks.length === 0" class="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2">
              هنوز لینکی برای فوتر تعریف نشده. روی «افزودن لینک جدید» بزنید.
            </div>
            <div class="space-y-2">
              <div
                v-for="(link, index) in footerLinks"
                :key="link._id"
                class="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-transparent transition-all"
                :class="{
                  'opacity-50 border-amber-300 bg-amber-50': dragState.list === 'footer' && dragState.from === index,
                  'ring-2 ring-amber-400 ring-offset-1': dragState.list === 'footer' && dragState.over === index && dragState.from !== index,
                }"
                @dragover.prevent="onDragOver('footer', index, $event)"
                @dragenter.prevent="onDragEnter('footer', index)"
                @drop.prevent="onDrop('footer', index)"
              >
                <button
                  type="button"
                  class="drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-amber-700 px-1 py-2 touch-none select-none"
                  title="جابه‌جایی با درگ"
                  aria-label="جابه‌جایی"
                  draggable="true"
                  @dragstart.stop="onDragStart('footer', index, $event)"
                  @dragend="onDragEnd"
                >
                  <i class="pi pi-bars"></i>
                </button>
                <span class="text-xs text-gray-400 w-6 text-center tabular-nums shrink-0">{{ index + 1 }}</span>
                <InputText v-model="link.label" class="flex-1" placeholder="متن لینک (مثلاً محصولات)" />
                <InputText v-model="link.url" class="flex-1" placeholder="آدرس (مثلاً /products)" />
                <Button type="button" icon="pi pi-trash" severity="danger" text rounded @click="removeFooterLink(index)" />
              </div>
            </div>
            <Button type="button" label="افزودن لینک جدید" icon="pi pi-plus" text class="mt-2" @click="addFooterLink" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
              <InputText v-model="form.store_phone" class="w-full" placeholder="02112345678" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">موبایل</label>
              <InputText v-model="form.store_mobile" class="w-full" placeholder="09121234567" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
              <InputText v-model="form.store_email" class="w-full" placeholder="info@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ساعات کاری</label>
              <InputText v-model="form.store_working_hours" class="w-full" placeholder="۸ صبح تا ۱۲ شب" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
            <InputText v-model="form.store_address" class="w-full" placeholder="آدرس فروشگاه" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">اینستاگرام</label>
              <InputText v-model="form.store_instagram" class="w-full" placeholder="@username" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تلگرام</label>
              <InputText v-model="form.store_telegram" class="w-full" placeholder="@username" />
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <Button
          label="ذخیره تنظیمات"
          icon="pi pi-check"
          :loading="saving"
          @click="saveSettings"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import api, { uploadAdminFile } from '@/composables/useAdminApi'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

interface MenuLink {
  _id: string
  label: string
  url: string
}

type LinkList = 'header' | 'footer'

const toast = useToast()

/** Resolve /storage/* so admin preview loads from Laravel. */
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1')
  .replace(/\/api\/v1\/?$/i, '')
  .replace(/\/api\/?$/i, '')
  .replace(/\/$/, '')

function mediaUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (
    trimmed.startsWith('http://')
    || trimmed.startsWith('https://')
    || trimmed.startsWith('blob:')
    || trimmed.startsWith('data:')
  ) {
    return trimmed
  }
  if (trimmed.startsWith('/')) return API_ORIGIN + trimmed
  return trimmed
}

const loading = ref(true)
const saving = ref(false)

const headerLinks = ref<MenuLink[]>([])
const footerLinks = ref<MenuLink[]>([])

const dragState = ref<{
  list: LinkList | null
  from: number | null
  over: number | null
}>({
  list: null,
  from: null,
  over: null,
})

const form = ref({
  store_name: '',
  store_slogan: '',
  store_logo: '',
  store_dark_logo: '',
  store_inner_logo: '',
  store_inner_dark_logo: '',
  store_description: '',
  footer_background: '',
  store_phone: '',
  store_mobile: '',
  store_email: '',
  store_address: '',
  store_working_hours: '',
  store_instagram: '',
  store_telegram: '',
})

let idCounter = 0
function nextId() {
  idCounter += 1
  return `link_${Date.now()}_${idCounter}`
}

/**
 * Parse menu links from API. Handles:
 * - JSON string
 * - already-parsed array
 * - double-encoded JSON string
 */
function normalizeLinks(raw: unknown): MenuLink[] {
  let list: unknown = raw

  // Unwrap string JSON (possibly double-encoded)
  for (let i = 0; i < 3 && typeof list === 'string'; i++) {
    const trimmed = list.trim()
    if (!trimmed) return []
    try {
      list = JSON.parse(trimmed)
    } catch {
      return []
    }
  }

  if (!Array.isArray(list)) return []

  return list
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object' && !Array.isArray(item))
    .map(item => ({
      _id: nextId(),
      label: String(item.label ?? item.title ?? item.name ?? '').trim(),
      url: String(item.url ?? item.href ?? item.path ?? '').trim(),
    }))
}

function linksForSave(links: MenuLink[]) {
  return links
    .map(({ label, url }) => ({
      label: String(label ?? '').trim(),
      url: String(url ?? '').trim(),
    }))
    .filter(link => link.label !== '' || link.url !== '')
}

function getList(list: LinkList) {
  return list === 'header' ? headerLinks : footerLinks
}

function onDragStart(list: LinkList, index: number, event: DragEvent) {
  dragState.value = { list, from: index, over: index }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragEnter(list: LinkList, index: number) {
  if (dragState.value.list !== list) return
  dragState.value.over = index
}

function onDragOver(list: LinkList, index: number, event: DragEvent) {
  if (dragState.value.list !== list) return
  dragState.value.over = index
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onDrop(list: LinkList, toIndex: number) {
  if (dragState.value.list !== list || dragState.value.from === null) return

  const fromIndex = dragState.value.from
  if (fromIndex === toIndex) {
    onDragEnd()
    return
  }

  const target = getList(list)
  const items = [...target.value]
  if (fromIndex < 0 || fromIndex >= items.length) {
    onDragEnd()
    return
  }
  const [moved] = items.splice(fromIndex, 1)
  if (!moved) {
    onDragEnd()
    return
  }
  items.splice(toIndex, 0, moved)
  // Force new array reference for reliable Vue reactivity
  target.value = items

  onDragEnd()
}

function onDragEnd() {
  dragState.value = { list: null, from: null, over: null }
}

onMounted(() => {
  fetchSettings()
})

async function fetchSettings() {
  loading.value = true
  try {
    const res = await api.get('/admin/settings')
    const data = res.data
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      for (const [key, value] of Object.entries(data)) {
        if (key in form.value && typeof value === 'string') {
          ;(form.value as any)[key] = value
        }
      }
      // Always apply (including empty []) so UI matches DB
      if ('header_links' in data) {
        headerLinks.value = normalizeLinks(data.header_links)
      }
      if ('footer_links' in data) {
        footerLinks.value = normalizeLinks(data.footer_links)
      }
    } else if (Array.isArray(data)) {
      for (const item of data) {
        if (item.key in form.value) {
          ;(form.value as any)[item.key] = item.value ?? ''
        }
        if (item.key === 'header_links') {
          headerLinks.value = normalizeLinks(item.value)
        }
        if (item.key === 'footer_links') {
          footerLinks.value = normalizeLinks(item.value)
        }
      }
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری تنظیمات انجام نشد', life: 3000 })
    console.error('Settings load error:', e)
  } finally {
    loading.value = false
  }
}

async function saveSettings() {
  saving.value = true
  try {
    const raw: Record<string, any> = { ...form.value }
    const payload: Record<string, string> = {}
    for (const [key, value] of Object.entries(raw)) {
      payload[key] = value == null ? '' : String(value)
    }
    payload.header_links = JSON.stringify(linksForSave(headerLinks.value))
    payload.footer_links = JSON.stringify(linksForSave(footerLinks.value))
    await api.put('/admin/settings', { settings: payload })
    // Keep local state in sync with what was saved (strip empty rows)
    headerLinks.value = normalizeLinks(payload.header_links)
    footerLinks.value = normalizeLinks(payload.footer_links)
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: `تنظیمات ذخیره شد (${headerLinks.value.length} لینک هدر، ${footerLinks.value.length} لینک فوتر)`,
      life: 3000,
    })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'ذخیره تنظیمات انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
    console.error('Settings save error:', e)
  } finally {
    saving.value = false
  }
}

function addHeaderLink() {
  headerLinks.value = [
    ...headerLinks.value,
    { _id: nextId(), label: 'لینک جدید', url: '/' },
  ]
  toast.add({
    severity: 'info',
    summary: 'لینک اضافه شد',
    detail: 'متن و آدرس را ویرایش کنید، سپس «ذخیره تنظیمات» را بزنید.',
    life: 2500,
  })
}

function removeHeaderLink(index: number) {
  headerLinks.value = headerLinks.value.filter((_, i) => i !== index)
}

function addFooterLink() {
  footerLinks.value = [
    ...footerLinks.value,
    { _id: nextId(), label: 'لینک جدید', url: '/' },
  ]
  toast.add({
    severity: 'info',
    summary: 'لینک اضافه شد',
    detail: 'متن و آدرس را ویرایش کنید، سپس «ذخیره تنظیمات» را بزنید.',
    life: 2500,
  })
}

function removeFooterLink(index: number) {
  footerLinks.value = footerLinks.value.filter((_, i) => i !== index)
}

async function uploadLogo(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const result = await uploadAdminFile(file, 'logos', { keepOriginal: true })
    form.value.store_logo = result.url
    const ext = (result.url.split('.').pop() || '').toLowerCase()
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: `لوگو آپلود شد (${ext || 'فایل'}). حتماً «ذخیره تنظیمات» را بزنید.`,
      life: 4000,
    })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'آپلود لوگو انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
  }
  input.value = ''
}

async function uploadDarkLogo(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const result = await uploadAdminFile(file, 'logos', { keepOriginal: true })
    form.value.store_dark_logo = result.url
    const ext = (result.url.split('.').pop() || '').toLowerCase()
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: `لوگوی جایگزین آپلود شد (${ext || 'فایل'}). حتماً «ذخیره تنظیمات» را بزنید.`,
      life: 4000,
    })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'آپلود لوگوی تیره انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
  }
  input.value = ''
}

async function uploadInnerLogo(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const result = await uploadAdminFile(file, 'logos', { keepOriginal: true })
    form.value.store_inner_logo = result.url
    const ext = (result.url.split('.').pop() || '').toLowerCase()
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: `لوگوی صفحات داخلی (شب) آپلود شد (${ext || 'فایل'}). حتماً «ذخیره تنظیمات» را بزنید.`,
      life: 4000,
    })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'آپلود لوگو انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
  }
  input.value = ''
}

async function uploadInnerDarkLogo(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const result = await uploadAdminFile(file, 'logos', { keepOriginal: true })
    form.value.store_inner_dark_logo = result.url
    const ext = (result.url.split('.').pop() || '').toLowerCase()
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: `لوگوی صفحات داخلی (روز) آپلود شد (${ext || 'فایل'}). حتماً «ذخیره تنظیمات» را بزنید.`,
      life: 4000,
    })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'آپلود لوگو انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
  }
  input.value = ''
}

async function uploadFooterBackground(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const result = await uploadAdminFile(file, 'footer', { keepOriginal: true })
    form.value.footer_background = result.url
    const ext = (result.url.split('.').pop() || '').toLowerCase()
    toast.add({
      severity: 'success',
      summary: 'موفق',
      detail: `پس‌زمینه فوتر آپلود شد (${ext || 'فایل'}). حتماً «ذخیره تنظیمات» را بزنید.`,
      life: 4000,
    })
  } catch (e: any) {
    const detail = e?.response?.data?.message || e?.message || 'آپلود تصویر پس‌زمینه انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail, life: 5000 })
  }
  input.value = ''
}
</script>

<style scoped>
.drag-handle {
  user-select: none;
}
</style>
