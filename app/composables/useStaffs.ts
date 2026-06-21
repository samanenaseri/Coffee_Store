import type { Staff } from "#shared/staff"

export const useStaffs = () => {
    const { data, pending, error } = useAsyncData(
        "staffs",
        () => $fetch<{ success: boolean; data: Staff[] }>("/api/staffs")
    )

    const staffs = computed(() => data.value?.data ?? [])

    return {
        staffs,
        pending,
        error,
    }
}