import { mockWallet } from '#server/mock/wallet'

export default defineEventHandler(() => {
    return {
        success: true,
        data: {
            ...mockWallet,
        },
    }
})