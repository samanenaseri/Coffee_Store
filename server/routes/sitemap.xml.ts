export default defineEventHandler(async () => {
    const config = useRuntimeConfig()
    const apiBase = config.public?.apiBase || 'http://localhost:8000/api/v1'
    const fallbackBaseUrl = 'https://beanhouse.ir'

    const normalizeBaseUrl = (value: unknown): string => {
        const raw = String(value || '').trim()
        if (
            !/^https?:\/\//i.test(raw)
            || /coffee-store\.example\.com|localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(raw)
        ) {
            return fallbackBaseUrl
        }

        return raw.replace(/\/+$/, '')
    }

    const escapeXml = (value: string): string => value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

    interface SitemapUrl {
        loc: string
        changefreq: string
        priority: number
        lastmod?: string
    }

    const staticPages: SitemapUrl[] = [
        { loc: "/", changefreq: "daily", priority: 1.0 },
        { loc: "/products", changefreq: "daily", priority: 0.9 },
        { loc: "/categories", changefreq: "weekly", priority: 0.7 },
        { loc: "/articles", changefreq: "weekly", priority: 0.7 },
        { loc: "/gallery", changefreq: "weekly", priority: 0.6 },
        { loc: "/about", changefreq: "monthly", priority: 0.5 },
        { loc: "/contact", changefreq: "monthly", priority: 0.5 },
        { loc: "/terms", changefreq: "yearly", priority: 0.2 },
    ]

    let productPages: SitemapUrl[] = []
    let articlePages: SitemapUrl[] = []
    let galleryPages: SitemapUrl[] = []
    let categoryPages: SitemapUrl[] = []

    try {
        const productsRes = await $fetch<any>(`${apiBase}/products?per_page=500`)
        const products = productsRes.data || productsRes
        productPages = (Array.isArray(products) ? products : []).map((p: any) => ({
            loc: `/products/${p.slug}`,
            changefreq: "weekly" as const,
            priority: 0.8,
            lastmod: p.updated_at || new Date().toISOString(),
        }))
    } catch {}

    try {
        const articlesRes = await $fetch<any>(`${apiBase}/articles?per_page=500`)
        const articles = articlesRes.data || articlesRes
        articlePages = (Array.isArray(articles) ? articles : []).map((a: any) => ({
            loc: `/articles/${a.slug}`,
            changefreq: "weekly" as const,
            priority: 0.7,
            lastmod: a.updated_at || new Date().toISOString(),
        }))
    } catch {}

    try {
        const galleryRes = await $fetch<any>(`${apiBase}/gallery?per_page=500`)
        const gallery = galleryRes.data || galleryRes
        galleryPages = (Array.isArray(gallery) ? gallery : []).map((g: any) => ({
            loc: `/gallery/${g.slug}`,
            changefreq: "weekly" as const,
            priority: 0.6,
            lastmod: g.updated_at || new Date().toISOString(),
        }))
    } catch {}

    try {
        const categoriesRes = await $fetch<any>(`${apiBase}/categories`)
        const categories = categoriesRes.data || categoriesRes
        categoryPages = (Array.isArray(categories) ? categories : []).map((c: any) => ({
            loc: `/categories/${c.slug}`,
            changefreq: "weekly" as const,
            priority: 0.7,
            lastmod: c.updated_at || new Date().toISOString(),
        }))
    } catch {}

    let baseUrl = fallbackBaseUrl
    try {
        const settingsRes = await $fetch<any>(`${apiBase}/settings`)
        const settings = settingsRes?.data && typeof settingsRes.data === 'object'
            ? settingsRes.data
            : settingsRes
        baseUrl = normalizeBaseUrl(settings?.site_url)
    } catch {}

    const urls = [...staticPages, ...productPages, ...articlePages, ...galleryPages, ...categoryPages]

    const urlElements = urls.map((url) => {
        const loc = encodeURI(`${baseUrl}${url.loc}`)
        let result = `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>`
        if (url.lastmod) {
            result += `\n    <lastmod>${escapeXml(String(url.lastmod))}</lastmod>`
        }
        result += "\n  </url>"
        return result
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements.join("\n")}
</urlset>`

    return new Response(sitemap, {
        headers: { 'Content-Type': 'application/xml' },
    })
})
