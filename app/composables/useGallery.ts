import type {gallery} from "#shared/gallery";

export const useGallery = () => {
    const { data, pending, error } = useAsyncData(
        "gallery",
        () => $fetch<{ success: boolean; data: gallery[] }>("/api/gallery"),
    )

    const gallery = computed(() => data.value?.data ?? [])

    return {
        gallery,
        pending,
        error,
    }
}