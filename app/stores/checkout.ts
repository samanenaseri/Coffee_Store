import { defineStore } from "pinia"

type ShippingMethod = "post" | "express" | "pickup"
type PaymentMethod = "online" | "cod"

export const useCheckoutStore = defineStore("checkout", () => {
    const cartStore = useCartStore()

    const step = ref(1)

    const shippingMethod = ref<ShippingMethod>("post")
    const paymentMethod = ref<PaymentMethod>("online")

    const shippingInfo = computed(() => {
        switch (shippingMethod.value) {
            case "post":
                return {
                    value: "post" as const,
                    label: "پست پیشتاز",
                    price: 60000,
                }

            case "express":
                return {
                    value: "express" as const,
                    label: "ارسال فوری",
                    price: 120000,
                }

            case "pickup":
                return {
                    value: "pickup" as const,
                    label: "تحویل حضوری",
                    price: 0,
                }

            default:
                return {
                    value: "post" as const,
                    label: "پست پیشتاز",
                    price: 60000,
                }
        }
    })

    const paymentInfo = computed(() => {
        switch (paymentMethod.value) {
            case "online":
                return {
                    value: "online" as const,
                    label: "پرداخت آنلاین",
                }

            case "cod":
                return {
                    value: "cod" as const,
                    label: "پرداخت در محل",
                }

            default:
                return {
                    value: "online" as const,
                    label: "پرداخت آنلاین",
                }
        }
    })

    const finalPrice = computed(() => {
        return cartStore.totalPrice + shippingInfo.value.price
    })

    const nextStep = () => {
        if (step.value < 5) {
            step.value++
        }
    }

    const prevStep = () => {
        if (step.value > 1) {
            step.value--
        }
    }

    const setShipping = (method: ShippingMethod) => {
        shippingMethod.value = method
    }

    const setPayment = (method: PaymentMethod) => {
        paymentMethod.value = method
    }

    const resetCheckout = () => {
        step.value = 1
        shippingMethod.value = "post"
        paymentMethod.value = "online"
    }

    return {
        step,
        shippingMethod,
        paymentMethod,

        shippingInfo,
        paymentInfo,
        finalPrice,

        nextStep,
        prevStep,
        setShipping,
        setPayment,
        resetCheckout,
    }
})