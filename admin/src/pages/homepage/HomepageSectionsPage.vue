<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">مدیریت صفحه اول</h1>
      <Button label="افزودن بخش" icon="pi pi-plus" @click="openNew" />
    </div>

    <!-- Sections List -->
    <div class="space-y-3">
      <div v-if="loading" class="text-center py-12">
        <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
      </div>

      <div v-else-if="!sections.length" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <i class="pi pi-home text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">هنوز بخشی اضافه نشده</p>
      </div>

      <div v-for="section in sections" :key="section.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex flex-col gap-1">
              <button @click="moveUp(section)" class="text-gray-400 hover:text-gray-600" :disabled="section === sections[0]">
                <i class="pi pi-chevron-up"></i>
              </button>
              <button @click="moveDown(section)" class="text-gray-400 hover:text-gray-600" :disabled="section === sections[sections.length - 1]">
                <i class="pi pi-chevron-down"></i>
              </button>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-xs font-medium" :class="getTypeClass(section.type)">{{ getTypeLabel(section.type) }}</span>
                <span v-if="!section.is_active" class="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600">غیرفعال</span>
              </div>
              <h3 class="font-medium text-gray-800 mt-1">{{ section.title }}</h3>
              <p v-if="section.subtitle" class="text-sm text-gray-500">{{ section.subtitle }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-pencil" size="small" text rounded @click="openEdit(section)" />
            <Button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(section)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <Dialog v-model:visible="dialogVisible" :header="isEditing ? 'ویرایش بخش' : 'افزودن بخش'" modal class="w-full max-w-3xl" :style="{ maxHeight: '90vh' }">
      <div class="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
        <!-- Type selector (only for new) -->
        <div v-if="!isEditing">
          <label class="block text-sm font-medium text-gray-700 mb-2">نوع بخش</label>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="t in typeOptions" :key="t.value"
              @click="form.type = t.value"
              class="p-3 rounded-lg border-2 text-right transition-all"
              :class="form.type === t.value ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-gray-300'">
              <i :class="t.icon" class="text-lg mb-1"></i>
              <div class="text-sm font-medium">{{ t.label }}</div>
              <div class="text-xs text-gray-500">{{ t.desc }}</div>
            </button>
          </div>
        </div>

        <!-- ===== HERO EDITOR ===== -->
        <template v-if="form.type === 'hero'">
          <div class="border border-amber-200 rounded-lg p-4 bg-amber-50/50 space-y-4">
            <h3 class="font-bold text-amber-800"><i class="pi pi-image ml-1"></i> ویرایش بنر تصویری اصلی (Hero)</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تصویر بنر (دسکتاپ)</label>
              <ImageUploader v-model="heroContent.imageSrc" folder="homepage" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تصویر بنر (موبایل)</label>
              <p class="text-xs text-gray-500 mb-2">در صورت خالی بودن، تصویر اصلی دسکتاپ نمایش داده می‌شود</p>
              <ImageUploader v-model="heroContent.mobileImageSrc" folder="homepage" />
            </div>
            <!-- Slides editor -->
            <div class="border-t pt-4 mt-4">
              <div class="flex items-center justify-between mb-3">
                <label class="text-sm font-bold text-amber-800">اسلایدهای متنی</label>
                <span class="text-xs text-gray-500">به‌صورت خودکار تغییر می‌کنند</span>
              </div>
              <div v-for="(slide, index) in heroContent.slides" :key="index" class="border border-amber-200 rounded-lg p-3 mb-3 space-y-2 bg-white">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-amber-700">اسلاید {{ index + 1 }}</span>
                  <Button icon="pi pi-trash" severity="danger" text size="small" @click="heroContent.slides.splice(index, 1)" :disabled="heroContent.slides.length <= 1" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">عنوان اصلی</label>
                  <InputText v-model="slide.heading" class="w-full" placeholder="عطر قهوه" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">خط‌های متنی (هر خط جداگانه)</label>
                  <div v-for="(line, li) in slide.lines" :key="li" class="flex items-center gap-2 mb-1">
                    <InputText v-model="slide.lines[li]" class="flex-1" :placeholder="`خط ${li + 1}`" />
                    <Button icon="pi pi-times" text severity="danger" size="small" @click="slide.lines.splice(li, 1)" :disabled="slide.lines.length <= 1" />
                  </div>
                  <Button label="افزودن خط" icon="pi pi-plus" text size="small" @click="slide.lines.push('')" />
                </div>
              </div>
              <Button label="افزودن اسلاید" icon="pi pi-plus" text size="small" class="mt-2" @click="heroContent.slides.push({ heading: '', lines: [''] })" />
            </div>
          </div>
        </template>

        <!-- ===== ABOUT EDITOR ===== -->
        <template v-if="form.type === 'about'">
          <div class="border border-blue-200 rounded-lg p-4 bg-blue-50/50 space-y-4">
            <h3 class="font-bold text-blue-800"><i class="pi pi-info-circle ml-1"></i> ویرایش بخش معرفی (About)</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان بخش</label>
              <InputText v-model="form.title" class="w-full" placeholder="طعم خوب لحظه ها با قهوه ی ناب" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">متن توضیحی</label>
              <Textarea v-model="form.description" rows="3" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تصویر اصلی</label>
              <ImageUploader v-model="form.image" folder="homepage" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تصویر تزئینی (دایره چرخان)</label>
              <ImageUploader v-model="aboutContent.secondaryImage" folder="homepage" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">عدد تجربه (سال)</label>
                <InputNumber v-model="aboutContent.experienceNumber" class="w-full" :min="1" :max="99" placeholder="7" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">متن زیر عدد</label>
                <InputText v-model="aboutContent.experienceLabel" class="w-full" placeholder="سال تجربه" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">آیتم‌های نوشیدنی</label>
              <div v-for="(drink, index) in aboutContent.drinks" :key="index" class="border border-gray-200 rounded-lg p-3 mb-3 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-600">نوشیدنی {{ index + 1 }}</span>
                  <Button icon="pi pi-trash" severity="danger" text size="small" @click="aboutContent.drinks.splice(index, 1)" />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">عنوان</label>
                    <InputText v-model="drink.title" class="w-full" placeholder="اسپرسو" />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">توضیحات</label>
                    <InputText v-model="drink.description" class="w-full" placeholder="قهوه‌ای غلیظ..." />
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">آیکون (آپلود یا لینک)</label>
                  <ImageUploader v-model="drink.icon" folder="homepage/drinks" />
                </div>
              </div>
              <Button label="افزودن نوشیدنی" icon="pi pi-plus" text size="small" @click="aboutContent.drinks.push({ title: '', description: '', icon: '' })" />
            </div>
          </div>
        </template>

        <!-- ===== PRODUCTS EDITOR ===== -->
        <template v-if="form.type === 'products'">
          <div class="border border-green-200 rounded-lg p-4 bg-green-50/50 space-y-4">
            <h3 class="font-bold text-green-800"><i class="pi pi-shopping-bag ml-1"></i> ویرایش بخش محصولات</h3>
            <p class="text-sm text-gray-600">محصولات به صورت خودکار از بانک اطلاعاتی نمایش داده می‌شوند. فقط عنوان و زیرعنوان را تغییر دهید.</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان بخش</label>
              <InputText v-model="form.title" class="w-full" placeholder="محصولات" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">زیرعنوان</label>
              <InputText v-model="form.subtitle" class="w-full" placeholder="محصولات ما" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تعداد محصولات نمایشی</label>
              <InputNumber v-model="productsContent.limit" class="w-full" :min="1" :max="12" placeholder="4" />
            </div>
          </div>
        </template>

        <!-- ===== SERVICES EDITOR ===== -->
        <template v-if="form.type === 'services'">
          <div class="border border-purple-200 rounded-lg p-4 bg-purple-50/50 space-y-4">
            <h3 class="font-bold text-purple-800"><i class="pi pi-truck ml-1"></i> ویرایش بخش خدمات</h3>
            <div v-for="(card, index) in servicesContent.cards" :key="index" class="border border-gray-200 rounded-lg p-3 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">خدمت {{ index + 1 }}</span>
                <Button icon="pi pi-trash" severity="danger" text size="small" @click="servicesContent.cards.splice(index, 1)" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">عنوان</label>
                  <InputText v-model="card.title" class="w-full" placeholder="سفارش قهوه" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">آیکون</label>
                  <InputText v-model="card.icon" class="w-full" placeholder="Order" />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">توضیحات</label>
                <Textarea v-model="card.description" rows="2" class="w-full" />
              </div>
            </div>
            <Button label="افزودن خدمت" icon="pi pi-plus" text size="small" @click="servicesContent.cards.push({ title: '', description: '', icon: '' })" />
          </div>
        </template>

        <!-- ===== MENU EDITOR ===== -->
        <template v-if="form.type === 'menu'">
          <div class="border border-orange-200 rounded-lg p-4 bg-orange-50/50 space-y-4">
            <h3 class="font-bold text-orange-800"><i class="pi pi-book ml-1"></i> ویرایش بخش منو</h3>
            <p class="text-sm text-gray-600">آیتم‌های منو به صورت خودکار از بانک اطلاعاتی نمایش داده می‌شوند.</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان بخش</label>
              <InputText v-model="form.title" class="w-full" placeholder="منوی کافه" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">زیرعنوان</label>
              <InputText v-model="form.subtitle" class="w-full" placeholder="دسته‌بندی موردنظر را انتخاب کنید" />
            </div>
          </div>
        </template>

        <!-- ===== TESTIMONIALS EDITOR ===== -->
        <template v-if="form.type === 'testimonials'">
          <div class="border border-pink-200 rounded-lg p-4 bg-pink-50/50 space-y-4">
            <h3 class="font-bold text-pink-800"><i class="pi pi-users ml-1"></i> ویرایش بخش نظرات مشتریان</h3>
            <p class="text-sm text-gray-600">نظرات مشتریان از بانک اطلاعاتی خوانده می‌شوند.</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان بخش</label>
              <InputText v-model="form.title" class="w-full" placeholder="نظر مشتریان ما" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">زیرعنوان</label>
              <InputText v-model="form.subtitle" class="w-full" placeholder="تجربه مشتریان از خرید قهوه و محصولات ما" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تصویر پس‌زمینه</label>
              <ImageUploader v-model="form.image" folder="homepage" />
            </div>
          </div>
        </template>

        <!-- ===== GALLERY EDITOR ===== -->
        <template v-if="form.type === 'gallery'">
          <div class="border border-teal-200 rounded-lg p-4 bg-teal-50/50 space-y-4">
            <h3 class="font-bold text-teal-800"><i class="pi pi-images ml-1"></i> ویرایش بخش گالری</h3>
            <p class="text-sm text-gray-600">تصاویر گالری از بانک اطلاعاتی خوانده می‌شوند.</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان بخش</label>
              <InputText v-model="form.title" class="w-full" placeholder="گالری عکس" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">زیرعنوان</label>
              <InputText v-model="form.subtitle" class="w-full" placeholder="تصاویر فروشگاه و محصولات ما" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تعداد تصاویر نمایشی</label>
              <InputNumber v-model="galleryContent.limit" class="w-full" :min="1" :max="12" placeholder="6" />
            </div>
          </div>
        </template>

        <!-- ===== BANNER EDITOR ===== -->
        <template v-if="form.type === 'banner'">
          <div class="border border-red-200 rounded-lg p-4 bg-red-50/50 space-y-4">
            <h3 class="font-bold text-red-800"><i class="pi pi-image ml-1"></i> ویرایش بنر تصویری</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تصویر پس‌زمینه</label>
              <ImageUploader v-model="form.image" folder="homepage" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">متن نقل‌قول</label>
              <Textarea v-model="form.description" rows="3" class="w-full" placeholder="نوشیدن قهوه فقط چشیدن یک طعم نیست..." />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">لینک</label>
              <InputText v-model="form.link" class="w-full" placeholder="/products" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">متن لینک</label>
              <InputText v-model="form.link_text" class="w-full" placeholder="مشاهده محصولات" />
            </div>
          </div>
        </template>

        <!-- ===== ARTICLES EDITOR ===== -->
        <template v-if="form.type === 'articles'">
          <div class="border border-indigo-200 rounded-lg p-4 bg-indigo-50/50 space-y-4">
            <h3 class="font-bold text-indigo-800"><i class="pi pi-file-edit ml-1"></i> ویرایش بخش مقالات</h3>
            <p class="text-sm text-gray-600">مقالات از بانک اطلاعاتی خوانده می‌شوند.</p>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان بخش</label>
              <InputText v-model="form.title" class="w-full" placeholder="مقالات" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">زیرعنوان</label>
              <InputText v-model="form.subtitle" class="w-full" placeholder="جدیدترین مقالات و نکات درباره قهوه" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تعداد مقالات نمایشی</label>
              <InputNumber v-model="articlesContent.limit" class="w-full" :min="1" :max="8" placeholder="5" />
            </div>
          </div>
        </template>

        <!-- Active toggle -->
        <div class="flex items-center gap-2 pt-2 border-t">
          <InputSwitch v-model="form.is_active" inputId="is_active" />
          <label for="is_active" class="text-sm font-medium text-gray-700">فعال</label>
        </div>
      </div>

      <template #footer>
        <Button label="لغو" severity="secondary" @click="dialogVisible = false" />
        <Button label="ذخیره" icon="pi pi-check" :loading="saving" @click="save" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import api from '@/composables/useAdminApi'
import ImageUploader from '@/components/ui/ImageUploader.vue'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'

interface HomepageSection {
  id: number
  type: string
  title: string
  subtitle: string | null
  description: string | null
  content: any
  image: string | null
  link: string | null
  link_text: string | null
  sort_order: number
  is_active: boolean
}

const toast = useToast()
const confirm = useConfirm()

const sections = ref<HomepageSection[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)

const typeOptions = [
  { label: 'بنر اصلی', value: 'hero', icon: 'pi pi-image', desc: 'Hero image' },
  { label: 'معرفی', value: 'about', icon: 'pi pi-info-circle', desc: 'DescribeSection' },
  { label: 'محصولات', value: 'products', icon: 'pi pi-shopping-bag', desc: 'ProductSection' },
  { label: 'خدمات', value: 'services', icon: 'pi pi-truck', desc: 'OrderSection' },
  { label: 'منو', value: 'menu', icon: 'pi pi-book', desc: 'MenuSection' },
  { label: 'نظرات', value: 'testimonials', icon: 'pi pi-users', desc: 'TestimonialSection' },
  { label: 'گالری', value: 'gallery', icon: 'pi pi-images', desc: 'Gallery' },
  { label: 'بنر تصویری', value: 'banner', icon: 'pi pi-image', desc: 'PicSection' },
  { label: 'مقالات', value: 'articles', icon: 'pi pi-file-edit', desc: 'ArticlesSection' },
]

const typeLabels: Record<string, string> = {
  hero: 'بنر اصلی', about: 'معرفی', products: 'محصولات', services: 'خدمات',
  menu: 'منو', testimonials: 'نظرات', gallery: 'گالری', banner: 'بنر تصویری', articles: 'مقالات',
}

const typeClasses: Record<string, string> = {
  hero: 'bg-amber-100 text-amber-700',
  about: 'bg-blue-100 text-blue-700',
  products: 'bg-green-100 text-green-700',
  services: 'bg-purple-100 text-purple-700',
  menu: 'bg-orange-100 text-orange-700',
  testimonials: 'bg-pink-100 text-pink-700',
  gallery: 'bg-teal-100 text-teal-700',
  banner: 'bg-red-100 text-red-700',
  articles: 'bg-indigo-100 text-indigo-700',
}

const form = ref({
  type: 'hero',
  title: '',
  subtitle: '',
  description: '',
  content: null as any,
  image: '',
  link: '',
  link_text: '',
  sort_order: 0,
  is_active: true,
})

const heroContent = reactive({ mediaType: 'image' as const, imageSrc: '/images/Coffee_Beans.webp', mobileImageSrc: '', slides: [] as { heading: string; lines: string[] }[] })
const aboutContent = reactive({ secondaryImage: '', experienceNumber: 7, experienceLabel: 'سال تجربه', drinks: [] as { title: string; description: string; icon: string }[] })
const productsContent = reactive({ limit: 4 })
const servicesContent = reactive({ cards: [] as { title: string; description: string; icon: string }[] })
const galleryContent = reactive({ limit: 6 })
const articlesContent = reactive({ limit: 5 })

onMounted(() => fetchSections())

async function fetchSections() {
  loading.value = true
  try {
    const res = await api.get('/admin/homepage-sections')
    sections.value = res.data
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'بارگذاری بخش‌ها انجام نشد', life: 3000 })
  } finally {
    loading.value = false
  }
}

