import { mockAddresses } from '#server/mock/addresses'

export default defineEventHandler((event) => {
    const id = Number(getRouterParam(event, 'id'))

    if (!Number.isInteger(id) || id <= 0) {
        throw createError({
            statusCode: 422,
            statusMessage: 'شناسه آدرس نامعتبر است.',
        })
    }

    const addressIndex = mockAddresses.findIndex(item => item.id === id)

    if (addressIndex === -1) {
        throw createError({
            statusCode: 404,
            statusMessage: 'آدرس موردنظر پیدا نشد.',
        })
    }

    const address = mockAddresses[addressIndex]

    if (!address) {
        throw createError({
            statusCode: 404,
            statusMessage: 'آدرس موردنظر پیدا نشد.',
        })
    }

    if (address.isDefault && mockAddresses.length > 1) {
        throw createError({
            statusCode: 422,
            statusMessage:
                'ابتدا یک آدرس دیگر را به‌عنوان آدرس پیش‌فرض انتخاب کنید.',
        })
    }

    mockAddresses.splice(addressIndex, 1)

    return {
        success: true,
        message: 'آدرس با موفقیت حذف شد.',
    }
})