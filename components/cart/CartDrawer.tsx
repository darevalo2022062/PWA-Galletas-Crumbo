'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const total = useCartStore((s) => s.total())

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-cafe/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-crema shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-dorado/20">
              <h2 className="font-display text-xl font-bold text-cafe">Tu carrito</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gris-suave transition-colors">
                <svg className="w-5 h-5 text-cafe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                  <span className="text-6xl">🍪</span>
                  <p className="text-cafe-medio">Tu carrito está vacío</p>
                  <Link href="/menu" onClick={onClose}
                    className="px-4 py-2 bg-cafe text-crema rounded-full text-sm font-medium hover:bg-cafe-medio transition-colors">
                    Ver menú
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gris-suave flex items-center justify-center text-2xl flex-shrink-0">
                      {item.is_box ? '📦' : '🍪'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-cafe text-sm truncate">{item.product.name}</p>
                      {item.customizations.length > 0 && (
                        <p className="text-xs text-cafe-medio mt-0.5 line-clamp-1">
                          {item.customizations.map((c) => c.label).join(' · ')}
                        </p>
                      )}
                      {item.dedication_message && (
                        <p className="text-xs text-rosa mt-0.5 italic truncate">"{item.dedication_message}"</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-dorado">
                          {formatPrice(item.unit_price * item.quantity)}
                        </span>
                        <span className="text-xs text-cafe-medio">×{item.quantity}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="self-start p-1 text-cafe-medio hover:text-rosa transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-dorado/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cafe-medio">Total</span>
                  <span className="font-display text-xl font-bold text-cafe">{formatPrice(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full text-center py-3 bg-cafe text-crema rounded-full font-semibold hover:bg-cafe-medio transition-colors"
                >
                  Confirmar pedido
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
