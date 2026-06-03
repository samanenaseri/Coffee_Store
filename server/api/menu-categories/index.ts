import { mockMenuCategories } from "#server/mock/menuCategories"

export default defineEventHandler(() => {
    const categories = mockMenuCategories
        .filter((category) => category.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)

    return {
        success: true,
        data: categories,
    }
})