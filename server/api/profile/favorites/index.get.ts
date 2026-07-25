import { favoriteProductIds } from '#server/mock/favorites'
import { products } from '#server/mock/products'

export default defineEventHandler(() => {
    const favoriteProducts = products.filter(product => {
        return favoriteProductIds.includes(product.id)
    })

    return {
        success: true,
        data: favoriteProducts,
    }
})