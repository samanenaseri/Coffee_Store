import type { Article } from "#shared/article"

export const useArticles = () => {
    const { data, pending, error } = useAsyncData(
        "articles",
        () => $fetch<{ success: boolean; data: Article[] }>("/api/articles")
    )

    const articles = computed(() => data.value?.data ?? [])

    return {
        articles,
        pending,
        error,
    }
}