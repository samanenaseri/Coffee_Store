<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})

useSeoMeta({
  title: "ثبت‌نام | قهوه‌فروشی",
  robots: "noindex, nofollow",
})

const { register, sendOtp, verifyOtp, loading, error } = useAuth()
const { goAfterAuth, rememberReturnPath, sanitizeRedirectPath } = useAuthRedirect()
const route = useRoute()

onMounted(() => {
  const q = route.query.redirect
  const raw = Array.isArray(q) ? q[0] : q
  if (typeof raw === 'string' && raw) {
    rememberReturnPath(sanitizeRedirectPath(raw))
  }
})

const mode = ref<'password' | 'otp'>('password')
const name = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const otpExpiresIn = ref(0)
const successMessage = ref('')
let otpTimer: ReturnType<typeof setInterval> | null = null

const isPhoneValid = computed(() => /^09\d{9}$/.test(phone.value))
const isPasswordValid = computed(() => password.value.length >= 8)
const isConfirmValid = computed(() => password.value === confirmPassword.value && confirmPassword.value.length > 0)
const isFormValid = computed(() => name.value.trim().length >= 2 && isPhoneValid.value && isPasswordValid.value && isConfirmValid.value)

const afterSuccess = async (msg: string) => {
  successMessage.value = msg
  await new Promise(r => setTimeout(r, 300))
  await goAfterAuth()
}

const handlePasswordRegister = async () => {
  try {
    await register(name.value, phone.value, password.value, confirmPassword.value)
    await afterSuccess('ثبت‌نام موفق!')
  } catch {}
}

const handleSendOtp = async () => {
  try {
    await sendOtp(phone.value)
    otpSent.value = true
    otpExpiresIn.value = 120
    otpTimer = setInterval(() => {
      otpExpiresIn.value--
      if (otpExpiresIn.value <= 0) {
        otpSent.value = false
        if (otpTimer) clearInterval(otpTimer)
      }
    }, 1000)
  } catch {}
}

const handleVerifyOtp = async () => {
  try {
    await verifyOtp(phone.value, otpCode.value)
    await afterSuccess('ثبت‌نام و ورود موفق!')
  } catch {}
}

const resetOtp = () => {
  otpSent.value = false
  otpCode.value = ''
  if (otpTimer) clearInterval(otpTimer)
}

const loginLink = computed(() => {
  const q = route.query.redirect
  const raw = Array.isArray(q) ? q[0] : q
  if (typeof raw === 'string' && raw) {
    return `/login?redirect=${encodeURIComponent(raw)}`
  }
  return '/login'
})

onUnmounted(() => {
  if (otpTimer) clearInterval(otpTimer)
})
</script>

<template>
  <div class="w-full max-w-sm mx-auto px-4">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">ساخت حساب جدید</h1>
      <p class="text-stone-400 text-sm">قهوه‌فروشی | Coffee Store</p>
    </div>

    <div class="bg-stone-800/50 backdrop-blur-sm rounded-2xl p-6 border border-stone-700/50">
      <div class="flex mb-6 bg-stone-900/50 rounded-xl p-1">
        <button
          class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
          :class="mode === 'password' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-stone-400 hover:text-white'"
          @click="mode = 'password'; error = null"
        >
          رمز عبور
        </button>
        <button
          class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
          :class="mode === 'otp' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-stone-400 hover:text-white'"
          @click="mode = 'otp'; error = null; otpSent = false; otpCode = ''"
        >
          کد تایید
        </button>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
        {{ error }}
      </div>

      <div v-if="successMessage" class="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm text-center">
        {{ successMessage }}
      </div>

      <form @submit.prevent="mode === 'password' ? handlePasswordRegister() : (otpSent ? handleVerifyOtp() : handleSendOtp())">
        <div class="space-y-4">
          <div v-if="mode === 'password' || !otpSent">
            <label class="block text-stone-400 text-xs mb-2">نام</label>
            <input
              v-model="name"
              type="text"
              placeholder="نام و نام خانوادگی"
              class="w-full bg-stone-900/50 border border-stone-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
            />
          </div>

          <div>
            <label class="block text-stone-400 text-xs mb-2">شماره موبایل</label>
            <input
              v-model="phone"
              type="tel"
              maxlength="11"
              placeholder="09123456789"
              class="w-full bg-stone-900/50 border border-stone-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
              @input="phone = phone.replace(/[^0-9]/g, '')"
            />
          </div>

          <div v-if="mode === 'password'">
            <label class="block text-stone-400 text-xs mb-2">رمز عبور</label>
            <input
              v-model="password"
              type="password"
              placeholder="حداقل ۸ کاراکتر"
              class="w-full bg-stone-900/50 border border-stone-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
            />
          </div>

          <div v-if="mode === 'password'">
            <label class="block text-stone-400 text-xs mb-2">تکرار رمز عبور</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="تکرار رمز عبور"
              class="w-full bg-stone-900/50 border border-stone-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
            />
          </div>

          <div v-if="mode === 'otp' && otpSent">
            <label class="block text-stone-400 text-xs mb-2">کد تایید ۵ رقمی</label>
            <input
              v-model="otpCode"
              type="text"
              maxlength="5"
              placeholder="۱۲۳۴۵"
              class="w-full bg-stone-900/50 border border-stone-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 text-center tracking-[0.5em] ltr"
              @input="otpCode = otpCode.replace(/[^0-9]/g, '')"
            />
            <div class="flex items-center justify-between mt-2">
              <button
                type="button"
                class="text-xs text-amber-500 hover:text-amber-400 transition-colors"
                @click="resetOtp"
              >
                تغییر شماره
              </button>
              <span v-if="otpExpiresIn > 0" class="text-xs text-stone-500">
                {{ Math.floor(otpExpiresIn / 60) }}:{{ String(otpExpiresIn % 60).padStart(2, '0') }}
              </span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || (mode === 'password' ? !isFormValid : !isPhoneValid || (otpSent && otpCode.length !== 5))"
            class="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-amber-600/20 hover:shadow-amber-500/30"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              در حال پردازش...
            </span>
            <span v-else>
              {{ mode === 'password' ? 'ثبت‌نام' : (otpSent ? 'تایید کد' : 'ارسال کد تایید') }}
            </span>
          </button>
        </div>
      </form>

      <div class="mt-6 pt-4 border-t border-stone-700/50">
        <p class="text-center text-stone-500 text-xs">
          قبلا ثبت‌نام کرده‌اید؟
          <NuxtLink :to="loginLink" class="text-amber-500 hover:text-amber-400 transition-colors">
            وارد شوید
          </NuxtLink>
        </p>
      </div>
    </div>

    <p class="text-center text-stone-600 text-xs mt-6">
      ثبت‌نام شما به معنای پذیرش
      <NuxtLink to="/terms" class="text-stone-400 hover:text-white transition-colors">شرایط استفاده</NuxtLink>
      است
    </p>
  </div>
</template>
