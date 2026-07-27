import type {
  OrderStatus,
  OrderTimelineStatus,
  OrderWithProducts,
  OrderItemWithProduct,
  OrderStatusHistory,
  PaymentMethod,
  PaymentStatus,
  OrderActionStatus,
} from '#shared/order'
import type { Product } from '#shared/product'

/**
 * Safely parse a date-like value for Intl.DateTimeFormat.
 * Returns null when the value is missing or not a finite timestamp.
 */
export function parseValidDate(value: unknown): Date | null {
  if (value == null || value === '') return null

  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value : null
  }

  if (typeof value === 'number') {
    const d = new Date(value)
    return Number.isFinite(d.getTime()) ? d : null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null

    // Pure date YYYY-MM-DD → parse as local noon to avoid TZ edge cases
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const d = new Date(`${trimmed}T12:00:00`)
      return Number.isFinite(d.getTime()) ? d : null
    }

    const d = new Date(trimmed)
    return Number.isFinite(d.getTime()) ? d : null
  }

  return null
}

/**
 * Format a date for fa-IR UI. Never throws RangeError on invalid input.
 */
export function formatOrderDate(
  value: unknown,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = parseValidDate(value)
  if (!date) return '—'

  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    }).format(date)
  } catch {
    return '—'
  }
}

function pickString(...values: unknown[]): string {
  for (const v of values) {
    if (typeof v === 'string' && v.trim()) return v.trim()
    if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  }
  return ''
}

function pickNumber(...values: unknown[]): number {
  for (const v of values) {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) {
      return Number(v)
    }
  }
  return 0
}

function normalizeStatus(raw: unknown): OrderStatus {
  const s = String(raw ?? 'pending').toLowerCase()
  if (s === 'cancelled' || s === 'canceled') return 'canceled'
  if (s === 'processing') return 'processing'
  if (s === 'shipped') return 'shipped'
  if (s === 'delivered') return 'delivered'
  if (s === 'returned') return 'canceled' // treat as terminal; map if needed later
  return 'pending'
}

function normalizeActionStatus(raw: unknown): OrderActionStatus {
  const s = String(raw ?? 'none').toLowerCase()
  const allowed: OrderActionStatus[] = [
    'none',
    'cancel_requested',
    'cancel_approved',
    'cancel_rejected',
    'return_requested',
    'return_approved',
    'return_rejected',
    'returned',
  ]
  return (allowed.includes(s as OrderActionStatus) ? s : 'none') as OrderActionStatus
}

function normalizePaymentMethod(raw: unknown): PaymentMethod {
  const s = String(raw ?? 'online').toLowerCase()
  if (s === 'wallet') return 'wallet'
  if (s === 'cash_on_delivery' || s === 'cod') return 'cash_on_delivery'
  if (s === 'card_to_card' || s === 'card') return 'card_to_card'
  return 'online'
}

function normalizePaymentStatus(raw: unknown): PaymentStatus {
  const s = String(raw ?? 'pending').toLowerCase()
  if (s === 'paid') return 'paid'
  if (s === 'failed') return 'failed'
  if (s === 'refunded') return 'refunded'
  return 'pending'
}

function unwrapOrderPayload(raw: unknown): Record<string, any> | null {
  if (!raw || typeof raw !== 'object') return null

  const obj = raw as Record<string, any>

  // { order: {...} }
  if (obj.order && typeof obj.order === 'object' && !Array.isArray(obj.order)) {
    return obj.order as Record<string, any>
  }

  // { data: {...} } single resource
  if (
    obj.data
    && typeof obj.data === 'object'
    && !Array.isArray(obj.data)
    && (obj.data.id != null || obj.data.items != null)
  ) {
    return obj.data as Record<string, any>
  }

  // Already a flat order
  if (obj.id != null || Array.isArray(obj.items)) {
    return obj
  }

  return null
}

