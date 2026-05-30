import type {Product} from "#shared/product";

export const useProducts = () => {
    const { data, pending, error } = useAsyncData(
        "products",
        () => $fetch<{ success: boolean; data: Product[] }>("/api/products"),
    )

    const products = computed(() => data.value?.data ?? [])

    return {
        products,
        pending,
        error,
    }
}