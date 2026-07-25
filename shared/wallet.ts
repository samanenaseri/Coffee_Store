export type WalletCurrency = 'IRR'

export type WalletTransactionType =
    | 'charge'
    | 'purchase'
    | 'refund'
    | 'adjustment'

export type WalletTransactionDirection =
    | 'credit'
    | 'debit'

export type WalletTransactionStatus =
    | 'pending'
    | 'completed'
    | 'failed'

export interface Wallet {
    balance: number
    currency: WalletCurrency
    updatedAt: string
}

export interface WalletTransaction {
    id: number

    type: WalletTransactionType
    direction: WalletTransactionDirection
    status: WalletTransactionStatus

    title: string
    description?: string

    amount: number

    orderId?: number
    referenceId?: string

    createdAt: string
}

export interface WalletDetails extends Wallet {
    transactions: WalletTransaction[]
}

export interface ChargeWalletPayload {
    amount: number
}

export interface ChargeWalletResult {
    wallet: Wallet
    transaction: WalletTransaction
}