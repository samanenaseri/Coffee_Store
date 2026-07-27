export interface MenuItem {
    id: number
    title: string
    slug?: string
    description: string
    price: number
    isAvailable: boolean
    isPopular?: boolean
    meta_title?: string
    meta_description?: string
    og_title?: string
    og_description?: string
    og_image?: string
}

export interface MenuCategory {
    id: number
    title: string
    slug: string
    description?: string
    icon?: string
    sortOrder: number
    isActive: boolean
    items: MenuItem[]
    meta_title?: string
    meta_description?: string
    og_title?: string
    og_description?: string
    og_image?: string
}