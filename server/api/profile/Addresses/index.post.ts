import type {
    Address,
    CreateAddressPayload,
} from '#shared/address'

import { mockAddresses } from '#server/mock/addresses'

export default defineEventHandler(async (event) => {
    const body = await readBody<CreateAddressPayload>(event)

    const title = body.title?.trim()
    const receiverName = body.receiverName?.trim()
    const phone = body.phone?.trim()
    const province = body.province?.trim()
    const city = body.city?.trim()
    const addressText = body.address?.trim()
    const postalCode = body.postalCode?.trim()

    if (!title) {
        throw createError({
            statusCode: 422,
            statusMessage: 'عنوان آدرس الزامی است.',
        })
    }

    if (!receiverName) {
        throw createError({
            statusCode: 422,
            statusMessage: 'نام تحویل‌گیرنده الزامی است.',
        })
    }

    if (!/^09\d{9}$/.test(phone)) {
        throw createError({
            statusCode: 422,
            statusMessage: 'شماره موبایل معتبر نیست.',
        })
    }

    if (!province || !city) {
        throw createError({
            statusCode: 422,
            statusMessage: 'استان و شهر الزامی هستند.',
        })
    }

    if (!addressText) {
        throw createError({
            statusCode: 422,
            statusMessage: 'نشانی کامل الزامی است.',
        })
    }

    if (!/^\d{10}$/.test(postalCode)) {
        throw createError({
            statusCode: 422,
            statusMessage: 'کدپستی باید ۱۰ رقم باشد.',
        })
    }

    if (body.isDefault) {
        mockAddresses.forEach((item) => {
            item.isDefault = false
        })
    }

    const now = new Date().toISOString()

    const newAddress: Address = {
        id: Date.now(),
        title,
        receiverName,
        phone,
        province,
        city,
        address: addressText,
        postalCode,
        plaque: body.plaque?.trim() || undefined,
        unit: body.unit?.trim() || undefined,
        latitude: body.latitude,
        longitude: body.longitude,
        isDefault: body.isDefault ?? mockAddresses.length === 0,
        createdAt: now,
        updatedAt: now,
    }

    mockAddresses.unshift(newAddress)

    return {
        success: true,
        message: 'آدرس با موفقیت ثبت شد.',
        data: newAddress,
    }
})