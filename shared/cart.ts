import type { Product } from "#shared/product"

export interface CartItem {
    product: Product
    quantity: number
}