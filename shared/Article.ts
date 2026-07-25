export interface Article {
    id: number
    title: string
    slug: string
    description: string
    content: string
    image?: string
    image_alt?: string
    author?: string
    created_at?: string
    is_active?: boolean
    sort_order?: number
    imageAlt?: string
    createdAt?: string
    isActive?: boolean
    sortOrder?: number
    meta_title?: string
    meta_description?: string
    og_title?: string
    og_description?: string
    og_image?: string
}