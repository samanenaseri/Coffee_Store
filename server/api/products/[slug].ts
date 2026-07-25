import { products } from '#server/mock/products'
import { favoriteProductIds } from '#server/mock/favorites'

export default defineEventHandler((event) => {
    const { slug } = getRouterParams(event)

    const product = products.find(item => item.slug === slug)

    if (!product) {
        throw createError({
            statusCode: 404,
            statusMessage: 'محصولی یافت نشد',
        })
    }

    return {
        success: true,
        data: {
            ...product,
            isFavorite: favoriteProductIds.includes(product.id),
        },
    }
})
