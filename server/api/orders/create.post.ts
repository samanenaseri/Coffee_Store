import {
    mockOrders,
} from '#server/mock/orders'

import {
    mockWallet,
    mockWalletTransactions,
} from '#server/mock/wallet'

import type {
    Order,
    OrderAddress,
    OrderItem,
    OrderPayment,
    OrderShipping,
    PaymentMethod,
} from '#shared/order'

import type {
    WalletTransaction,
} from '#shared/wallet'

type RemainingPaymentMethod = Exclude<
    PaymentMethod,
    'wallet'
>

interface CreateOrderBody {
    address: OrderAddress

    shipping: OrderShipping

    payment: {
        method: RemainingPaymentMethod
    }

    useWallet: boolean

    items: OrderItem[]

    // مبلغ کل سفارش بر حسب تومان
    total: number
}

export default defineEventHandler(
    async event => {
        const body =
            await readBody<CreateOrderBody>(
                event,
            )

        if (!body.address) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    'آدرس سفارش الزامی است',
            })
        }

        if (
            !Array.isArray(body.items) ||
            body.items.length === 0
        ) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    'سبد خرید خالی است',
            })
        }

        const totalInToman =
            Math.trunc(Number(body.total))

        if (
            !Number.isFinite(totalInToman) ||
            totalInToman <= 0
        ) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    'مبلغ سفارش معتبر نیست',
            })
        }

        if (!body.payment?.method) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    'روش پرداخت مشخص نشده است',
            })
        }

        const now =
            new Date().toISOString()

        const orderId = Date.now()

        const totalInRial =
            totalInToman * 10

        // =========================
        // WALLET CALCULATION
        // =========================
        let walletAmountInRial = 0

        if (body.useWallet) {
            if (mockWallet.balance <= 0) {
                throw createError({
                    statusCode: 422,
                    statusMessage:
                        'کیف پول شما موجودی ندارد',
                })
            }

            walletAmountInRial = Math.min(
                mockWallet.balance,
                totalInRial,
            )
        }

        const walletAmountInToman =
            Math.trunc(
                walletAmountInRial / 10,
            )

        const payableAmountInToman =
            Math.max(
                totalInToman -
                walletAmountInToman,
                0,
            )

        // =========================
        // PAYMENT
        // =========================
        let payment: OrderPayment

        if (
            body.useWallet &&
            payableAmountInToman === 0
        ) {
            payment = {
                method: 'wallet',
                status: 'paid',
                paidAt: now,
            }
        } else {
            payment = {
                method: body.payment.method,
                status: 'pending',
            }
        }

        // =========================
        // WALLET TRANSACTION
        // =========================
        let walletTransaction:
            WalletTransaction | null = null

        if (walletAmountInRial > 0) {
            const referenceId =
                `WALLET-PAY-${orderId}`

            mockWallet.balance -=
                walletAmountInRial

            mockWallet.updatedAt = now

            walletTransaction = {
                id: Date.now() + 1,

                type: 'purchase',

                direction: 'debit',

                status: 'completed',

                title: 'پرداخت سفارش',

                description:
                    'استفاده از موجودی کیف پول برای پرداخت سفارش',

                amount:
                walletAmountInRial,

                orderId,

                referenceId,

                createdAt: now,
            }

            mockWalletTransactions.unshift(
                walletTransaction,
            )

            payment.transactionId =
                referenceId
        }

        // =========================
        // STATUS DESCRIPTION
        // =========================
        let paymentDescription =
            'سفارش در انتظار پرداخت یا بررسی است'

        if (
            body.useWallet &&
            payableAmountInToman === 0
        ) {
            paymentDescription =
                'کل مبلغ سفارش از کیف پول پرداخت شد و سفارش در انتظار بررسی است'
        } else if (
            body.useWallet &&
            walletAmountInToman > 0
        ) {
            paymentDescription =
                `${walletAmountInToman.toLocaleString('fa-IR')} تومان از کیف پول کسر شد و ` +
                `${payableAmountInToman.toLocaleString('fa-IR')} تومان برای پرداخت باقی مانده است`
        }

        // =========================
        // ORDER
        // =========================
        const order: Order = {
            id: orderId,

            date: now,

            status: 'pending',

            actionStatus: 'none',

            address: body.address,

            shipping: {
                method:
                body.shipping.method,

                cost:
                body.shipping.cost,
            },

            payment,

            total: totalInToman,

            walletAmount:
            walletAmountInToman,

            payableAmount:
            payableAmountInToman,

            discountAmount: 0,

            taxAmount: 0,

            statusHistory: [
                {
                    status:
                        'order_created',

                    description:
                        'سفارش با موفقیت ثبت شد',

                    date: now,
                },

                {
                    status: 'pending',

                    description:
                    paymentDescription,

                    date: now,
                },
            ],

            items: body.items,
        }

        mockOrders.unshift(order)

        // تراکنش را اینجا دوباره اضافه نکن.
        // قبلاً داخل شرط walletAmountInRial ثبت شده است.

        return {
            success: true,

            message:
                'سفارش با موفقیت ثبت شد',

            data: order,

            wallet:
                walletAmountInRial > 0
                    ? {
                        ...mockWallet,
                    }
                    : null,

            walletTransaction:
                walletTransaction
                    ? {
                        ...walletTransaction,
                    }
                    : null,
        }
    },
)