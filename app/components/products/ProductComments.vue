<script setup lang="ts">
import type { ProductComment } from '#shared/productComment'

const props = defineProps<{
  productSlug: string
}>()

const { apiFetch } = useApi()
const { isLoggedIn, user } = useAuth()
const notification = useNotification()
const route = useRoute()
const { loginUrlFor, registerUrlFor } = useAuthRedirect()

// Full path of this product page (used after login return)
const returnToComments = computed(() => {
  // Prefer fullPath so query params are kept; add comments anchor for scroll
  const path = route.path || `/products/${props.productSlug}`
  return `${path}#product-comments`
})

const loginHref = computed(() => loginUrlFor(returnToComments.value))
const registerHref = computed(() => registerUrlFor(returnToComments.value))

const comments = ref<ProductComment[]>([])
const averageRating = ref(0)
const commentsCount = ref(0)
const loading = ref(true)
const submitting = ref(false)
const page = ref(1)
const lastPage = ref(1)

const form = reactive({
  authorName: '',
  body: '',
  rating: 5,
})

const formError = ref('')

async function loadComments(p = 1) {
  loading.value = true
  try {
    const res = await apiFetch<any>(`/products/${props.productSlug}/comments?page=${p}`)
    averageRating.value = Number(res.averageRating ?? res.average_rating ?? 0)
    commentsCount.value = Number(res.commentsCount ?? res.comments_count ?? 0)

    const paginated = res.comments ?? res
    const list = paginated.data ?? []
    comments.value = list
    page.value = paginated.currentPage ?? paginated.current_page ?? p
    lastPage.value = paginated.lastPage ?? paginated.last_page ?? 1
  } catch {
    comments.value = []
  } finally {
    loading.value = false
  }
}

function authorOf(c: ProductComment) {
  return c.authorName || c.author_name || 'کاربر'
}

function dateOf(c: ProductComment) {
  const raw = c.createdAt || c.created_at
  if (!raw) return ''
  try {
    return new Date(raw).toLocaleDateString('fa-IR')
  } catch {
    return raw
  }
}

async function submitComment() {
  formError.value = ''

  if (!isLoggedIn.value) {
    formError.value = 'برای ثبت نظر ابتدا وارد حساب کاربری شوید.'
    return
  }

  if (!form.body.trim() || form.body.trim().length < 3) {
    formError.value = 'متن نظر باید حداقل ۳ کاراکتر باشد.'
    return
  }

  submitting.value = true
  try {
    await apiFetch(`/products/${props.productSlug}/comments`, {
      method: 'POST',
      body: {
        body: form.body.trim(),
        rating: form.rating,
        author_name: form.authorName.trim() || (user.value as any)?.name || undefined,
      },
    })

    notification.success(
      'ثبت شد',
      'نظر شما ثبت شد و پس از تأیید مدیر نمایش داده می‌شود.',
    )
    form.body = ''
    form.rating = 5
    await loadComments(1)
  } catch (e: any) {
    formError.value =
      e?.data?.message ||
      e?.data?.errors?.body?.[0] ||
      e?.message ||
      'ثبت نظر ناموفق بود'
  } finally {
    submitting.value = false
  }
}

watch(
  () => props.productSlug,
  (slug) => {
    if (slug) loadComments(1)
  },
  { immediate: true },
)

onMounted(() => {
  if (user.value && (user.value as any).name) {
    form.authorName = String((user.value as any).name)
  }
})
</script>

