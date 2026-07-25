import { defineStore } from "pinia"

interface UserProfile {
    isGuest: boolean
    name: string
    phone: string
    email: string
}

export const useUserStore = defineStore("user", () => {
    const { apiFetch } = useApi()

    const user = ref<UserProfile>({
        isGuest: true,
        name: "",
        phone: "",
        email: "",
    })

    const loading = ref(false)

    const setUser = (data: Partial<UserProfile>) => {
        user.value = {
            ...user.value,
            ...data,
        }
    }

    const fetchProfile = async () => {
        loading.value = true
        try {
            const response = await apiFetch<{ user: Record<string, unknown> }>('/auth/profile')
            if (response.user) {
                user.value = {
                    isGuest: false,
                    name: (response.user.name as string) || "",
                    phone: (response.user.phone as string) || "",
                    email: (response.user.email as string) || "",
                }
            }
        } catch (err: any) {
            console.error('Fetch profile error:', err)
        } finally {
            loading.value = false
        }
    }

    const updateProfile = async (data: { name?: string; email?: string }) => {
        loading.value = true
        try {
            const response = await apiFetch<{ user: Record<string, unknown> }>('/auth/profile', {
                method: 'PUT',
                body: data,
            })
            if (response.user) {
                user.value = {
                    ...user.value,
                    name: (response.user.name as string) || user.value.name,
                    phone: (response.user.phone as string) || user.value.phone,
                    email: (response.user.email as string) || user.value.email,
                }
            }
            return response
        } catch (err: any) {
            console.error('Update profile error:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const resetUser = () => {
        user.value = {
            isGuest: true,
            name: "",
            phone: "",
            email: "",
        }
    }

    return {
        user,
        loading,
        setUser,
        fetchProfile,
        updateProfile,
        resetUser,
    }
})
