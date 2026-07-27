<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="w-full max-w-md px-6">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/20 mb-4">
          <i class="pi pi-coffee text-3xl text-primary-400"></i>
        </div>
        <h1 class="text-2xl font-bold text-white">پنل مدیریت</h1>
        <p class="text-gray-400 mt-2">فروشگاه قهوه</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <form @submit.prevent="handleLogin">
          <div class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
              <div class="relative">
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i class="pi pi-envelope"></i>
                </span>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="admin@example.com"
                  class="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
              <div class="relative">
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i class="pi pi-lock"></i>
                </span>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="رمز عبور"
                  class="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <i class="pi pi-exclamation-circle"></i>
              {{ error }}
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <i v-if="loading" class="pi pi-spin pi-spinner"></i>
              <span>{{ loading ? 'در حال ورود...' : 'ورود' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <p class="text-center text-gray-500 text-sm mt-6">
        © {{ new Date().getFullYear() }} فروشگاه قهوه
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'

const router = useRouter()
const { login } = useAdminAuth()

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(form.email, form.password)
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'خطا در ورود'
  } finally {
    loading.value = false
  }
}
</script>
