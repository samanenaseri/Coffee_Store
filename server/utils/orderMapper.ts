import type {
    Order,
    OrderItemWithProduct,
    OrderWithProducts,
} from '#shared/order'

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

        const unitPrice = item.unitPrice ?? product.price

        return [
            {
                ...item,
                unitPrice,
                product,
                subtotal: unitPrice * item.quantity,
            },
        ]
    })

    const itemsCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0,
    )

    const itemsSubtotal = items.reduce(
        (sum, item) => sum + item.subtotal,
        0,
    )

    const shippingCost = order.shipping?.cost ?? 0
    const discountAmount = order.discountAmount ?? 0
    const taxAmount = order.taxAmount ?? 0

    const total = Math.max(
        0,
        itemsSubtotal
        + shippingCost
        + taxAmount
        - discountAmount,
    )

    return {
        ...order,

        address: order.address ?? {
            receiverName: '',
            phone: '',
            province: '',
            city: '',
            postalCode: '',
            address: '',
        },

        shipping: order.shipping ?? {
            method: 'نامشخص',
            cost: 0,
        },

        payment: order.payment ?? {
            method: 'online',
            status: 'pending',
        },

        actionStatus: order.actionStatus ?? 'none',
        statusHistory: order.statusHistory ?? [],
        discountAmount,
        taxAmount,

        items,
        itemsCount,
        itemsSubtotal,
        total,
    }
}