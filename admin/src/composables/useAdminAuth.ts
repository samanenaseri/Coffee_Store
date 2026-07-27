import { ref, computed } from 'vue'
import api from './useAdminApi'
import type { User } from '@/types'

const user = ref<User | null>(null)
const token = ref<string | null>(localStorage.getItem('admin_token'))

export function useAdminAuth() {
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.is_admin === true)

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    const { user: userData, token: authToken } = response.data

    if (!userData.is_admin) {
      throw new Error('شما دسترسی مدیریت ندارید')
    }

    user.value = userData
    token.value = authToken
    localStorage.setItem('admin_token', authToken)
    localStorage.setItem('admin_user', JSON.stringify(userData))

    return userData
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    }
  }

  async function fetchUser() {
    if (!token.value) return null
    try {
      const response = await api.get('/auth/profile')
      user.value = response.data.user
      localStorage.setItem('admin_user', JSON.stringify(response.data.user))
      return response.data.user
    } catch {
      user.value = null
      token.value = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      return null
    }
  }

  function loadStoredUser() {
    const stored = localStorage.getItem('admin_user')
    if (stored && token.value) {
      try {
        user.value = JSON.parse(stored)
      } catch {
        user.value = null
      }
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    fetchUser,
    loadStoredUser,
  }
}
