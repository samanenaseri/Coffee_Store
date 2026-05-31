import { galleries } from "#server/mock/gallery"

export default defineEventHandler((event) => {
    const { slug } = getRouterParams(event)
    const gallery = galleries.find((g) => g.slug === slug)

    if (!gallery) {
        throw createError({
            statusCode: 404,
            statusMessage: "عکسی یافت نشد",
        })
    }

    return {
        success: true,
        data: gallery,
    }
})
