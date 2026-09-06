<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})

useSeoMeta({
  title: 'ورود | قهوه‌فروشی',
  robots: 'noindex, nofollow',
})

const { loginWithPassword, sendOtp, verifyOtp, loading, error, normalizePhone } = useAuth()
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
const phone = ref('')
const password = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const otpExpiresIn = ref(0)
const successMessage = ref('')
let otpTimer: ReturnType<typeof setInterval> | null = null

const isPhoneValid = computed(() => {
  const n = normalizePhone(phone.value)
  return /^09\d{9}$/.test(n)
})

const afterSuccess = async () => {
  successMessage.value = 'ورود موفق!'
  await new Promise(r => setTimeout(r, 250))
  await goAfterAuth()
}

const handlePasswordLogin = async () => {
  try {
    await loginWithPassword(normalizePhone(phone.value), password.value)
    await afterSuccess()
  }
  catch {}
}

const handleSendOtp = async () => {
  try {
    await sendOtp(normalizePhone(phone.value))
    otpSent.value = true
    otpExpiresIn.value = 120
    otpTimer = setInterval(() => {
      otpExpiresIn.value--
      if (otpExpiresIn.value <= 0) {
        otpSent.value = false
        if (otpTimer) clearInterval(otpTimer)
      }
    }, 1000)
  }
  catch {}
}

const handleVerifyOtp = async () => {
  try {
    await verifyOtp(normalizePhone(phone.value), otpCode.value)
    await afterSuccess()
  }
  catch {}
}

const resetOtp = () => {
  otpSent.value = false
  otpCode.value = ''
  if (otpTimer) clearInterval(otpTimer)
}

const registerLink = computed(() => {
  const q = route.query.redirect
  const raw = Array.isArray(q) ? q[0] : q
  if (typeof raw === 'string' && raw) {
    return `/register?redirect=${encodeURIComponent(raw)}`
  }
  return '/register'
})

onUnmounted(() => {
  if (otpTimer) clearInterval(otpTimer)
})
</script>

<template>
  <div class="w-full max-w-md mx-auto px-4 py-10">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-white mb-1">
        ورود به حساب
      </h1>
      <p class="text-stone-500 text-sm">
        قهوه‌فروشی | Coffee Store
      </p>
    </div>

    <div class="bg-stone-800/40 backdrop-blur-xl rounded-3xl p-8 border border-stone-700/30 shadow-2xl shadow-black/20">
      <div class="flex mb-6 bg-stone-900/60 rounded-2xl p-1">
        <button
          type="button"
          class="flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300"
          :class="mode === 'password' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 'text-stone-400 hover:text-white'"
          @click="mode = 'password'; error = null"
        >
          رمز عبور
        </button>
        <button
          type="button"
          class="flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300"
          :class="mode === 'otp' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 'text-stone-400 hover:text-white'"
          @click="mode = 'otp'; error = null; otpSent = false; otpCode = ''"
        >
          کد تایید
        </button>
      </div>

      <div v-if="error" class="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">
        {{ error }}
      </div>

      <div v-if="successMessage" class="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm text-center">
        {{ successMessage }}
      </div>

      <form @submit.prevent="mode === 'password' ? handlePasswordLogin() : (otpSent ? handleVerifyOtp() : handleSendOtp())">
        <div class="space-y-5">
          <div>
            <label class="block text-stone-300 text-xs font-medium mb-2.5">شماره موبایل</label>
            <div class="relative">
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </span>
              <input
                v-model="phone"
                type="tel"
                inputmode="numeric"
                maxlength="11"
                placeholder="0912 345 6789"
                class="w-full bg-stone-900/50 border border-stone-700/50 rounded-2xl pr-11 pl-4 py-3.5 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all duration-300 ltr text-left"
                dir="ltr"
                :class="{ 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10': phone && !isPhoneValid }"
                @input="phone = phone.replace(/[^0-9]/g, '')"
              >
            </div>
            <p class="mt-1.5 text-[11px] text-stone-600">
              کامل وارد کنید، مثال: 09121234567
            </p>
          </div>

          <div v-if="mode === 'password'">
            <label class="block text-stone-300 text-xs font-medium mb-2.5">رمز عبور</label>
            <div class="relative">
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input
                v-model="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                class="w-full bg-stone-900/50 border border-stone-700/50 rounded-2xl pr-11 pl-4 py-3.5 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all duration-300"
              >
            </div>
          </div>

          <div v-if="mode === 'otp' && otpSent">
            <label class="block text-stone-300 text-xs font-medium mb-2.5">کد تایید ۵ رقمی</label>
            <input
              v-model="otpCode"
              type="text"
              maxlength="5"
              placeholder="12345"
              class="w-full bg-stone-900/50 border border-stone-700/50 rounded-2xl px-4 py-3.5 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all duration-300 text-center text-xl tracking-[0.6em] ltr"
              @input="otpCode = otpCode.replace(/[^0-9]/g, '')"
            >
            <div class="flex items-center justify-between mt-3">
              <button
                type="button"
                class="text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                @click="resetOtp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                تغییر شماره
              </button>
              <span v-if="otpExpiresIn > 0" class="text-xs text-stone-500 font-mono tabular-nums bg-stone-900/40 px-2.5 py-1 rounded-lg">
                {{ Math.floor(otpExpiresIn / 60) }}:{{ String(otpExpiresIn % 60).padStart(2, '0') }}
              </span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !isPhoneValid || (mode === 'password' && !password) || (mode === 'otp' && otpSent && otpCode.length !== 5)"
            class="w-full bg-gradient-to-l from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-stone-700 disabled:to-stone-700 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-2xl transition-all duration-300 text-sm shadow-lg shadow-amber-600/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span v-if="loading" class="inline-flex items-center gap-2">
              <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              در حال پردازش...
            </span>
            <span v-else>
              {{ mode === 'password' ? 'ورود' : (otpSent ? 'تایید کد' : 'ارسال کد تایید') }}
            </span>
          </button>
        </div>
      </form>

      <div class="mt-6 pt-5 border-t border-stone-700/30">
        <p class="text-center text-stone-500 text-xs">
          حساب ندارید؟
          <NuxtLink :to="registerLink" class="text-amber-500 hover:text-amber-400 transition-colors font-medium">
            ثبت‌نام کنید
          </NuxtLink>
        </p>
      </div>
    </div>

    <p class="text-center text-stone-600 text-[11px] mt-6">
      ورود شما به معنای پذیرش
          <NuxtLink to="/terms" class="text-stone-500 hover:text-stone-400 transition-colors">شرایط استفاده</NuxtLink>
      است
    </p>
  </div>
</template>