function normalizeProduct(raw: any): Product {
  if (!raw || typeof raw !== 'object') {
    return {
      id: 0,
      title: 'محصول',
      slug: '',
      price: 0,
      image: '',
      category: { id: 0, title: '', slug: '' },
      description: '',
      rating: 0,
      inventory: 0,
    }
  }

  return {
    id: pickNumber(raw.id),
    title: pickString(raw.title, raw.name) || 'محصول',
    slug: pickString(raw.slug),
    price: pickNumber(raw.price),
    image: pickString(raw.image, raw.imageUrl, raw.image_url),
    imageAlt: pickString(raw.imageAlt, raw.image_alt),
    category: raw.category && typeof raw.category === 'object'
      ? {
          id: pickNumber(raw.category.id),
          title: pickString(raw.category.title, raw.category.name),
          slug: pickString(raw.category.slug),
        }
      : { id: 0, title: '', slug: '' },
    description: pickString(raw.description),
    rating: pickNumber(raw.rating),
    inventory: pickNumber(raw.inventory, raw.stock),
    weight: raw.weight ?? null,
    weightUnit: pickString(raw.weightUnit, raw.weight_unit) || undefined,
  } as Product
}

function normalizeItems(rawItems: unknown): OrderItemWithProduct[] {
  if (!Array.isArray(rawItems)) return []

  return rawItems.map((item: any) => {
    const quantity = pickNumber(item?.quantity, 1) || 1
    const unitPrice = pickNumber(item?.unitPrice, item?.unit_price, item?.price)
    const product = normalizeProduct(item?.product)
    const productId = pickNumber(item?.productId, item?.product_id, product.id)
    const subtotal = pickNumber(item?.subtotal, unitPrice * quantity)

    return {
      productId,
      quantity,
      unitPrice,
      product,
      subtotal,
    }
  })
}

function normalizeStatusHistory(raw: unknown): OrderStatusHistory[] {
  if (!Array.isArray(raw)) return []

  return raw.map((entry: any) => {
    let status = String(entry?.status ?? 'pending').toLowerCase()
    if (status === 'cancelled') status = 'canceled'

    const date =
      pickString(
        entry?.date,
        entry?.createdAt,
        entry?.created_at,
      ) || new Date().toISOString()

    return {
      status: status as OrderTimelineStatus,
      date,
      description: pickString(entry?.description, entry?.note) || status,
    }
  })
}

/**
 * Normalize Laravel / mock / nested order payloads into OrderWithProducts
 * expected by the storefront profile pages.
 */
