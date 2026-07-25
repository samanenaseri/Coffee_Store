import type { Product } from "#shared/product"

interface ProductsPaginatedResponse {
    current_page: number
    data: Product[]
    last_page: number
    total: number
    per_page: number
}

export const useProducts = () => {
    const { apiFetch } = useApi()

    const { data, pending, error } = useAsyncData(
        "products",
        () => apiFetch<ProductsPaginatedResponse>('/products'),
    )

    const products = computed(() => data.value?.data ?? [])

    return {
        products,
        pending,
        error,
    }
}
