import type { OrderWithProducts } from '#shared/order'

interface OrdersResponse {
    success: boolean
    data: OrderWithProducts[]
}

interface OrderResponse {
    success: boolean
    data: OrderWithProducts
}

interface OrderActionResponse {
    success: boolean
    message: string
}

export const useOrders = () => {
    /*
     * لیست سفارش‌ها
     */
    const {
        data,
        pending,
        error,
        refresh,
    } = useAsyncData<OrdersResponse>(
        'profile-orders',
        () => $fetch<OrdersResponse>('/api/profile/orders'),
    )

    const orders = computed<OrderWithProducts[]>(() => {
        return data.value?.data ?? []
    })

    /*
     * جزئیات یک سفارش
     */
    const order = ref<OrderWithProducts | null>(null)
    const orderPending = ref(false)
    const orderError = ref<unknown>(null)

    /*
     * عملیات لغو و مرجوعی
     */
    const actionPending = ref(false)
    const actionError = ref<unknown>(null)
    const actionMessage = ref('')

    const getOrderById = async (
        id: string | number,
    ): Promise<OrderWithProducts | null> => {
        orderPending.value = true
        orderError.value = null
        order.value = null

        try {
            const response = await $fetch<OrderResponse>(
                `/api/profile/orders/${id}`,
            )

            order.value = response.data

            return response.data
        }
        catch (err) {
            orderError.value = err

            return null
        }
        finally {
            orderPending.value = false
        }
    }

    const cancelOrder = async (
        id: string | number,
        reason: string,
    ): Promise<boolean> => {
        actionPending.value = true
        actionError.value = null
        actionMessage.value = ''

        try {
            const response = await $fetch<OrderActionResponse>(
                `/api/profile/orders/${id}/cancel`,
                {
                    method: 'POST',
                    body: {
                        reason,
                    },
                },
            )

            actionMessage.value = response.message

            // جزئیات سفارش دوباره از API خوانده می‌شود
            // تا timeline و actionStatus جدید نمایش داده شوند.
            await getOrderById(id)

            // لیست سفارش‌ها نیز به‌روزرسانی می‌شود.
            await refresh()

            return true
        }
        catch (err) {
            actionError.value = err

            return false
        }
        finally {
            actionPending.value = false
        }
    }

    const requestReturn = async (
        id: string | number,
        reason: string,
    ): Promise<boolean> => {
        actionPending.value = true
        actionError.value = null
        actionMessage.value = ''

        try {
            const response = await $fetch<OrderActionResponse>(
                `/api/profile/orders/${id}/return`,
                {
                    method: 'POST',
                    body: {
                        reason,
                    },
                },
            )

            actionMessage.value = response.message

            await getOrderById(id)
            await refresh()

            return true
        }
        catch (err) {
            actionError.value = err

            return false
        }
        finally {
            actionPending.value = false
        }
    }

    const clearActionState = () => {
        actionError.value = null
        actionMessage.value = ''
    }

    const clearOrder = () => {
        order.value = null
        orderError.value = null
        clearActionState()
    }

    return {
        // لیست سفارش‌ها
        orders,
        pending,
        error,
        refresh,

        // جزئیات سفارش
        order,
        orderPending,
        orderError,
        getOrderById,
        clearOrder,

        // لغو و مرجوعی
        actionPending,
        actionError,
        actionMessage,
        cancelOrder,
        requestReturn,
        clearActionState,
    }
}