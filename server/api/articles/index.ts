import { mockArticles } from "#server/mock/articles"

export default defineEventHandler(() => {
    const articles = mockArticles
        .filter((a) => a.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)

    return {
        success: true,
        data: articles,
    }
})