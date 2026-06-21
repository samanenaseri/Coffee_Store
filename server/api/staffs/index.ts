import { mockStaffs } from "#server/mock/staffs"

export default defineEventHandler(() => {
    const staffs = mockStaffs
        .filter((staff) => staff.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)

    return {
        success: true,
        data: staffs,
    }
})