import type { Article } from "#shared/Article"

interface ArticlesPaginatedResponse {
    current_page: number
    data: Article[]
    last_page: number
    total: number
    per_page: number
}

export const useArticles = () => {
    const { apiFetch } = useApi()

    const { data, pending, error } = useAsyncData(
        "articles",
        () => apiFetch<ArticlesPaginatedResponse>('/articles'),
    )

    const articles = computed(() => data.value?.data ?? [])

    return {
        articles,
        pending,
        error,
    }
}
