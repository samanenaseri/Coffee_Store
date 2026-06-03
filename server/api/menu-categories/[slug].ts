import { mockMenuCategories } from "#server/mock/menuCategories"

export default defineEventHandler((event) => {
    const { slug } = getRouterParams(event)

    const category = mockMenuCategories.find(
        (category) => category.slug === slug && category.isActive
    )

    if (!category) {
        throw createError({
            statusCode: 404,
            statusMessage: "دسته‌بندی یافت نشد",
        })
    }

    return {
        success: true,
        data: category,
    }
})