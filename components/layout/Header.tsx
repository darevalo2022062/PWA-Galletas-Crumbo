'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { useUserStore } from '@/store/user'
import CartDrawer from '@/components/cart/CartDrawer'

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())
  const user = useUserStore((s) => s.user)

  return (
    <>
      <header className="sticky top-0 z-40 bg-crema/95 backdrop-blur-sm border-b border-dorado/20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-cafe tracking-tight">
            Crumbo
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-cafe-medio">
            <Link href="/menu" className="hover:text-dorado transition-colors">Menú</Link>
            <Link href="/personalizar" className="hover:text-dorado transition-colors">Personalizar</Link>
            <Link href="/cajas" className="hover:text-dorado transition-colors">Cajas</Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/pedidos" className="text-sm text-cafe-medio hover:text-cafe transition-colors hidden md:block">
                Mis pedidos
              </Link>
            ) : (
              <Link href="/login" className="text-sm text-cafe-medio hover:text-cafe transition-colors hidden md:block">
                Iniciar sesión
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full bg-cafe text-crema hover:bg-cafe-medio transition-colors"
              aria-label="Abrir carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-rosa text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
