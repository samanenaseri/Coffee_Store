export interface ProductComment {
  id: number
  productId?: number
  product_id?: number
  userId?: number | null
  user_id?: number | null
  authorName?: string
  author_name?: string
  body: string
  rating: number
  isApproved?: boolean
  is_approved?: boolean
  createdAt?: string
  created_at?: string
  product?: {
    id: number
    title: string
    slug: string
  }
  user?: {
    id: number
    name: string
    email?: string
  } | null
}

export interface ProductCommentsResponse {
  productId?: number
  product_id?: number
  averageRating?: number
  average_rating?: number
  commentsCount?: number
  comments_count?: number
  comments: {
    current_page?: number
    currentPage?: number
    data: ProductComment[]
    last_page?: number
    lastPage?: number
    total?: number
  }
}
