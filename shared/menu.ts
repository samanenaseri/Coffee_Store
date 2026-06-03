export interface MenuItem {
    id: number
    title: string
    description: string
    price: number
    isAvailable: boolean
    isPopular?: boolean
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
}