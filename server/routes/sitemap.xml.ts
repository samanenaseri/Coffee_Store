import { products } from "#server/mock/products"

export default defineEventHandler(() => {
    const baseUrl = "https://coffee-store.example.com"

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
        { loc: "/about", changefreq: "monthly", priority: 0.5 },
        { loc: "/contact", changefreq: "monthly", priority: 0.5 },
    ]

    const productPages: SitemapUrl[] = products.map((p) => ({
        loc: `/products/${p.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
    }))

    const urls = [...staticPages, ...productPages]

    const urlElements = urls.map((url) => {
        let result = `  <url>\n    <loc>${baseUrl}${url.loc}</loc>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>`
        if (url.lastmod) {
            result += `\n    <lastmod>${url.lastmod}</lastmod>`
        }
        result += "\n  </url>"
        return result
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements.join("\n")}
</urlset>`

    return sitemap
})
