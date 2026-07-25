import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type {
    ChargeWalletResult,
    Wallet,
    WalletTransaction,
} from '#shared/wallet'

interface PaginatedResponse<T> {
    current_page: number
    data: T[]
    last_page: number
    total: number
}

interface ApiErrorData {
    statusMessage?: string
    message?: string
}

interface ApiError {
    data?: ApiErrorData
    statusMessage?: string
    message?: string
}

const getErrorMessage = (
    exception: unknown,
    fallbackMessage: string,
) => {
    if (
        typeof exception !== 'object' ||
        exception === null
    ) {
        return fallbackMessage
    }

    const error = exception as ApiError

    return (
        error.data?.statusMessage ||
        error.data?.message ||
        error.statusMessage ||
        error.message ||
        fallbackMessage
    )
}

const snakeToCamel = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

const convertKeysToCamel = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysToCamel)
    }

    if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                snakeToCamel(key),
                convertKeysToCamel(value),
            ]),
        )
    }

    return obj
}

export const useWalletStore = defineStore(
    'wallet',
    () => {
        const { apiFetch } = useApi()

        // =========================
        // STATE
        // =========================
        const wallet = ref<Wallet | null>(null)

        const transactions =
            ref<WalletTransaction[]>([])

        const pending = ref(false)
        const transactionsPending = ref(false)
        const submitting = ref(false)

        const error = ref('')
        const actionError = ref('')

        // =========================
        // COMPUTED
        // =========================
        const balance = computed(() => {
            const value = wallet.value?.balance ?? 0

            return Number.isFinite(Number(value))
                ? Number(value)
                : 0
        })

        const balanceInToman = computed(() => {
            return Math.trunc(balance.value / 10)
        })

        const currency = computed(() => {
            return wallet.value?.currency ?? 'IRR'
        })

        const updatedAt = computed(() => {
            return wallet.value?.updatedAt ?? null
        })

        const hasTransactions = computed(() => {
            return transactions.value.length > 0
        })

        // =========================
        // DIRECT UPDATE ACTIONS
        // =========================
        const setWallet = (
            updatedWallet: Wallet,
        ) => {
            wallet.value = {
                ...updatedWallet,
            }
        }

        const addTransaction = (
            transaction: WalletTransaction,
        ) => {
            transactions.value = [
                {
                    ...transaction,
                },

                ...transactions.value.filter(
                    item => item.id !== transaction.id,
                ),
            ]
        }

        // =========================
        // FETCH WALLET
        // =========================
        const fetchWallet = async () => {
            pending.value = true
            error.value = ''

            try {
                const raw =
                    await apiFetch('/wallet')

                const response = convertKeysToCamel(raw) as Wallet

                setWallet(response)

                return response
            } catch (exception) {
                console.error(
                    'Fetch wallet error:',
                    exception,
                )

                error.value = getErrorMessage(
                    exception,
                    'دریافت اطلاعات کیف پول ناموفق بود',
                )

                return null
            } finally {
                pending.value = false
            }
        }

        // =========================
        // FETCH TRANSACTIONS
        // =========================
        const fetchTransactions = async () => {
            transactionsPending.value = true
            error.value = ''

            try {
                const raw =
                    await apiFetch('/wallet/transactions')

                const response = convertKeysToCamel(raw) as PaginatedResponse<WalletTransaction>

                transactions.value =
                    response.data.map(transaction => ({
                        ...transaction,
                    }))

                return response
            } catch (exception) {
                console.error(
                    'Fetch wallet transactions error:',
                    exception,
                )

                error.value = getErrorMessage(
                    exception,
                    'دریافت تراکنش‌های کیف پول ناموفق بود',
                )

                return null
            } finally {
                transactionsPending.value = false
            }
        }

        // =========================
        // FETCH WALLET PAGE DATA
        // =========================
        const fetchWalletData = async () => {
            const [
                walletResponse,
                transactionsResponse,
            ] = await Promise.all([
                fetchWallet(),
                fetchTransactions(),
            ])

            return {
                walletResponse,
                transactionsResponse,
            }
        }

        // =========================
        // CHARGE WALLET
        // =========================
        const chargeWallet = async (
            amount: number,
        ) => {
            if (submitting.value) {
                return null
            }

            const normalizedAmount =
                Math.trunc(Number(amount))

            if (
                !Number.isFinite(normalizedAmount) ||
                normalizedAmount <= 0
            ) {
                actionError.value =
                    'مبلغ شارژ کیف پول معتبر نیست'

                return null
            }

            submitting.value = true
            actionError.value = ''

            try {
                const raw =
                    await apiFetch(
                        '/wallet/charge',
                        {
                            method: 'POST',

                            body: {
                                amount: normalizedAmount,
                            },
                        },
                    )

                const response = convertKeysToCamel(raw) as ChargeWalletResult & { message: string }

                setWallet(response.wallet)

                addTransaction(
                    response.transaction,
                )

                return response
            } catch (exception) {
                console.error(
                    'Charge wallet error:',
                    exception,
                )

                actionError.value =
                    getErrorMessage(
                        exception,
                        'شارژ کیف پول ناموفق بود',
                    )

                return null
            } finally {
                submitting.value = false
            }
        }

        // =========================
        // ERROR ACTIONS
        // =========================
        const clearError = () => {
            error.value = ''
        }

        const clearActionError = () => {
            actionError.value = ''
        }

        // =========================
        // RESET
        // =========================
        const resetWalletStore = () => {
            wallet.value = null
            transactions.value = []

            pending.value = false
            transactionsPending.value = false
            submitting.value = false

            error.value = ''
            actionError.value = ''
        }

        return {
            wallet,
            transactions,

            pending,
            transactionsPending,
            submitting,

            error,
            actionError,

            balance,
            balanceInToman,
            currency,
            updatedAt,
            hasTransactions,

            fetchWallet,
            fetchTransactions,
            fetchWalletData,
            chargeWallet,

            setWallet,
            addTransaction,

            clearError,
            clearActionError,
            resetWalletStore,
        }
    },
)
