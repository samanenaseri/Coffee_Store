import { mockOrders } from '#server/mock/orders'

interface CancelOrderBody {
    reason: string
}

export default defineEventHandler(async (event) => {
    const orderId = Number(getRouterParam(event, 'id'))
    const body = await readBody<CancelOrderBody>(event)

    if (!Number.isInteger(orderId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'شماره سفارش نامعتبر است.',
        })
    }

    if (!body.reason?.trim()) {
        throw createError({
            statusCode: 422,
            statusMessage: 'انتخاب دلیل لغو الزامی است.',
        })
    }

    const order = mockOrders.find(item => item.id === orderId)

    if (!order) {
        throw createError({
            statusCode: 404,
            statusMessage: 'سفارش پیدا نشد.',
        })
    }

    const canCancel = ['pending', 'processing'].includes(order.status)

    if (!canCancel) {
        throw createError({
            statusCode: 400,
            statusMessage: 'این سفارش دیگر قابل لغو نیست.',
        })
    }

    if (order.actionStatus !== 'none') {
        throw createError({
            statusCode: 409,
            statusMessage: 'قبلاً برای این سفارش درخواستی ثبت شده است.',
        })
    }

    const now = new Date().toISOString()

    order.actionStatus = 'cancel_requested'
    order.cancelReason = body.reason.trim()
    order.cancelRequestedAt = now

    order.statusHistory.push({
        status: 'cancel_requested',
        date: now,
        description: 'درخواست لغو سفارش ثبت شد',
    })

    return {
        success: true,
        message: 'درخواست لغو سفارش با موفقیت ثبت شد.',
        data: order,
    }
})