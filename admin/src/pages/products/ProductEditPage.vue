<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isEdit ? 'ویرایش محصول' : 'افزودن محصول' }}
      </h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form @submit.prevent="save" class="space-y-6 max-w-3xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان</label>
            <InputText v-model="form.title" class="w-full" required @input="onTitleChange" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">اسلاگ</label>
            <InputText v-model="form.slug" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">قیمت پایه (ریال)</label>
            <input
              v-model.number="form.price"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
              min="0"
              :disabled="form.weight_packages.length > 0"
            />
            <p v-if="form.weight_packages.length > 0" class="text-xs text-gray-500 mt-1">
              با تعریف بسته‌های وزنی، قیمت پایه از اولین بسته تنظیم می‌شود.
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">قیمت هر کیلوگرم (ریال)</label>
            <input
              v-model.number="form.price_per_kg"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min="0"
              placeholder="برای محاسبه خودکار قیمت بسته‌ها"
            />
            <p class="text-xs text-gray-500 mt-1">
              اختیاری — برای محاسبه قیمت بسته‌ها بر اساس وزن استفاده می‌شود.
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
            <Dropdown
              v-model="form.category_id"
              :options="categories"
              optionLabel="title"
              optionValue="id"
              placeholder="انتخاب دسته‌بندی"
              class="w-full"
              showClear
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">تصویر محصول</label>
            <ImageUploader v-model="form.image" folder="products" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">امتیاز (0-5)</label>
            <input v-model.number="form.rating" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" min="0" max="5" step="0.1" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">موجودی</label>
            <input v-model.number="form.inventory" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" min="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ترتیب نمایش</label>
            <input v-model.number="form.sort_order" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" min="0" />
          </div>
        </div>

        <!-- Weight packages section -->
        <div class="border border-amber-100 rounded-xl bg-amber-50/40 p-4 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                <i class="pi pi-box text-amber-700"></i>
                بسته‌های وزنی
              </h3>
              <p class="text-xs text-gray-600 mt-1">
                وزن هر بسته و قیمت آن را تعریف کنید. در صورت پر بودن «قیمت هر کیلوگرم»، قیمت بسته به‌صورت خودکار محاسبه می‌شود.
              </p>
            </div>
            <Button
              type="button"
              label="افزودن بسته"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              @click="addPackage"
            />
          </div>

          <div v-if="form.weight_packages.length === 0" class="text-sm text-gray-500 py-2">
            هنوز بسته‌ای تعریف نشده. می‌توانید یک وزن و قیمت ساده زیر را پر کنید، یا بسته‌های مختلف اضافه کنید.
          </div>

          <div
            v-for="(pkg, index) in form.weight_packages"
            :key="pkg.id"
            class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-white border border-gray-100 rounded-lg p-3"
          >
            <div class="md:col-span-3">
              <label class="block text-xs font-medium text-gray-600 mb-1">وزن</label>
              <input
                v-model.number="pkg.weight"
                type="number"
                min="0.01"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                @input="onPackageWeightChange(index)"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-gray-600 mb-1">واحد</label>
              <select
                v-model="pkg.unit"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                @change="onPackageWeightChange(index)"
              >
                <option value="g">گرم</option>
                <option value="kg">کیلوگرم</option>
              </select>
            </div>
            <div class="md:col-span-4">
              <label class="block text-xs font-medium text-gray-600 mb-1">قیمت بسته (ریال)</label>
              <input
                v-model.number="pkg.price"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <p v-if="pkg.price" class="text-[11px] text-gray-400 mt-0.5">
                ≈ {{ Math.round(pkg.price / 10).toLocaleString('fa-IR') }} تومان
              </p>
            </div>
            <div class="md:col-span-3 flex gap-2">
              <Button
                type="button"
                label="محاسبه"
                icon="pi pi-calculator"
                size="small"
                outlined
                class="flex-1"
                :disabled="!form.price_per_kg"
                title="محاسبه از قیمت هر کیلوگرم"
                @click="recalcPackagePrice(index)"
              />
              <Button
                type="button"
                icon="pi pi-trash"
                size="small"
                severity="danger"
                text
                rounded
                @click="removePackage(index)"
              />
            </div>
          </div>

          <!-- Simple single weight fallback when no packages -->
          <div v-if="form.weight_packages.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-amber-100">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">وزن بسته (ساده)</label>
              <div class="flex gap-2">
                <input
                  v-model.number="form.weight"
                  type="number"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  step="0.01"
                  placeholder="مثلاً 250"
                />
                <select
                  v-model="form.weight_unit"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="g">گرم</option>
                  <option value="kg">کیلوگرم</option>
                </select>
              </div>
            </div>
            <div class="flex items-end">
              <Button
                type="button"
                label="محاسبه قیمت از وزن و قیمت هر کیلو"
                icon="pi pi-calculator"
                size="small"
                outlined
                :disabled="!form.price_per_kg || !form.weight"
                @click="recalcSimplePrice"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <Textarea v-model="form.description" rows="4" class="w-full" />
        </div>

        <div class="flex items-center gap-2">
          <InputSwitch v-model="form.is_active" inputId="is_active" />
          <label for="is_active" class="text-sm font-medium text-gray-700">فعال</label>
        </div>

        <div class="border-t pt-4">
          <h3 class="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <i class="pi pi-search text-amber-600"></i>
            تنظیمات سئو
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">متن جایگزین تصویر (Image Alt)</label>
              <InputText v-model="form.image_alt" class="w-full" placeholder="توضیح تصویر برای موتورهای جستجو" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان متا (Meta Title)</label>
              <InputText v-model="form.meta_title" class="w-full" placeholder="عنوان صفحه برای موتورهای جستجو (30-60 کاراکتر)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات متا (Meta Description)</label>
              <Textarea v-model="form.meta_description" class="w-full" rows="2" placeholder="توضیحات صفحه برای موتورهای جستجو (120-160 کاراکتر)" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">عنوان OG (OG Title)</label>
                <InputText v-model="form.og_title" class="w-full" placeholder="عنوان برای شبکه‌های اجتماعی" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">تصویر OG (OG Image)</label>
                <InputText v-model="form.og_image" class="w-full" placeholder="آدرس تصویر OG" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات OG (OG Description)</label>
              <Textarea v-model="form.og_description" class="w-full" rows="2" placeholder="توضیحات برای شبکه‌های اجتماعی" />
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <Button type="submit" label="ذخیره" icon="pi pi-check" :loading="saving" />
          <Button type="button" label="لغو" icon="pi pi-times" severity="secondary" @click="goBack" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import slugify from 'slugify'
