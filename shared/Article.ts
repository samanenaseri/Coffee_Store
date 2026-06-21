export interface Article {
    id: number
    title: string
    slug: string
    description: string
    content: string
    image?: string
    imageAlt:string,
    author?: string
    createdAt?: string
    isActive: boolean
    sortOrder: number
}