function resetEditors() {
  heroContent.mediaType = 'image'
  heroContent.imageSrc = '/images/Coffee_Beans.webp'
  heroContent.mobileImageSrc = ''
  heroContent.slides = []
  aboutContent.secondaryImage = ''
  aboutContent.experienceNumber = 7
  aboutContent.experienceLabel = 'سال تجربه'
  aboutContent.drinks = []
  productsContent.limit = 4
  servicesContent.cards = []
  galleryContent.limit = 6
  articlesContent.limit = 5
}

function openNew() {
  isEditing.value = false
  editingId.value = null
  resetEditors()
  form.value = {
    type: 'hero', title: '', subtitle: '', description: '',
    content: null, image: '', link: '', link_text: '',
    sort_order: sections.value.length, is_active: true,
  }
  dialogVisible.value = true
}

function openEdit(section: HomepageSection) {
  isEditing.value = true
  editingId.value = section.id
  resetEditors()

  form.value = {
    type: section.type,
    title: section.title,
    subtitle: section.subtitle || '',
    description: section.description || '',
    content: section.content,
    image: section.image || '',
    link: section.link || '',
    link_text: section.link_text || '',
    sort_order: section.sort_order,
    is_active: section.is_active,
  }

  const c = section.content || {}
  switch (section.type) {
    case 'hero':
      heroContent.mediaType = 'image'
      heroContent.imageSrc = c.imageSrc || '/images/Coffee_Beans.webp'
      heroContent.mobileImageSrc = c.mobileImageSrc || ''
      heroContent.slides = c.slides || [
        { heading: section.title || 'عطر قهوه', lines: [section.subtitle || 'هر فنجان، یک داستان'] },
      ]
      break
    case 'about':
      aboutContent.secondaryImage = c.secondaryImage || ''
      aboutContent.experienceNumber = c.experienceNumber || 7
      aboutContent.experienceLabel = c.experienceLabel || 'سال تجربه'
      aboutContent.drinks = c.drinks || []
      break
    case 'products':
      productsContent.limit = c.limit || 4
      break
    case 'services':
      servicesContent.cards = c.cards || []
      break
    case 'gallery':
      galleryContent.limit = c.limit || 6
      break
    case 'articles':
      articlesContent.limit = c.limit || 5
      break
  }
  dialogVisible.value = true
}