import api from '@/composables/useAdminApi'
import type { Category, WeightPackage } from '@/types'
import ImageUploader from '@/components/ui/ImageUploader.vue'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const categories = ref<Category[]>([])

function newPackageId() {
  return `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function weightToKg(weight: number, unit: string): number {
  return unit === 'kg' ? weight : weight / 1000
}

function calcPriceFromKg(weight: number, unit: string, pricePerKg: number): number {
  if (!pricePerKg || !weight) return 0
  return Math.round(weightToKg(weight, unit) * pricePerKg)
}

const form = ref({
  title: '',
  slug: '',
  price: 0,
  weight: null as number | null,
  weight_unit: 'g',
  price_per_kg: null as number | null,
  weight_packages: [] as WeightPackage[],
  image: '',
  image_alt: '',
  category_id: null as number | null,
  description: '',
  rating: 0,
  inventory: 0,
  is_active: true,
  sort_order: 0,
  meta_title: '',
  meta_description: '',
  og_title: '',
  og_description: '',
  og_image: '',
})

onMounted(async () => {
  await fetchCategories()
  if (isEdit.value) {
    await fetchProduct()
  }
})

async function fetchCategories() {
  try {
    const res = await api.get('/admin/categories')
    categories.value = res.data.data ?? res.data
  } catch {
    // silently fail
  }
}

async function fetchProduct() {
  try {
    const res = await api.get(`/admin/products/${route.params.id}`)
    const product = res.data
    const packages: WeightPackage[] = Array.isArray(product.weight_packages)
      ? product.weight_packages.map((p: WeightPackage, i: number) => ({
          id: p.id || newPackageId() + i,
          weight: Number(p.weight),
          unit: p.unit === 'kg' ? 'kg' : 'g',
          price: Number(p.price) || 0,
        }))
      : []

    form.value = {
      title: product.title,
      slug: product.slug,
      price: product.price,
      weight: product.weight ?? null,
      weight_unit: product.weight_unit ?? 'g',
      price_per_kg: product.price_per_kg ?? null,
      weight_packages: packages,
      image: product.image ?? '',
      image_alt: product.image_alt ?? '',
      category_id: product.category_id,
      description: product.description ?? '',
      rating: product.rating ?? 0,
      inventory: product.inventory ?? 0,
      is_active: product.is_active,
      sort_order: product.sort_order,
      meta_title: product.meta_title ?? '',
      meta_description: product.meta_description ?? '',
      og_title: product.og_title ?? '',
      og_description: product.og_description ?? '',
      og_image: product.og_image ?? '',
    }
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری محصول انجام نشد', life: 3000 })
    router.push('/products')
  }
}

function onTitleChange() {
  if (!isEdit.value || !form.value.slug) {
    form.value.slug = slugify(form.value.title, { lower: true, trim: true }) || ''
  }
}

function addPackage() {
  const weight = 250
  const unit = 'g'
  const price = form.value.price_per_kg
    ? calcPriceFromKg(weight, unit, form.value.price_per_kg)
    : form.value.price || 0

  form.value.weight_packages.push({
    id: newPackageId(),
    weight,
    unit,
    price,
  })
}

function removePackage(index: number) {
  form.value.weight_packages.splice(index, 1)
}

function onPackageWeightChange(index: number) {
  if (form.value.price_per_kg) {
    recalcPackagePrice(index)
  }
}

function recalcPackagePrice(index: number) {
  const pkg = form.value.weight_packages[index]
  if (!pkg || !form.value.price_per_kg) return
  pkg.price = calcPriceFromKg(pkg.weight, pkg.unit, form.value.price_per_kg)
}

function recalcSimplePrice() {
  if (!form.value.price_per_kg || !form.value.weight) return
  form.value.price = calcPriceFromKg(
    form.value.weight,
    form.value.weight_unit,
    form.value.price_per_kg,
  )
}

async function save() {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      weight: form.value.weight_packages.length > 0
        ? form.value.weight_packages[0].weight
        : form.value.weight,
      weight_unit: form.value.weight_packages.length > 0
        ? form.value.weight_packages[0].unit
        : form.value.weight_unit,
      price: form.value.weight_packages.length > 0
        ? form.value.weight_packages[0].price
        : form.value.price,
      price_per_kg: form.value.price_per_kg || null,
      weight_packages: form.value.weight_packages.length > 0
        ? form.value.weight_packages
        : null,
    }

    if (isEdit.value) {
      await api.put(`/admin/products/${route.params.id}`, payload)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'محصول بروزرسانی شد', life: 3000 })
    } else {
      await api.post('/admin/products', payload)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'محصول ایجاد شد', life: 3000 })
    }
    router.push('/products')
  } catch (e: any) {
    const msg = e.response?.data?.message || 'ذخیره انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail: msg, life: 3000 })
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/products')
}
</script>
