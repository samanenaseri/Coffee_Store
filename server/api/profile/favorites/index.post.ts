import { favoriteProductIds } from '#server/mock/favorites'
import { products } from '#server/mock/products'

interface AddFavoritePayload {
    productId: number
}

export default defineEventHandler(async (event) => {
    const body = await readBody<AddFavoritePayload>(event)
    const productId = Number(body.productId)

    if (!Number.isInteger(productId) || productId <= 0) {
        throw createError({
            statusCode: 422,
            statusMessage: 'شناسه محصول نامعتبر است.',
        })
    }

    const product = products.find(
        item => item.id === productId,
    )

    if (!product) {
        throw createError({
            statusCode: 404,
            statusMessage: 'محصول موردنظر پیدا نشد.',
        })
    }

    if (!favoriteProductIds.includes(productId)) {
        favoriteProductIds.unshift(productId)
    }

    return {
        success: true,
        message: 'محصول به علاقه‌مندی‌ها اضافه شد.',
        data: {
            ...product,
            isFavorite: true,
        },
    }
})