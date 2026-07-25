import { defineStore } from 'pinia'
import type { Product } from '#shared/product'

    interface FavoriteItem {
        id: number
        user_id: number
        product_id: number
        product: Product
    }

    interface PaginatedResponse<T> {
        current_page: number
        data: T[]
        last_page: number
        total: number
    }

interface ToggleFavoriteResponse {
    status: 'added' | 'removed'
    total: number
}

export const useFavoriteStore = defineStore('favorite', () => {
    const { apiFetch } = useApi()

    const items = ref<Product[]>([])
    const pending = ref(false)
    const actionPendingIds = ref<number[]>([])
    const error = ref('')
    const isLoaded = ref(false)

    const totalItems = computed(() => items.value.length)

    const isFavorite = (productId: number) => {
        return items.value.some(product => product.id === productId)
    }

    const isActionPending = (productId: number) => {
        return actionPendingIds.value.includes(productId)
    }

    const fetchFavorites = async (force = false) => {
        if (isLoaded.value && !force) {
            return
        }

        pending.value = true
        error.value = ''

        try {
            const response = await apiFetch<PaginatedResponse<FavoriteItem>>('/favorites')

            items.value = response.data.map(fav => ({
                ...fav.product,
                isFavorite: true,
            }))
            isLoaded.value = true
        }
        catch (err) {
            console.error(err)

            error.value = 'دریافت علاقه‌مندی‌ها با خطا مواجه شد.'
        }
        finally {
            pending.value = false
        }
    }

    const toggleFavorite = async (product: Product) => {
        if (isActionPending(product.id)) {
            return { success: false, isFavorite: isFavorite(product.id) }
        }

        actionPendingIds.value.push(product.id)

        try {
            const response = await apiFetch<ToggleFavoriteResponse>(
                `/favorites/${product.id}/toggle`,
                { method: 'POST' },
            )

            if (response.status === 'added') {
                if (!isFavorite(product.id)) {
                    items.value.unshift({
                        ...product,
                        isFavorite: true,
                    })
                }
            }
            else {
                items.value = items.value.filter(
                    p => p.id !== product.id,
                )
            }

            return {
                success: true,
                isFavorite: response.status === 'added',
                total: response.total,
            }
        }
        catch (err) {
            console.error(err)
            return { success: false, isFavorite: isFavorite(product.id) }
        }
        finally {
            actionPendingIds.value
                = actionPendingIds.value.filter(
                id => id !== product.id,
            )
        }
    }

    const checkFavorite = async (productId: number) => {
        try {
            const response = await apiFetch<{ exists: boolean }>(
                `/favorites/${productId}/check`,
            )
            return response.exists
        }
        catch (err) {
            console.error(err)
            return false
        }
    }

    return {
        items,
        totalItems,
        pending,
        error,
        isLoaded,
        isFavorite,
        isActionPending,
        fetchFavorites,
        toggleFavorite,
        checkFavorite,
    }
})
