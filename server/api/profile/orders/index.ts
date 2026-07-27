import type {
    Order,
    OrderItemWithProduct,
    OrderWithProducts,
} from '#shared/order'

import { mockOrders } from '#server/mock/orders'
import { products } from '#server/mock/products'

export const mapOrderWithProducts = (
    order: Order,
): OrderWithProducts => {
    const items: OrderItemWithProduct[] = order.items.flatMap((item) => {
        const product = products.find(
            productItem => productItem.id === item.productId,
        )

        if (!product) {
            return []
        }

        return [
            {
                ...item,
                product,
                subtotal: item.unitPrice * item.quantity,
            },
        ]
    })

    const itemsCount = items.reduce(
        (total, item) => total + item.quantity,
        0,
    )

    const itemsSubtotal = items.reduce(
        (total, item) => total + item.subtotal,
        0,
    )

    const total = Math.max(
        0,
        itemsSubtotal
        + order.shipping.cost
        + order.taxAmount
        - order.discountAmount,
    )

    return {
        ...order,
        items,
        itemsCount,
        itemsSubtotal,
        total,
    }
}

export default defineEventHandler(() => {
    const orders = mockOrders
        .map(mapOrderWithProducts)
        .sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

    return {
        success: true,
        data: orders,
    }
})