async function save() {
  if (!form.value.title) {
    toast.add({ severity: 'warn', summary: 'خطا', detail: 'عنوان الزامی است', life: 3000 })
    return
  }

  // Build content JSON based on type
  let content: any = null
  switch (form.value.type) {
    case 'hero':
      content = { mediaType: 'image', imageSrc: heroContent.imageSrc, mobileImageSrc: heroContent.mobileImageSrc, slides: heroContent.slides }
      break
    case 'about':
      content = { secondaryImage: aboutContent.secondaryImage, experienceNumber: aboutContent.experienceNumber, experienceLabel: aboutContent.experienceLabel, drinks: aboutContent.drinks }
      break
    case 'products':
      content = { limit: productsContent.limit }
      break
    case 'services':
      content = { cards: servicesContent.cards }
      break
    case 'gallery':
      content = { limit: galleryContent.limit }
      break
    case 'articles':
      content = { limit: articlesContent.limit }
      break
    default:
      content = form.value.content
  }

  const payload = { ...form.value, content }

  saving.value = true
  try {
    if (isEditing.value && editingId.value) {
      await api.put(`/admin/homepage-sections/${editingId.value}`, payload)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'بخش بروزرسانی شد', life: 3000 })
    } else {
      await api.post('/admin/homepage-sections', payload)
      toast.add({ severity: 'success', summary: 'موفق', detail: 'بخش ایجاد شد', life: 3000 })
    }
    dialogVisible.value = false
    await fetchSections()
  } catch (e: any) {
    const msg = e.response?.data?.message || 'ذخیره انجام نشد'
    toast.add({ severity: 'error', summary: 'خطا', detail: msg, life: 3000 })
  } finally {
    saving.value = false
  }
}

