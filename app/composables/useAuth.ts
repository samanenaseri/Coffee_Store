/** Normalize Iranian mobile to 09xxxxxxxxx */
function normalizePhone(phone: string): string {
    let digits = String(phone || '').replace(/\D/g, '')
    if (digits.startsWith('98') && digits.length === 12) {
        digits = `0${digits.slice(2)}`
    }
    if (digits.length === 10 && digits.startsWith('9')) {
        digits = `0${digits}`
    }
    return digits
}

export const useAuth = () => {
    const user = useState<Record<string, unknown> | null>('auth-user', () => null)
    const token = useCookie('auth-token', { maxAge: 60 * 60 * 24 * 7 })
    const loading = useState<boolean>('auth-loading', () => false)
    const error = useState<string | null>('auth-error', () => null)
    const { apiFetch } = useApi()

    const isLoggedIn = computed(() => !!token.value && !!user.value)

    const loginWithPassword = async (phone: string, password: string) => {
        loading.value = true
        error.value = null
        try {
            const normalized = normalizePhone(phone)
            const data = await apiFetch<{ message: string; user: Record<string, unknown>; token: string }>('/auth/login', {
                method: 'POST',
                body: { phone: normalized, password },
            })
            token.value = data.token
            user.value = data.user
            return data
        }
        catch (e: any) {
            error.value =
                e?.data?.message
                || e?.data?.errors?.phone?.[0]
                || e?.data?.errors?.password?.[0]
                || 'ورود ناموفق بود. شماره موبایل یا رمز عبور را بررسی کنید.'
            throw e
        }
        finally {
            loading.value = false
        }
    }

    const sendOtp = async (phone: string) => {
        loading.value = true
        error.value = null
        try {
            const normalized = normalizePhone(phone)
            const data = await apiFetch<{ message: string; expires_in: number }>('/otp/send', {
                method: 'POST',
                body: { phone: normalized },
            })
            return data
        }
        catch (e: any) {
            error.value = e?.data?.message || 'ارسال کد ناموفق بود'
            throw e
        }
        finally {
            loading.value = false
        }
    }

    const verifyOtp = async (phone: string, code: string) => {
        loading.value = true
        error.value = null
        try {
            const normalized = normalizePhone(phone)
            const data = await apiFetch<{ message: string; user: Record<string, unknown>; token: string }>('/otp/verify', {
                method: 'POST',
                body: { phone: normalized, code },
            })
            token.value = data.token
            user.value = data.user
            return data
        }
        catch (e: any) {
            error.value = e?.data?.message || 'کد نامعتبر است'
            throw e
        }
        finally {
            loading.value = false
        }
    }

    const register = async (name: string, phone: string, password: string, passwordConfirmation: string) => {
        loading.value = true
        error.value = null
        try {
            const normalized = normalizePhone(phone)
            const data = await apiFetch<{ message: string; user: Record<string, unknown>; token: string }>('/auth/register', {
                method: 'POST',
                body: {
                    name,
                    phone: normalized,
                    password,
                    password_confirmation: passwordConfirmation,
                },
            })
            token.value = data.token
            user.value = data.user
            return data
        }
        catch (e: any) {
            error.value =
                e?.data?.message
                || e?.data?.errors?.phone?.[0]
                || e?.data?.errors?.password?.[0]
                || 'ثبت‌نام ناموفق بود'
            throw e
        }
        finally {
            loading.value = false
        }
    }

    const login = loginWithPassword

    const logout = async () => {
        try {
            await apiFetch('/auth/logout', { method: 'POST' })
        }
        catch (_) {}
        user.value = null
        token.value = null
    }

    const fetchUser = async () => {
        if (!token.value) return
        loading.value = true
        try {
            const data = await apiFetch<{ user: Record<string, unknown> }>('/auth/profile')
            user.value = data.user
        }
        catch (e: any) {
            const status = e?.status || e?.statusCode
            if (status === 401) {
                error.value = e.data?.message || 'نشست منقضی شده است'
                token.value = null
                user.value = null
            }
        }
        finally {
            loading.value = false
        }
    }

    return {
        user,
        token,
        loading,
        error,
        login,
        loginWithPassword,
        sendOtp,
        verifyOtp,
        register,
        logout,
        fetchUser,
        isLoggedIn,
        normalizePhone,
    }
}
