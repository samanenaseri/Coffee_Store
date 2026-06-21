import { mockOrders } from '#server/mock/orders'

interface ReturnOrderBody {
    reason: string
}

export default defineEventHandler(async (event) => {
    const orderId = Number(getRouterParam(event, 'id'))
    const body = await readBody<ReturnOrderBody>(event)

    if (!Number.isInteger(orderId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'شماره سفارش نامعتبر است.',
        })
    }

    if (!body.reason?.trim()) {
        throw createError({
            statusCode: 422,
            statusMessage: 'انتخاب دلیل مرجوعی الزامی است.',
        })
    }

    const order = mockOrders.find(item => item.id === orderId)

    if (!order) {
        throw createError({
            statusCode: 404,
            statusMessage: 'سفارش پیدا نشد.',
        })
    }

    if (order.status !== 'delivered') {
        throw createError({
            statusCode: 400,
            statusMessage: 'فقط سفارش تحویل‌شده قابل مرجوعی است.',
        })
    }

    if (order.actionStatus !== 'none') {
        throw createError({
            statusCode: 409,
            statusMessage: 'قبلاً برای این سفارش درخواستی ثبت شده است.',
        })
    }

    const now = new Date().toISOString()

    order.actionStatus = 'return_requested'
    order.returnReason = body.reason.trim()
    order.returnRequestedAt = now

    order.statusHistory.push({
        status: 'return_requested',
        date: now,
        description: 'درخواست مرجوعی سفارش ثبت شد',
    })

    return {
        success: true,
        message: 'درخواست مرجوعی با موفقیت ثبت شد.',
        data: order,
    }
})