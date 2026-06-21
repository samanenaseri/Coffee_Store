import type {
    CreateSupportTicketPayload,
    SupportTicket,
} from '#shared/support'

import { supportTickets } from '#server/mock/supportTickets'

export default defineEventHandler(async (event) => {
    const body = await readBody<CreateSupportTicketPayload>(event)

    const subject = body.subject?.trim()
    const message = body.message?.trim()

    if (!subject) {
        throw createError({
            statusCode: 422,
            statusMessage: 'موضوع درخواست الزامی است.',
        })
    }

    if (!message) {
        throw createError({
            statusCode: 422,
            statusMessage: 'متن درخواست الزامی است.',
        })
    }

    const ticket: SupportTicket = {
        id: Date.now(),
        orderId: body.orderId,
        subject,
        message,
        priority: body.priority ?? 'normal',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    supportTickets.unshift(ticket)

    return {
        success: true,
        message: 'درخواست پشتیبانی با موفقیت ثبت شد.',
        data: ticket,
    }
})