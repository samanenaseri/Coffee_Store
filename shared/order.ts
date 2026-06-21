import type { Product } from '#shared/product'

export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'canceled'

export type OrderActionStatus =
    | 'none'
    | 'cancel_requested'
    | 'cancel_approved'
    | 'cancel_rejected'
    | 'return_requested'
    | 'return_approved'
    | 'return_rejected'
    | 'returned'

export type OrderTimelineStatus =
    | 'order_created'
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancel_requested'
    | 'cancel_approved'
    | 'cancel_rejected'
    | 'canceled'
    | 'return_requested'
    | 'return_approved'
    | 'return_rejected'
    | 'returned'
export type PaymentMethod =
    | 'online'
    | 'wallet'
    | 'cash_on_delivery'

export type PaymentStatus =
    | 'pending'
    | 'paid'
    | 'failed'
    | 'refunded'

export interface OrderAddress {
    receiverName: string
    phone: string
    province: string
    city: string
    postalCode: string
    address: string
}

export interface OrderShipping {
    method: string
    cost: number
    trackingCode?: string
    estimatedDeliveryDate?: string
    deliveredAt?: string
}

export interface OrderPayment {
    method: PaymentMethod
    status: PaymentStatus
    transactionId?: string
    paidAt?: string
}
export interface OrderStatusHistory {
    status: OrderTimelineStatus
    date: string
    description: string
}

export interface OrderItem {
    productId: number
    quantity: number
    unitPrice: number
}
export interface OrderItemWithProduct extends OrderItem {
    product: Product
    subtotal: number
}

export interface OrderWithProducts extends Omit<Order, 'items'> {
    items: OrderItemWithProduct[]
    itemsCount: number
    itemsSubtotal: number
    total: number
}

export interface Order {
    id: number
    date: string
    status: OrderStatus
    total: number
    actionStatus: OrderActionStatus

    cancelReason?: string
    cancelRequestedAt?: string

    returnReason?: string
    returnRequestedAt?: string

    address: OrderAddress
    shipping: OrderShipping
    payment: OrderPayment

    discountAmount: number
    taxAmount: number
    description?: string

    statusHistory: OrderStatusHistory[]
    items: OrderItem[]
}