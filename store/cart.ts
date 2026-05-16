'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartCustomization, Product, BoxType } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (
    product: Product,
    quantity: number,
    customizations: CartCustomization[],
    dedication_message?: string,
    box_type?: BoxType
  ) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, customizations, dedication_message, box_type) => {
        const extra = customizations.reduce((sum, c) => sum + c.extra_price, 0)
        const unit_price = product.base_price + extra
        const id = `${product.id}-${Date.now()}`
        set((state) => ({
          items: [...state.items, { id, product, quantity, unit_price, customizations, dedication_message, box_type, is_box: !!box_type }],
        }))
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'crumbo-cart' }
  )
)
