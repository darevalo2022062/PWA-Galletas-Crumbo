export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered'
export type DeliveryType = 'delivery' | 'pickup'
export type CustomizationType = 'flavor' | 'filling' | 'topping' | 'presentation'
export type PaymentMethod = 'cod' | 'card'
export type BoxType = 'individual' | 'x6' | 'x12' | 'x24' | 'surprise'

export interface Category {
  id: string
  name: string
  image_url: string | null
  active: boolean
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string | null
  base_price: number
  image_url: string | null
  active: boolean
  is_daily_special: boolean
  stock_limit: number | null
  category?: Category
}

export interface CustomizationOption {
  id: string
  product_id: string | null
  type: CustomizationType
  label: string
  extra_price: number
  active: boolean
  image_url: string | null
  color?: string
}

export interface CartCustomization {
  option_id: string
  type: CustomizationType
  label: string
  extra_price: number
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  unit_price: number
  customizations: CartCustomization[]
  dedication_message?: string
  is_box?: boolean
  box_type?: BoxType
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  delivery_type: DeliveryType
  address: string | null
  subtotal: number
  delivery_fee: number
  total: number
  estimated_time: string | null
  notes: string | null
  payment_method: PaymentMethod
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  customizations: CartCustomization[]
  dedication_message: string | null
  product?: Product
}

export interface User {
  id: string
  phone: string
  name: string | null
  created_at: string
}

export interface AppSettings {
  min_cookies_for_customization: number
  delivery_fee: number
  estimated_delivery_minutes: number
  store_open: boolean
}
