function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function camelizeKeys(obj: any): any {
    if (Array.isArray(obj)) return obj.map(camelizeKeys)
    if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
        return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [toCamelCase(k), camelizeKeys(v)])
        )
    }
    return obj
}

export const useApi = () => {
    const config = useRuntimeConfig()
    const token = useCookie('auth-token')

    const apiFetch = async <T>(url: string, opts?: Record<string, any>): Promise<T> => {
        const headers: Record<string, string> = {}

        if (token.value) {
            headers.Authorization = `Bearer ${token.value}`
        }

        const res = await $fetch<any>(url, {
            baseURL: config.public.apiBase as string,
            headers,
            ...opts,
        })

        return camelizeKeys(res) as T
    }

    return { apiFetch }
}