function confirmDelete(section: HomepageSection) {
  confirm.require({
    message: `آیا از حذف بخش "${section.title}" اطمینان دارید؟`,
    header: 'تایید حذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'بله',
    rejectLabel: 'خیر',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/admin/homepage-sections/${section.id}`)
        toast.add({ severity: 'success', summary: 'موفق', detail: 'بخش حذف شد', life: 3000 })
        await fetchSections()
      } catch {
        toast.add({ severity: 'error', summary: 'خطا', detail: 'حذف انجام نشد', life: 3000 })
      }
    },
  })
}

async function moveUp(section: HomepageSection) {
  const index = sections.value.indexOf(section)
  if (index <= 0) return
  const ids = sections.value.map(s => s.id)
  ;[ids[index], ids[index - 1]] = [ids[index - 1], ids[index]]
  try {
    await api.post('/admin/homepage-sections/reorder', { ids })
    await fetchSections()
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'تغییر ترتیب انجام نشد', life: 3000 })
  }
}

async function moveDown(section: HomepageSection) {
  const index = sections.value.indexOf(section)
  if (index >= sections.value.length - 1) return
  const ids = sections.value.map(s => s.id)
  ;[ids[index], ids[index + 1]] = [ids[index + 1], ids[index]]
  try {
    await api.post('/admin/homepage-sections/reorder', { ids })
    await fetchSections()
  } catch {
    toast.add({ severity: 'error', summary: 'خطا', detail: 'تغییر ترتیب انجام نشد', life: 3000 })
  }
}

function getTypeLabel(type: string): string {
  return typeLabels[type] || type
}

function getTypeClass(type: string): string {
  return typeClasses[type] || 'bg-gray-100 text-gray-700'
}
</script>
