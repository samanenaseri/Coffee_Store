import { mockAddresses } from '#server/mock/addresses'

export default defineEventHandler((event) => {
    const id = Number(getRouterParam(event, 'id'))

    if (!Number.isInteger(id) || id <= 0) {
        throw createError({
            statusCode: 422,
            statusMessage: 'شناسه آدرس نامعتبر است.',
        })
    }

    const selectedAddress = mockAddresses.find(item => item.id === id)

    if (!selectedAddress) {
        throw createError({
            statusCode: 404,
            statusMessage: 'آدرس موردنظر پیدا نشد.',
        })
    }

    mockAddresses.forEach((item) => {
        item.isDefault = item.id === id
    })

    selectedAddress.updatedAt = new Date().toISOString()

    return {
        success: true,
        message: 'آدرس پیش‌فرض تغییر کرد.',
        data: selectedAddress,
    }
})