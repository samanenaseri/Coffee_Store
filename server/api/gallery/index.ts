import { galleries } from "#server/mock/gallery"

export default defineEventHandler(() => {
    return {
        success: true,
        data: galleries,
    }
})