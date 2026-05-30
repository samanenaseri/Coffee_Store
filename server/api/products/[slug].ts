import { products } from "#server/mock/products"

export default defineEventHandler((event) => {
    const { slug } = getRouterParams(event)
    const product = products.find((p) => p.slug === slug)

    if (!product) {
        throw createError({
            statusCode: 404,
            statusMessage: "محصولی یافت نشد",
        })
    }

    return {
        success: true,
        data: product,
    }
})
