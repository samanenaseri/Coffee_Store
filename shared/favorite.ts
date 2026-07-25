import type { Product } from '#shared/product'

export interface FavoriteItem {
    product: Product
    addedAt: string
}