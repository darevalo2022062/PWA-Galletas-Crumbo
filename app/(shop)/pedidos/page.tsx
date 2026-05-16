'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useUserStore } from '@/store/user'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'

const MOCK_ORDERS = [
  {
    id: 'CRM-001234',
    status: 'preparing',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    total: 258,
    items: [
      { name: 'Galleta Personalizada', quantity: 6, emoji: '🍪' },
      { name: 'Caja x6', quantity: 1, emoji: '📦' },
    ],
  },
  {
    id: 'CRM-000891',
    status: 'delivered',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    total: 190,
    items: [{ name: 'Choco Suprema', quantity: 5, emoji: '🍫' }],
  },
]

export default function PedidosPage() {
  const user = useUserStore((s) => s.user)

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🔒</span>
        <h2 className="font-display text-2xl text-cafe mb-3">Iniciá sesión para ver tus pedidos</h2>
        <p className="text-cafe-medio mb-8">Guardamos todo tu historial para que puedas rastrearlo fácilmente</p>
        <Link href="/login" className="px-6 py-3 bg-cafe text-crema rounded-full font-bold inline-block">
          Iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-cafe mb-8">Mis pedidos 📋</h1>

      {MOCK_ORDERS.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">🍪</span>
          <p className="text-cafe-medio mb-4">Aún no tenés pedidos</p>
          <Link href="/menu" className="px-6 py-3 bg-cafe text-crema rounded-full font-bold inline-block">Ver menú</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-cafe">{order.id}</p>
                  <p className="text-xs text-cafe-medio">{formatDate(order.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                {order.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-1 bg-gris-suave rounded-xl px-2 py-1 text-xs text-cafe">
                    <span>{item.emoji}</span>
                    <span>{item.name} ×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-dorado">{formatPrice(order.total)}</span>
                <Link href={`/pedido/${order.id}`}
                  className="text-sm text-cafe font-medium hover:text-dorado transition-colors">
                  Ver detalle →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