export function normalizeOrder(raw: unknown): OrderWithProducts | null {
  const src = unwrapOrderPayload(raw)
  if (!src) return null

  // Nested shapes already normalized (mock)
  const hasNestedAddress = src.address && typeof src.address === 'object'
  const hasNestedShipping = src.shipping && typeof src.shipping === 'object'
  const hasNestedPayment = src.payment && typeof src.payment === 'object'

  const items = normalizeItems(src.items)

  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const itemsSubtotal = items.reduce((sum, i) => sum + i.subtotal, 0)

  const shippingCost = hasNestedShipping
    ? pickNumber(src.shipping.cost, src.shippingCost, src.shipping_cost)
    : pickNumber(src.shippingCost, src.shipping_cost)

  const discountAmount = pickNumber(src.discountAmount, src.discount_amount)
  const taxAmount = pickNumber(src.taxAmount, src.tax_amount)
  const total = pickNumber(
    src.total,
    itemsSubtotal + shippingCost + taxAmount - discountAmount,
  )

  const date = pickString(
    src.date,
    src.createdAt,
    src.created_at,
  )

  const address = hasNestedAddress
    ? {
        receiverName: pickString(src.address.receiverName, src.address.receiver_name),
        phone: pickString(src.address.phone, src.address.receiverPhone, src.address.receiver_phone),
        province: pickString(src.address.province),
        city: pickString(src.address.city),
        postalCode: pickString(src.address.postalCode, src.address.postal_code),
        address: pickString(src.address.address, src.address.orderAddress, src.address.order_address),
      }
    : {
        receiverName: pickString(src.receiverName, src.receiver_name),
        phone: pickString(src.receiverPhone, src.receiver_phone, src.phone),
        province: pickString(src.province),
        city: pickString(src.city),
        postalCode: pickString(src.postalCode, src.postal_code),
        address: pickString(src.orderAddress, src.order_address, src.address),
      }

  const shipping = hasNestedShipping
    ? {
        method: pickString(src.shipping.method, src.shippingMethod) || 'نامشخص',
        cost: shippingCost,
        deliveryDay: pickString(src.shipping.deliveryDay, src.deliveryDay, src.delivery_day) || undefined,
        trackingCode: pickString(src.shipping.trackingCode, src.trackingCode, src.tracking_code) || undefined,
        estimatedDeliveryDate:
          pickString(
            src.shipping.estimatedDeliveryDate,
            src.shipping.estimatedDelivery,
            src.estimatedDelivery,
            src.estimated_delivery,
          ) || undefined,
        deliveredAt:
          pickString(src.shipping.deliveredAt, src.deliveredAt, src.delivered_at) || undefined,
      }
    : {
        method: pickString(src.shippingMethod, src.shipping_method) || 'نامشخص',
        cost: shippingCost,
        deliveryDay: pickString(src.deliveryDay, src.delivery_day) || undefined,
        trackingCode: pickString(src.trackingCode, src.tracking_code) || undefined,
        estimatedDeliveryDate:
          pickString(src.estimatedDelivery, src.estimated_delivery, src.deliveryDate, src.delivery_date)
          || undefined,
        deliveredAt: pickString(src.deliveredAt, src.delivered_at) || undefined,
      }

  const payment = hasNestedPayment
    ? {
        method: normalizePaymentMethod(src.payment.method ?? src.paymentMethod),
        status: normalizePaymentStatus(src.payment.status ?? src.paymentStatus),
        transactionId:
          pickString(src.payment.transactionId, src.transactionId, src.transaction_id) || undefined,
        paidAt: pickString(src.payment.paidAt, src.paidAt, src.paid_at) || undefined,
      }
    : {
        method: normalizePaymentMethod(src.paymentMethod ?? src.payment_method),
        status: normalizePaymentStatus(src.paymentStatus ?? src.payment_status),
        transactionId: pickString(src.transactionId, src.transaction_id) || undefined,
        paidAt: pickString(src.paidAt, src.paid_at) || undefined,
      }

  const statusHistory = normalizeStatusHistory(
    src.statusHistory ?? src.status_history,
  )

  let status = normalizeStatus(src.status)
  let actionStatus = normalizeActionStatus(src.actionStatus ?? src.action_status)

  const cancelReason = pickString(src.cancelReason, src.cancel_reason)
  const cancelRequestedAt = pickString(src.cancelRequestedAt, src.cancel_requested_at)
  const returnReason = pickString(src.returnReason, src.return_reason)

  // Legacy rows: cancel reason saved without action_status / status update
  if (
    actionStatus === 'none'
    && (cancelReason || cancelRequestedAt)
    && status !== 'canceled'
  ) {
    actionStatus = 'cancel_requested'
  }

  // If status is already cancelled, keep action consistent
  if (status === 'canceled' && actionStatus === 'none') {
    actionStatus = 'cancel_approved'
  }

  return {
    id: pickNumber(src.id),
    date: date || undefined,
    createdAt: pickString(src.createdAt, src.created_at) || undefined,
    status,
    actionStatus,
    total,
    shippingCost,
    walletAmount: pickNumber(src.walletAmount, src.wallet_amount),
    payableAmount: pickNumber(src.payableAmount, src.payable_amount, total),
    discountAmount,
    taxAmount,
    description: pickString(src.description) || undefined,
    cancelReason: cancelReason || undefined,
    cancelRequestedAt: cancelRequestedAt || undefined,
    returnReason: returnReason || undefined,
    address,
    shipping,
    payment,
    statusHistory,
    items,
    itemsCount,
    itemsSubtotal,
  }
}

export function normalizeOrdersList(raw: unknown): OrderWithProducts[] {
  if (!raw) return []

  // Paginated: { data: [...] }
  if (typeof raw === 'object' && raw !== null && Array.isArray((raw as any).data)) {
    return ((raw as any).data as unknown[])
      .map(normalizeOrder)
      .filter((o): o is OrderWithProducts => o != null)
  }

  if (Array.isArray(raw)) {
    return raw
      .map(normalizeOrder)
      .filter((o): o is OrderWithProducts => o != null)
  }

  const single = normalizeOrder(raw)
  return single ? [single] : []
}
