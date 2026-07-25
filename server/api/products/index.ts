import { products } from '#server/mock/products'
import { favoriteProductIds } from '#server/mock/favorites'

export default defineEventHandler(() => {
    const data = products.map(product => ({
        ...product,
        isFavorite: favoriteProductIds.includes(product.id),
    }))

    return {
        success: true,
        data,
    }
})