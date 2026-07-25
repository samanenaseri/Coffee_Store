import type { UpdateAddressPayload } from '#shared/address'
import { mockAddresses } from '#server/mock/addresses'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody<UpdateAddressPayload>(event)

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

    const currentAddress = mockAddresses[addressIndex]

    if (!currentAddress) {
        throw createError({
            statusCode: 404,
            statusMessage: 'آدرس موردنظر پیدا نشد.',
        })
    }

    if (body.phone && !/^09\d{9}$/.test(body.phone.trim())) {
        throw createError({
            statusCode: 422,
            statusMessage: 'شماره موبایل معتبر نیست.',
        })
    }

    if (
        body.postalCode
        && !/^\d{10}$/.test(body.postalCode.trim())
    ) {
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

    const updatedAddress = {
        ...currentAddress,
        ...body,
        title: body.title?.trim() ?? currentAddress.title,
        receiverName:
            body.receiverName?.trim() ?? currentAddress.receiverName,
        phone: body.phone?.trim() ?? currentAddress.phone,
        province: body.province?.trim() ?? currentAddress.province,
        city: body.city?.trim() ?? currentAddress.city,
        address: body.address?.trim() ?? currentAddress.address,
        postalCode:
            body.postalCode?.trim() ?? currentAddress.postalCode,
        plaque:
            body.plaque !== undefined
                ? body.plaque.trim() || undefined
                : currentAddress.plaque,
        unit:
            body.unit !== undefined
                ? body.unit.trim() || undefined
                : currentAddress.unit,
        updatedAt: new Date().toISOString(),
    }

    mockAddresses[addressIndex] = updatedAddress

    return {
        success: true,
        message: 'آدرس با موفقیت ویرایش شد.',
        data: updatedAddress,
    }
})