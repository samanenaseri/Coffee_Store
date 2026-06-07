export interface Article {
    id: number
    title: string
    slug: string
    description: string
    content: string
    image?: string
    author?: string
    createdAt?: string
    isActive: boolean
    sortOrder: number
}