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
    | 'card_to_card'

export type PaymentStatus =
    | 'pending'
    | 'paid'
    | 'failed'
    | 'refunded'

export type PaymentReviewStatus =
    | 'pending_review'
    | 'approved'
    | 'rejected'
    | null

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
    deliveryDay?: string
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

export interface CardTransferInfo {
    amount?: number | null
    ref?: string | null
    date?: string | null
    note?: string | null
    submittedAt?: string | null
}

export interface Order {
    id: number
    date?: string
    createdAt?: string
    created_at?: string
    status: OrderStatus

    // مبلغ کامل سفارش (ریال در API)
    total: number
    shippingCost?: number
    shipping_cost?: number

    // مبلغ کسرشده از کیف پول
    walletAmount?: number
    wallet_amount?: number

    // مبلغ باقی‌مانده قابل پرداخت
    payableAmount?: number
    payable_amount?: number

    paymentMethod?: PaymentMethod | string
    payment_method?: PaymentMethod | string
    paymentStatus?: PaymentStatus | string
    payment_status?: PaymentStatus | string
    paymentReviewStatus?: PaymentReviewStatus | string | null
    payment_review_status?: PaymentReviewStatus | string | null

    cardTransferAmount?: number | null
    card_transfer_amount?: number | null
    cardTransferRef?: string | null
    card_transfer_ref?: string | null
    cardTransferDate?: string | null
    card_transfer_date?: string | null
    cardTransferNote?: string | null
    card_transfer_note?: string | null
    cardTransferSubmittedAt?: string | null
    card_transfer_submitted_at?: string | null

    actionStatus?: OrderActionStatus
    action_status?: OrderActionStatus

    cancelReason?: string
    cancelRequestedAt?: string

    returnReason?: string
    returnRequestedAt?: string

    address?: OrderAddress
    receiverName?: string
    receiver_name?: string
    receiverPhone?: string
    receiver_phone?: string
    province?: string
    city?: string
    orderAddress?: string
    order_address?: string
    postalCode?: string
    postal_code?: string
    shippingMethod?: string
    shipping_method?: string
    deliveryDay?: string
    delivery_day?: string

    shipping?: OrderShipping
    payment?: OrderPayment

    discountAmount?: number
    taxAmount?: number
    description?: string

    statusHistory?: OrderStatusHistory[]
    items?: OrderItem[] | OrderItemWithProduct[]
}