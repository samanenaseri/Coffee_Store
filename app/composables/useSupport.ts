import type {
    CreateSupportTicketPayload,
    SupportTicket,
    SupportTicketPriority,
    SupportTicketReply,
    SupportTicketStatus,
} from '#shared/support'

/** Map backend / legacy statuses to UI statuses */
function normalizeStatus(raw: unknown): SupportTicketStatus {
    const s = String(raw ?? 'open').toLowerCase().trim()

    if (s === 'replied' || s === 'answered' || s === 'resolved') return 'answered'
    if (s === 'waiting' || s === 'in_progress' || s === 'pending' || s === 'processing') {
        return 'in_progress'
    }
    if (s === 'closed' || s === 'close' || s === 'done') return 'closed'
    if (s === 'open' || s === 'new') return 'open'

    // Unknown → treat as open so UI never crashes on statusMap lookup
    return 'open'
}

function normalizePriority(raw: unknown): SupportTicketPriority {
    const s = String(raw ?? 'normal').toLowerCase()
    if (s === 'low' || s === 'high') return s
    return 'normal'
}

function normalizeReply(raw: any): SupportTicketReply {
    const sender = String(raw?.sender ?? 'user').toLowerCase()
    const isAdmin =
        raw?.isAdminReply === true
        || raw?.is_admin_reply === true
        || sender === 'admin'
        || sender === 'support'

    return {
        id: Number(raw?.id) || 0,
        ticketId: raw?.ticketId ?? raw?.ticket_id,
        sender: isAdmin ? 'admin' : 'user',
        message: String(raw?.message ?? ''),
        createdAt: raw?.createdAt ?? raw?.created_at,
        isAdminReply: isAdmin,
    }
}

function normalizeTicket(raw: any): SupportTicket | null {
    if (!raw || typeof raw !== 'object') return null

    const id = Number(raw.id)
    if (!Number.isFinite(id) || id <= 0) return null

    const repliesRaw = raw.replies ?? raw.messages ?? []
    const replies = Array.isArray(repliesRaw)
        ? repliesRaw.map(normalizeReply).filter((r: SupportTicketReply) => r.message)
        : []

    return {
        id,
        orderId: raw.orderId ?? raw.order_id ?? null,
        subject: String(raw.subject ?? ''),
        message: String(raw.message ?? raw.description ?? ''),
        status: normalizeStatus(raw.status),
        priority: normalizePriority(raw.priority),
        createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
        updatedAt: raw.updatedAt ?? raw.updated_at,
        replies,
    }
}

function extractTicketList(raw: any): SupportTicket[] {
    if (!raw) return []

    // Laravel paginator: { data: [...] }
    if (Array.isArray(raw.data)) {
        return raw.data.map(normalizeTicket).filter(Boolean) as SupportTicket[]
    }

    // { tickets: [...] }
    if (Array.isArray(raw.tickets)) {
        return raw.tickets.map(normalizeTicket).filter(Boolean) as SupportTicket[]
    }

    if (Array.isArray(raw)) {
        return raw.map(normalizeTicket).filter(Boolean) as SupportTicket[]
    }

    // Single ticket wrapper
    if (raw.ticket) {
        const t = normalizeTicket(raw.ticket)
        return t ? [t] : []
    }

    const single = normalizeTicket(raw)
    return single ? [single] : []
}

export const useSupport = () => {
    const { apiFetch } = useApi()

    const tickets = ref<SupportTicket[]>([])
    const pending = ref(false)
    const submitting = ref(false)
    const error = ref('')
    const submitError = ref('')

    const fetchTickets = async () => {
        pending.value = true
        error.value = ''

        try {
            // useApi already camelizes keys
            const raw = await apiFetch<any>('/support')
            tickets.value = extractTicketList(raw)
        }
        catch (err) {
            console.error(err)
            error.value = 'دریافت درخواست‌های پشتیبانی با خطا مواجه شد.'
            // Keep previous tickets if any
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
            const raw = await apiFetch<any>(
                '/support',
                {
                    method: 'POST',
                    body: {
                        subject: payload.subject,
                        message: payload.message,
                        order_id: payload.orderId,
                        priority: payload.priority,
                    },
                },
            )

            const ticket = normalizeTicket(raw?.ticket ?? raw)
            if (ticket) {
                tickets.value = [ticket, ...tickets.value.filter(t => t.id !== ticket.id)]
            }
            else {
                await fetchTickets()
            }

            return {
                message: String(raw?.message || 'درخواست با موفقیت ثبت شد.'),
                ticket,
            }
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
