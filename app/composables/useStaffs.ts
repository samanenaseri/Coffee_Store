import type { Staff } from "#shared/staff"

export const useStaffs = () => {
    const { apiFetch } = useApi()

    const { data, pending, error } = useAsyncData(
        "staffs",
        () => apiFetch<Staff[]>('/staff'),
    )

    const staffs = computed(() => data.value ?? [])

    return {
        staffs,
        pending,
        error,
    }
}
