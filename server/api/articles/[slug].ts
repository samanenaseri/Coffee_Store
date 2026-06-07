import { mockArticles } from "#server/mock/articles"

export default defineEventHandler((event) => {
    const { slug } = getRouterParams(event)

    const article = mockArticles.find(
        (article) => article.slug === slug && article.isActive
    )

    if (!article) {
        throw createError({
            statusCode: 404,
            statusMessage: "مقاله‌ای یافت نشد",
        })
    }

    return {
        success: true,
        data: article,
    }
})