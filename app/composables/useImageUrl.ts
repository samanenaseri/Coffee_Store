/**
 * Resolve media URLs for storefront.
 * - /storage/*  → Laravel public storage (uploaded files)
 * - /images/*   → Nuxt public assets (keep relative)
 * - absolute URLs unchanged
 */
export const useImageUrl = () => {
    const runtimeConfig = useRuntimeConfig()

    const backendOrigin = computed(() => {
        const apiBase = String(runtimeConfig.public.apiBase || 'http://localhost:8000/api/v1')
        // Strip API path if present
        let origin = apiBase
            .replace(/\/api\/v1\/?$/i, '')
            .replace(/\/api\/?$/i, '')
            .replace(/\/$/, '')

        // Relative apiBase (e.g. /api/v1) → default Laravel origin
        if (!origin || origin.startsWith('/')) {
            origin = 'http://localhost:8000'
        }

        return origin
    })

    const resolveUrl = (url: string | null | undefined): string => {
        if (!url) return ''

        const trimmed = String(url).trim()
        if (!trimmed) return ''

        if (
            trimmed.startsWith('http://')
            || trimmed.startsWith('https://')
            || trimmed.startsWith('blob:')
            || trimmed.startsWith('data:')
        ) {
            return trimmed
        }

        // Nuxt/static frontend assets — do not prefix with Laravel
        if (
            trimmed.startsWith('/images/')
            || trimmed.startsWith('/videos/')
            || trimmed.startsWith('/favicon')
            || trimmed.startsWith('/_nuxt')
        ) {
            return trimmed
        }

        // Uploaded files and other backend paths
        if (trimmed.startsWith('/')) {
            return backendOrigin.value + trimmed
        }

        // Bare relative path like "storage/about/x.jpg"
        if (trimmed.startsWith('storage/')) {
            return `${backendOrigin.value}/${trimmed}`
        }

        return trimmed
    }

    return { resolveUrl, backendOrigin }
}
