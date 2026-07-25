import {
    mockWallet,
    mockWalletTransactions,
} from '#server/mock/wallet'

import type {
    ChargeWalletPayload,
    ChargeWalletResult,
    WalletTransaction,
} from '#shared/wallet'

export default defineEventHandler(
    async event => {
        const body =
            await readBody<ChargeWalletPayload>(
                event,
            )

        const amount = Number(body?.amount)

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    'مبلغ شارژ کیف پول معتبر نیست',
            })
        }

        const normalizedAmount =
            Math.trunc(amount)

        const now =
            new Date().toISOString()

        const transaction:
            WalletTransaction = {
            id: Date.now(),

            type: 'charge',
            direction: 'credit',
            status: 'completed',

            title: 'شارژ کیف پول',
            description:
                'افزایش موجودی کیف پول',

            amount: normalizedAmount,

            referenceId:
                `CHARGE-${Date.now()}`,

            createdAt: now,
        }

        mockWallet.balance +=
            normalizedAmount

        mockWallet.updatedAt = now

        mockWalletTransactions.unshift(
            transaction,
        )

        const result: ChargeWalletResult = {
            wallet: {
                ...mockWallet,
            },

            transaction: {
                ...transaction,
            },
        }

        return {
            success: true,
            message:
                'کیف پول با موفقیت شارژ شد',
            data: result,
        }
    },
)