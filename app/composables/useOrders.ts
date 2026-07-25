import type { OrderWithProducts } from '#shared/order'
import { normalizeOrder, normalizeOrdersList } from '~/utils/orderNormalize'

interface OrdersPaginatedResponse {
    current_page: number
    data: OrderWithProducts[]
    last_page: number
    total: number
    per_page: number
}

interface OrderActionResponse {
    message: string
    order?: unknown
}

export const useOrders = () => {
    const { apiFetch } = useApi()

    const {
        data,
        pending,
        error,
        refresh,
    } = useAsyncData<OrdersPaginatedResponse>(
        'profile-orders',
        async () => {
            const res = await apiFetch<any>('/profile/orders')
            const list = normalizeOrdersList(res)

            // Preserve pagination meta when present
            if (res && typeof res === 'object' && Array.isArray(res.data)) {
                return {
                    current_page: Number(res.currentPage ?? res.current_page ?? 1),
                    data: list,
                    last_page: Number(res.lastPage ?? res.last_page ?? 1),
                    total: Number(res.total ?? list.length),
                    per_page: Number(res.perPage ?? res.per_page ?? list.length),
                }
            }

            return {
                current_page: 1,
                data: list,
                last_page: 1,
                total: list.length,
                per_page: list.length,
            }
        },
    )

    const orders = computed<OrderWithProducts[]>(() => {
        return data.value?.data ?? []
    })

    const order = ref<OrderWithProducts | null>(null)
    const orderPending = ref(false)
    const orderError = ref<unknown>(null)

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
            const response = await apiFetch<unknown>(
                `/profile/orders/${id}`,
            )

            const normalized = normalizeOrder(response)

            if (!normalized) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'سفارش پیدا نشد',
                })
            }

            order.value = normalized
            return normalized
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
            const response = await apiFetch<OrderActionResponse>(
                `/profile/orders/${id}/cancel`,
                {
                    method: 'POST',
                    body: { reason },
                },
            )

            actionMessage.value = response.message || 'درخواست لغو ثبت شد.'

            // Prefer order from response; otherwise re-fetch
            const fromBody = normalizeOrder(response)
            if (fromBody) {
                order.value = fromBody
            } else {
                await getOrderById(id)
            }
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
            const response = await apiFetch<OrderActionResponse>(
                `/profile/orders/${id}/return`,
                {
                    method: 'POST',
                    body: { reason },
                },
            )

            actionMessage.value = response.message || 'درخواست مرجوعی ثبت شد.'

            const fromBody = normalizeOrder(response)
            if (fromBody) {
                order.value = fromBody
            } else {
                await getOrderById(id)
            }
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
        orders,
        pending,
        error,
        refresh,

        order,
        orderPending,
        orderError,
        getOrderById,
        clearOrder,

        actionPending,
        actionError,
        actionMessage,
        cancelOrder,
        requestReturn,
        clearActionState,
    }
}
