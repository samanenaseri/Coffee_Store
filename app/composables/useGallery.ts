import type { gallery } from "#shared/gallery"

interface GalleryPaginatedResponse {
    current_page: number
    data: gallery[]
    last_page: number
    total: number
    per_page: number
}

export const useGallery = () => {
    const { apiFetch } = useApi()

    const { data, pending, error } = useAsyncData(
        "gallery",
        () => apiFetch<GalleryPaginatedResponse>('/gallery'),
    )

    const gallery = computed(() => data.value?.data ?? [])

    return {
        gallery,
        pending,
        error,
    }
}
