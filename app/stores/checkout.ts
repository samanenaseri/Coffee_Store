import { defineStore } from 'pinia'

import type {
    Order,
    PaymentMethod as OrderPaymentMethod,
} from '#shared/order'

import type {
    Wallet,
    WalletTransaction,
} from '#shared/wallet'

import {
    buildDeliverySlotOptions,
    parseDeliverySlotValue,
    type DeliverySlotOption,
} from '~/utils/deliverySlots'

type ShippingMethod =
    | 'post'
    | 'express'
    | 'pickup'

type CheckoutPaymentMethod =
    | 'card_to_card'
    | 'cod'
    | 'wallet'

interface CreateOrderResponse {
    data: Order
    wallet: Wallet | null
    walletTransaction: WalletTransaction | null
}

const useWallet = ref(false)
export const useCheckoutStore = defineStore(
    'checkout',
    () => {
        const { apiFetch } = useApi()

        const cartStore = useCartStore()
        const addressStore = useAddressStore()
        const walletStore = useWalletStore()

        // =========================
        // STEP (2=selection, 3=summary)
        // =========================
        const step = ref(1)

        const setStepForAuth = (loggedIn: boolean) => {
            step.value = loggedIn ? 2 : 1
        }

        // =========================
        // SELECTION STATE
        // =========================
        const shippingMethod =
            ref<ShippingMethod>('post')

        const paymentMethod =
            ref<CheckoutPaymentMethod>('card_to_card')

        /** Value format: YYYY-MM-DD_morning|afternoon */
        const deliveryDay = ref<string>('')

        const deliveryOptions = ref<DeliverySlotOption[]>(
            buildDeliverySlotOptions({
                minBusinessDays: 3,
                businessDaysCount: 10,
            }),
        )

        const selectedAddressId =
            ref<number | null>(null)

        const selectedAddress = computed(() => {
            if (selectedAddressId.value === null) {
                return null
            }

            return (
                addressStore.getAddressById(
                    selectedAddressId.value,
                ) ?? null
            )
        })

        // =========================
        // COMPUTED
        // =========================
        const shippingInfo = computed(() => {
            switch (shippingMethod.value) {
                case 'express':
                    return {
                        value: 'express' as const,
                        label: 'ارسال فوری',
                        price: 120000,
                    }

                case 'pickup':
                    return {
                        value: 'pickup' as const,
                        label: 'تحویل حضوری',
                        price: 0,
                    }

                case 'post':
                default:
                    return {
                        value: 'post' as const,
                        label: 'پست پیشتاز',
                        price: 60000,
                    }
            }
        })

        const paymentInfo = computed(() => {
            switch (paymentMethod.value) {
                case 'cod':
                    return {
                        value: 'cod' as const,
                        label: 'پرداخت در محل (درب منزل)',
                    }

                case 'wallet':
                    return {
                        value: 'wallet' as const,
                        label: 'پرداخت از کیف پول',
                    }

                case 'card_to_card':
                default:
                    return {
                        value: 'card_to_card' as const,
                        label: 'کارت‌به‌کارت',
                    }
            }
        })

        const deliveryDayLabel = computed(() => {
            const found = deliveryOptions.value.find(d => d.value === deliveryDay.value)
            if (found) return found.fullLabel
            return parseDeliverySlotValue(deliveryDay.value).label
        })

        const selectedDeliveryMeta = computed(() => {
            return deliveryOptions.value.find(d => d.value === deliveryDay.value) || null
        })

        const orderTotal = computed(() => {
            return (
                cartStore.totalPrice +
                shippingInfo.value.price
            )
        })

        const walletAmountUsed = computed(() => {
            if (!useWallet.value) {
                return 0
            }

            return Math.min(
                walletStore.balanceInToman,
                orderTotal.value,
            )
        })

        const finalPrice = computed(() => {
            return Math.max(
                orderTotal.value -
                walletAmountUsed.value,
                0,
            )
        })

        const walletBalanceAfterPayment = computed(() => {
            return Math.max(
                walletStore.balanceInToman -
                walletAmountUsed.value,
                0,
            )
        })

        const isFullyPaidByWallet = computed(() => {
            return (
                useWallet.value &&
                finalPrice.value === 0
            )
        })

        const setUseWallet = (value: boolean) => {
            useWallet.value = value
            error.value = ''
        }

        // =========================
        // REQUEST STATE
        // =========================
        const pending = ref(false)
        const error = ref('')

        // =========================
        // NAVIGATION
        // =========================
        const nextStep = () => {
            if (step.value < 3) {
                step.value++
            }
        }

        const prevStep = () => {
            if (step.value > 2) {
                step.value--
            }
        }

        // =========================
        // ACTIONS
        // =========================
        const setShipping = (method: ShippingMethod) => {
            shippingMethod.value = method
        }

        const setPayment = (method: CheckoutPaymentMethod) => {
            paymentMethod.value = method
        }

        const setDeliveryDay = (day: string) => {
            deliveryDay.value = day
        }

        const refreshDeliveryOptions = () => {
            deliveryOptions.value = buildDeliverySlotOptions({
                minBusinessDays: 3,
                businessDaysCount: 10,
            })
            // Drop selection if no longer valid
            if (
                deliveryDay.value
                && !deliveryOptions.value.some(o => o.value === deliveryDay.value)
            ) {
                deliveryDay.value = ''
            }
        }

        const setAddress = (id: number) => {
            selectedAddressId.value = id
            error.value = ''
        }

        const clearAddress = () => {
            selectedAddressId.value = null
        }

        const clearError = () => {
            error.value = ''
        }

        // =========================
        // VALIDATE SELECTION STEP
        // =========================
        const validateSelection = (): string | null => {
            if (selectedAddressId.value === null) {
                return 'لطفاً یک آدرس انتخاب کنید'
            }
            if (!shippingMethod.value) {
                return 'لطفاً روش ارسال را انتخاب کنید'
            }
            if (!deliveryDay.value) {
                return 'لطفاً تاریخ و بازه زمانی ارسال را انتخاب کنید'
            }
            if (!paymentMethod.value) {
                return 'لطفاً روش پرداخت را انتخاب کنید'
            }
            return null
        }

        // =========================
        // RESET
        // =========================
        const resetCheckout = () => {
            step.value = 1
            shippingMethod.value = 'post'
            paymentMethod.value = 'card_to_card'
            deliveryDay.value = ''
            useWallet.value = false
            selectedAddressId.value = null
            error.value = ''
        }

        // =========================
        // PLACE ORDER
        // =========================
        const placeOrder = async () => {
            if (pending.value) {
                return
            }

            const currentAddress = selectedAddress.value

            if (
                selectedAddressId.value === null ||
                !currentAddress
            ) {
                error.value = 'لطفاً یک آدرس انتخاب کنید'
                return
            }

            if (cartStore.items.length === 0) {
                error.value = 'سبد خرید شما خالی است'
                return
            }

            pending.value = true
            error.value = ''

            try {
                if (
                    useWallet.value &&
                    !walletStore.wallet
                ) {
                    const walletResponse =
                        await walletStore.fetchWallet()

                    if (!walletResponse) {
                        error.value =
                            'دریافت موجودی کیف پول ناموفق بود'
                        return
                    }
                }

                if (
                    useWallet.value &&
                    walletStore.balance <= 0
                ) {
                    error.value =
                        'کیف پول شما موجودی ندارد'
                    return
                }

                // Support both camelCase and snake_case address fields from store/API
                const addr = currentAddress as Record<string, any>
                const receiverName = String(addr.receiverName ?? addr.receiver_name ?? '').trim()
                const phone = String(addr.phone ?? '').trim()
                const province = String(addr.province ?? '').trim()
                const city = String(addr.city ?? '').trim()
                const postalCode = String(addr.postalCode ?? addr.postal_code ?? '').trim()
                const fullAddress = String(addr.address ?? '').trim()

                if (!receiverName || !phone || !province || !city || !postalCode || !fullAddress) {
                    error.value = 'اطلاعات آدرس ناقص است. لطفاً آدرس را ویرایش یا دوباره انتخاب کنید.'
                    return
                }

                const items = cartStore.items.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    unit_price: item.product.price,
                }))

                const remainingPaymentMethod:
                    OrderPaymentMethod =
                    paymentMethod.value === 'cod'
                        ? 'cash_on_delivery'
                        : paymentMethod.value === 'wallet'
                            ? 'wallet'
                            : 'card_to_card'

                // total = cart only (without shipping); backend adds shipping
                const itemsTotal = cartStore.totalPrice

                const response =
                    await apiFetch<CreateOrderResponse>(
                        '/orders',
                        {
                            method: 'POST',

                            body: {
                                address: {
                                    receiver_name: receiverName,
                                    phone,
                                    province,
                                    city,
                                    postal_code: postalCode,
                                    address: fullAddress,
                                },
                                shipping: {
                                    method: shippingMethod.value,
                                    cost: shippingInfo.value.price,
                                },
                                payment: {
                                    method: remainingPaymentMethod,
                                },
                                delivery_day: deliveryDay.value || null,
                                delivery_date: selectedDeliveryMeta.value?.date || null,
                                delivery_slot: selectedDeliveryMeta.value?.slot || null,
                                use_wallet: useWallet.value,
                                items,
                                total: itemsTotal,
                            },
                        },
                    )

                const orderId =
                    response.data.id

                if (response.wallet) {
                    walletStore.setWallet(
                        response.wallet,
                    )
                }

                if (
                    response.walletTransaction
                ) {
                    walletStore.addTransaction(
                        response.walletTransaction,
                    )
                }

                cartStore.clearCart()
                resetCheckout()

                // Post-order payment / status page
                await navigateTo(
                    `/checkout/payment/${orderId}`,
                )
            } catch (exception) {
                console.error(
                    'Create order error:',
                    exception,
                )

                const apiError = exception as {
                    data?: {
                        statusMessage?: string
                        message?: string
                        errors?: Record<string, string[]>
                    }
                    statusMessage?: string
                    message?: string
                }

                // Flatten Laravel validation errors into a readable message
                const validationErrors = apiError.data?.errors
                let validationMessage = ''
                if (validationErrors && typeof validationErrors === 'object') {
                    validationMessage = Object.values(validationErrors)
                        .flat()
                        .filter(Boolean)
                        .join(' ')
                }

                error.value =
                    validationMessage ||
                    apiError.data?.statusMessage ||
                    apiError.data?.message ||
                    apiError.statusMessage ||
                    apiError.message ||
                    'خطا در ثبت سفارش رخ داد'
            } finally {
                pending.value = false
            }
        }

        return {
            step,
            setStepForAuth,

            shippingMethod,
            paymentMethod,
            deliveryDay,
            deliveryOptions,

            selectedAddressId,
            selectedAddress,

            shippingInfo,
            paymentInfo,
            deliveryDayLabel,
            selectedDeliveryMeta,
            finalPrice,
            orderTotal,
            walletAmountUsed,
            walletBalanceAfterPayment,
            isFullyPaidByWallet,

            pending,
            error,

            nextStep,
            prevStep,
            useWallet,
            setUseWallet,

            setShipping,
            setPayment,
            setDeliveryDay,
            refreshDeliveryOptions,
            setAddress,
            clearAddress,
            clearError,
            validateSelection,

            resetCheckout,
            placeOrder,
        }
    },
)
