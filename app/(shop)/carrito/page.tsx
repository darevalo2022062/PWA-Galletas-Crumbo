'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

const DELIVERY_FEE = 20

export default function CarritoPage() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const total = useCartStore((s) => s.total())

  const grandTotal = total + (items.length > 0 ? DELIVERY_FEE : 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-cafe mb-8">Tu carrito 🛒</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-8xl block mb-4">🍪</span>
          <h2 className="font-display text-2xl text-cafe mb-3">Tu carrito está vacío</h2>
          <p className="text-cafe-medio mb-8">¡Algo especial te está esperando!</p>
          <Link href="/menu" className="px-8 py-3.5 bg-cafe text-crema rounded-full font-bold text-lg hover:bg-cafe-medio transition-colors inline-block">
            Ver menú
          </Link>
        </div>
      ) : (
        <>
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, x: 100, height: 0 }}
                className="bg-white rounded-3xl p-4 mb-4 flex gap-4 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-gris-suave flex items-center justify-center text-3xl flex-shrink-0">
                  {item.is_box ? '📦' : '🍪'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-cafe">{item.product.name}</h3>
                  {item.customizations.length > 0 && (
                    <p className="text-xs text-cafe-medio mt-0.5 line-clamp-2">
                      {item.customizations.map((c) => c.label).join(' · ')}
                    </p>
                  )}
                  {item.dedication_message && (
                    <p className="text-xs text-rosa italic mt-0.5">"{item.dedication_message}"</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                        className="w-7 h-7 rounded-full bg-gris-suave flex items-center justify-center text-cafe font-bold hover:bg-dorado hover:text-crema transition-colors text-sm"
                      >−</button>
                      <span className="w-5 text-center text-cafe font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-gris-suave flex items-center justify-center text-cafe font-bold hover:bg-dorado hover:text-crema transition-colors text-sm"
                      >+</button>
                    </div>
                    <span className="font-bold text-dorado">{formatPrice(item.unit_price * item.quantity)}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="self-start p-1 text-cafe-medio hover:text-rosa transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="bg-gris-suave rounded-3xl p-5 mt-6 space-y-3">
            <div className="flex justify-between text-cafe-medio text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-cafe-medio text-sm">
              <span>Costo de envío</span>
              <span>{formatPrice(DELIVERY_FEE)}</span>
            </div>
            <div className="border-t border-dorado/20 pt-3 flex justify-between font-bold text-cafe">
              <span className="font-display text-xl">Total</span>
              <span className="font-display text-xl text-dorado">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <Link href="/checkout"
            className="block w-full text-center py-4 bg-cafe text-crema rounded-2xl font-bold text-lg mt-6 hover:bg-cafe-medio transition-colors shadow-lg">
            Confirmar pedido →
          </Link>

          <div className="flex gap-3 mt-4">
            <Link href="/menu" className="flex-1 text-center py-3 border-2 border-cafe/20 text-cafe rounded-2xl font-medium text-sm hover:border-cafe transition-colors">
              Seguir comprando
            </Link>
            <Link href="/personalizar" className="flex-1 text-center py-3 border-2 border-dorado/40 text-dorado rounded-2xl font-medium text-sm hover:border-dorado transition-colors">
              + Personalizar más
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
