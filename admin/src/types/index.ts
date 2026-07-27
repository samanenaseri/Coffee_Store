export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  is_admin: boolean
  avatar: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  title: string
  slug: string
  description: string | null
  icon: string | null
  image: string | null
  sort_order: number
  is_active: boolean
  products_count?: number
  meta_title: string | null
  meta_description: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export interface WeightPackage {
  id: string
  weight: number
  unit: 'g' | 'kg' | string
  price: number
}

export interface Product {
  id: number
  title: string
  slug: string
  price: number
  weight?: number | null
  weight_unit?: string | null
  price_per_kg?: number | null
  weight_packages?: WeightPackage[] | null
  image: string | null
  image_alt: string | null
  category_id: number | null
  category?: Category
  description: string | null
  rating: number | null
  inventory: number | null
  is_active: boolean
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  id: number
  title: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
  items_count?: number
  meta_title: string | null
  meta_description: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: number
  category_id: number
  category?: MenuCategory
  title: string
  slug: string | null
  description: string | null
  price: number
  is_available: boolean
  is_popular: boolean
  image: string | null
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'

export interface OrderUser {
  id: number
  name: string
  email: string
  phone: string | null
}

export interface OrderItem {
  id: number
  product_id: number
  product?: Product
  quantity: number
  price: number
}

export interface OrderAddress {
  id: number
  recipient_name: string
  phone: string
  state: string
  city: string
  address_line: string
  postal_code: string | null
}

export interface OrderShipping {
  id: number
  shipping_method: string
  shipping_cost: number
  delivery_day: string
  estimated_delivery: string | null
}

export interface OrderPayment {
  id: number
  payment_method: string
  payment_status: string
}

export interface OrderStatusHistoryItem {
  id: number
  status: OrderStatus
  note: string | null
  created_at: string
}

export interface Order {
  id: number
  user_id: number
  user?: OrderUser
  tracking_code: string | null
  total_amount: number
  discount_amount: number
  final_amount: number
  status: OrderStatus
  status_label: string
  action_status: string | null
  note: string | null
  items?: OrderItem[]
  address?: OrderAddress
  shipping?: OrderShipping
  payment?: OrderPayment
  status_history?: OrderStatusHistoryItem[]
  shipping_method?: string
  shipping_cost?: number
  delivery_day?: string
  payment_method?: string
  payment_status?: string
  payable_amount?: number
  wallet_amount?: number
  card_transfer_submitted_at?: string
  card_transfer_amount?: number
  card_transfer_ref?: string
  card_transfer_date?: string
  card_transfer_note?: string
  payment_review_status?: string
  created_at: string
  updated_at: string
}

export interface Article {
  id: number
  title: string
  slug: string
  description: string | null
  content: string | null
  image: string | null
  image_alt: string | null
  author: string | null
  is_active: boolean
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: number
  title: string
  slug: string
  image: string
  image_alt: string | null
  category: string | null
  description: string | null
  sort_order: number
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export interface Staff {
  id: number
  name: string
  role: string
  description: string | null
  image: string | null
  instagram: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: number
  name: string
  role: string | null
  comment: string
  rating: number
  image: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SupportTicket {
  id: number
  user_id: number
  user?: OrderUser
  subject: string
  description: string
  status: string
  priority: string
  replies?: SupportReply[]
  created_at: string
  updated_at: string
}

export interface SupportReply {
  id: number
  ticket_id: number
  user_id: number
  user?: OrderUser
  message: string
  is_admin_reply: boolean
  created_at: string
}

export interface Setting {
  id: number
  key: string
  value: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface DashboardStats {
  total_users: number
  total_orders: number
  total_products: number
  total_revenue: number
  recent_orders: Order[]
  monthly_revenue: { month: string; revenue: number }[]
}