<template>
  <section id="product-comments" class="mt-16 border-t border-input pt-12 pb-8">
    <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-text">
          نظرات و امتیاز مشتریان
        </h2>
        <p class="text-sm text-lightText mt-1">
          <template v-if="commentsCount > 0">
            میانگین امتیاز:
            <span class="text-amber-600 font-bold">{{ averageRating.toLocaleString('fa-IR') }}</span>
            از ۵
            ·
            {{ commentsCount.toLocaleString('fa-IR') }} نظر
          </template>
          <template v-else>
            هنوز نظری ثبت نشده است. اولین نفر باشید!
          </template>
        </p>
      </div>
      <div v-if="commentsCount > 0" class="flex gap-0.5 text-amber-500 text-xl">
        <span
          v-for="star in 5"
          :key="star"
          :class="star <= Math.round(averageRating) ? 'opacity-100' : 'opacity-25'"
        >★</span>
      </div>
    </div>

    <!-- Submit form -->
    <div class="rounded-2xl border border-input bg-menu p-5 mb-10">
      <h3 class="font-bold text-text mb-4">
        ثبت نظر شما
      </h3>

      <div v-if="!isLoggedIn" class="text-sm text-lightText py-2">
        برای ثبت نظر لطفاً
        <NuxtLink :to="loginHref" class="text-amber-700 font-medium underline underline-offset-2">
          وارد شوید
        </NuxtLink>
        یا
        <NuxtLink :to="registerHref" class="text-amber-700 font-medium underline underline-offset-2">
          ثبت‌نام کنید
        </NuxtLink>
        .
        <span class="block mt-1 text-xs text-lightText/80">
          پس از ورود به همین صفحه برمی‌گردید.
        </span>
      </div>

      <form v-else class="space-y-4" @submit.prevent="submitComment">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-lightText mb-1">نام نمایشی</label>
            <input
              v-model="form.authorName"
              type="text"
              class="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-text outline-none focus:border-amber-700"
              placeholder="نام شما"
            />
          </div>
          <div>
            <label class="block text-sm text-lightText mb-1">امتیاز</label>
            <div class="flex items-center gap-1 h-[42px]">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="text-2xl transition-transform hover:scale-110"
                :class="star <= form.rating ? 'text-amber-500' : 'text-stone-300'"
                @click="form.rating = star"
              >
                ★
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm text-lightText mb-1">متن نظر</label>
          <textarea
            v-model="form.body"
            rows="4"
            class="w-full rounded-xl border border-input bg-background px-4 py-3 text-text outline-none focus:border-amber-700 resize-y"
            placeholder="نظر خود را درباره این محصول بنویسید..."
          />
        </div>

        <p v-if="formError" class="text-sm text-red-500">
          {{ formError }}
        </p>

        <button
          type="submit"
          class="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-medium disabled:opacity-50"
          :disabled="submitting"
        >
          {{ submitting ? 'در حال ارسال...' : 'ارسال نظر' }}
        </button>
      </form>
    </div>

    <!-- Comments list -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="h-24 rounded-xl bg-text/10 animate-pulse" />
    </div>

    <div v-else-if="comments.length === 0" class="text-center text-lightText py-8">
      نظری برای نمایش وجود ندارد.
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="rounded-2xl border border-input bg-menu p-5"
      >
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              {{ authorOf(comment).charAt(0) }}
            </div>
            <div>
              <p class="font-bold text-text">
                {{ authorOf(comment) }}
              </p>
              <p class="text-xs text-lightText">
                {{ dateOf(comment) }}
              </p>
            </div>
          </div>
          <div class="flex gap-0.5 text-amber-500">
            <span
              v-for="star in 5"
              :key="star"
              :class="star <= (comment.rating || 0) ? 'opacity-100' : 'opacity-25'"
            >★</span>
          </div>
        </div>
        <p class="text-text leading-7 whitespace-pre-line">
          {{ comment.body }}
        </p>
      </article>

      <div v-if="lastPage > 1" class="flex justify-center gap-2 pt-4">
        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-input text-sm disabled:opacity-40"
          :disabled="page <= 1"
          @click="loadComments(page - 1)"
        >
          قبلی
        </button>
        <span class="px-3 py-2 text-sm text-lightText">
          {{ page.toLocaleString('fa-IR') }} / {{ lastPage.toLocaleString('fa-IR') }}
        </span>
        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-input text-sm disabled:opacity-40"
          :disabled="page >= lastPage"
          @click="loadComments(page + 1)"
        >
          بعدی
        </button>
      </div>
    </div>
  </section>
</template>
