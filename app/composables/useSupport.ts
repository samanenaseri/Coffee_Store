import type {
    CreateSupportTicketPayload,
    SupportTicket,
} from '#shared/support'

interface SupportTicketsResponse {
    success: boolean
    data: SupportTicket[]
}

interface CreateSupportTicketResponse {
    success: boolean
    message: string
    data: SupportTicket
}

export const useSupport = () => {
    const tickets = ref<SupportTicket[]>([])
    const pending = ref(false)
    const submitting = ref(false)
    const error = ref('')
    const submitError = ref('')

    const fetchTickets = async () => {
        pending.value = true
        error.value = ''

        try {
            const response = await $fetch<SupportTicketsResponse>(
                '/api/profile/support',
            )

            tickets.value = response.data
        }
        catch (err) {
            console.error(err)

            error.value = 'دریافت درخواست‌های پشتیبانی با خطا مواجه شد.'
        }
        finally {
            pending.value = false
        }
    }

    const createTicket = async (
        payload: CreateSupportTicketPayload,
    ) => {
        submitting.value = true
        submitError.value = ''

        try {
            const response = await $fetch<CreateSupportTicketResponse>(
                '/api/profile/support',
                {
                    method: 'POST',
                    body: payload,
                },
            )

            tickets.value.unshift(response.data)

            return response
        }
        catch (err: unknown) {
            console.error(err)

            const fetchError = err as {
                data?: {
                    statusMessage?: string
                    message?: string
                }
            }

            submitError.value
                = fetchError.data?.statusMessage
                || fetchError.data?.message
                || 'ثبت درخواست پشتیبانی با خطا مواجه شد.'

            return null
        }
        finally {
            submitting.value = false
        }
    }

    const clearSubmitError = () => {
        submitError.value = ''
    }

    return {
        tickets,
        pending,
        submitting,
        error,
        submitError,
        fetchTickets,
        createTicket,
        clearSubmitError,
    }
}