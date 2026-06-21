import { mockOrders } from '#server/mock/orders'
import { mapOrderWithProducts } from '#server/utils/orderMapper'

export default defineEventHandler((event) => {
    const orderId = Number(getRouterParam(event, 'id'))

    if (!Number.isInteger(orderId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'شماره سفارش نامعتبر است.',
        })
    }

    const order = mockOrders.find(
        item => item.id === orderId,
    )

    if (!order) {
        throw createError({
            statusCode: 404,
            statusMessage: 'سفارش پیدا نشد.',
        })
    }

    return {
        success: true,
        data: mapOrderWithProducts(order),
    }
})