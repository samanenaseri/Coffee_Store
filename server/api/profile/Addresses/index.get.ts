import { mockAddresses } from '#server/mock/addresses'

export default defineEventHandler(() => {
    const data = [...mockAddresses].sort((a, b) => {
        if (a.isDefault !== b.isDefault) {
            return Number(b.isDefault) - Number(a.isDefault)
        }

        return b.id - a.id
    })

    return {
        success: true,
        data,
    }
})