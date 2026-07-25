import type {
    Wallet,
    WalletTransaction,
} from '#shared/wallet'

export const mockWallet: Wallet = {
    balance: 2_500_000,
    currency: 'IRR',
    updatedAt: new Date().toISOString(),
}

export const mockWalletTransactions: WalletTransaction[] = [
    {
        id: 3,
        type: 'refund',
        direction: 'credit',
        status: 'completed',
        title: 'بازگشت مبلغ سفارش',
        description: 'مبلغ سفارش لغوشده به کیف پول بازگردانده شد',
        amount: 350_000,
        orderId: 1003,
        referenceId: 'REF-1003',
        createdAt: '2026-06-26T10:30:00.000Z',
    },
    {
        id: 2,
        type: 'purchase',
        direction: 'debit',
        status: 'completed',
        title: 'پرداخت سفارش',
        description: 'پرداخت سفارش از طریق کیف پول',
        amount: 850_000,
        orderId: 1002,
        referenceId: 'PAY-1002',
        createdAt: '2026-06-24T14:15:00.000Z',
    },
    {
        id: 1,
        type: 'charge',
        direction: 'credit',
        status: 'completed',
        title: 'شارژ کیف پول',
        description: 'افزایش موجودی کیف پول',
        amount: 3_000_000,
        referenceId: 'CHARGE-1001',
        createdAt: '2026-06-23T08:45:00.000Z',
    },
]