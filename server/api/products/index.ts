import { products } from "#server/mock/products"

export default defineEventHandler(() => {
    return {
        success: true,
        data: products,
    }
})