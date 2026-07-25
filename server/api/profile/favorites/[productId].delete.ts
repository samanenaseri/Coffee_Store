import { favoriteProductIds } from '#server/mock/favorites'

export default defineEventHandler((event) => {
    const productId = Number(
        getRouterParam(event, 'productId'),
    )

    if (!Number.isInteger(productId) || productId <= 0) {
        throw createError({
            statusCode: 422,
            statusMessage: 'شناسه محصول نامعتبر است.',
        })
    }

    const favoriteIndex = favoriteProductIds.indexOf(productId)

    if (favoriteIndex === -1) {
        throw createError({
            statusCode: 404,
            statusMessage: 'محصول در علاقه‌مندی‌ها وجود ندارد.',
        })
    }

    favoriteProductIds.splice(favoriteIndex, 1)

    return {
        success: true,
        message: 'محصول از علاقه‌مندی‌ها حذف شد.',
    }
})