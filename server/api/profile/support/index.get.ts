import { supportTickets } from '#server/mock/supportTickets'

export default defineEventHandler(() => {
    const tickets = [...supportTickets].sort((a, b) => {
        return (
            new Date(b.createdAt).getTime()
            - new Date(a.createdAt).getTime()
        )
    })

    return {
        success: true,
        data: tickets,
    }
})