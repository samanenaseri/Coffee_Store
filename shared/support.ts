export type SupportTicketStatus =
    | 'open'
    | 'in_progress'
    | 'answered'
    | 'closed'

export type SupportTicketPriority =
    | 'low'
    | 'normal'
    | 'high'

export interface SupportTicket {
    id: number
    orderId?: number
    subject: string
    message: string
    status: SupportTicketStatus
    priority: SupportTicketPriority
    createdAt: string
    updatedAt: string
}

export interface CreateSupportTicketPayload {
    orderId?: number
    subject: string
    message: string
    priority: SupportTicketPriority
}