export type SupportTicketStatus =
    | 'open'
    | 'in_progress'
    | 'answered'
    | 'closed'
    // Legacy / backend aliases (normalized on client)
    | 'replied'
    | 'waiting'

export type SupportTicketPriority =
    | 'low'
    | 'normal'
    | 'high'

export interface SupportTicketReply {
    id: number
    ticketId?: number
    sender: 'admin' | 'user' | string
    message: string
    createdAt?: string
    isAdminReply?: boolean
}

export interface SupportTicket {
    id: number
    orderId?: number | null
    subject: string
    message: string
    status: SupportTicketStatus
    priority: SupportTicketPriority
    createdAt: string
    updatedAt?: string
    replies?: SupportTicketReply[]
}

export interface CreateSupportTicketPayload {
    orderId?: number
    subject: string
    message: string
    priority: SupportTicketPriority
}
