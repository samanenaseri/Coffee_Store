import {
    mockWalletTransactions,
} from '#server/mock/wallet'

export default defineEventHandler(() => {
    const transactions = [
        ...mockWalletTransactions,
    ].sort((firstTransaction, secondTransaction) => {
        return (
            new Date(
                secondTransaction.createdAt,
            ).getTime() -
            new Date(
                firstTransaction.createdAt,
            ).getTime()
        )
    })

    return {
        success: true,
        data: transactions,
    }
})