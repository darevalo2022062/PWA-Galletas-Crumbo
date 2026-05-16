'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils'

const STATUS_STEPS = ['received', 'preparing', 'ready', 'delivered']

const MOCK_ORDER = {
  id: 'CRM-001234',
  status: 'preparing',
  created_at: new Date().toISOString(),
  total: 258,
  delivery_type: 'delivery',
  address: 'Zona 10, Boulevard Vista Hermosa, casa 5B',
  estimated_time: '45–60 minutos',
  payment_method: 'cod',
  items: [
    { name: 'Galleta Personalizada', quantity: 6, unit_price: 43, customizations: 'Chocolate · Nutella · Sprinkles', emoji: '🍪' },
    { name: 'Caja x6', quantity: 1, unit_price: 45, customizations: null, emoji: '📦' },
  ],
}

export default function PedidoDetailPage({ params }: { params: { id: string } }) {
  const order = MOCK_ORDER
  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/pedidos" className="text-cafe-medio text-sm hover:text-cafe mb-6 inline-flex items-center gap-1">
        ← Mis pedidos
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-cafe">{order.id}</h1>
          <p className="text-cafe-medio text-sm">Pedido en camino 🚚</p>
        </div>
        <span className="text-2xl">🍪</span>
      </div>

      {/* Tracker visual */}
      <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
        <div className="relative">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gris-suave" />
          <div
            className="absolute top-5 left-5 h-0.5 bg-dorado transition-all duration-700"
            style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`, maxWidth: 'calc(100% - 40px)' }}
          />
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((s, i) => {
              const done = i <= currentStep
              return (
                <div key={s} className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={false}
                    animate={{ scale: done ? 1 : 0.8 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative border-2 transition-colors ${
                      done ? 'bg-dorado border-dorado text-cafe' : 'bg-white border-gris-suave text-cafe-medio'
                    }`}
                  >
                    {done ? '✓' : String(i + 1)}
                  </motion.div>
                  <span className={`text-xs text-center font-medium ${done ? 'text-cafe' : 'text-cafe-medio'}`}>
                    {ORDER_STATUS_LABELS[s]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-cafe font-medium">Tiempo estimado: <strong className="text-dorado">{order.estimated_time}</strong></p>
        </div>
      </div>

      {/* Detalles del pedido */}
      <div className="bg-white rounded-3xl p-5 mb-4 shadow-sm space-y-3">
        <h2 className="font-medium text-cafe">Tu pedido</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="text-2xl">{item.emoji}</span>
            <div className="flex-1">
              <p className="text-cafe text-sm font-medium">{item.name} ×{item.quantity}</p>
              {item.customizations && <p className="text-xs text-cafe-medio">{item.customizations}</p>}
            </div>
            <span className="font-medium text-cafe text-sm">{formatPrice(item.unit_price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-dorado/10 pt-3 flex justify-between font-bold">
          <span className="text-cafe">Total</span>
          <span className="text-dorado">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="bg-gris-suave rounded-2xl p-4 text-sm space-y-2">
        <p><span className="text-cafe-medio">📍 Dirección:</span> <span className="text-cafe">{order.address}</span></p>
        <p><span className="text-cafe-medio">💵 Pago:</span> <span className="text-cafe">Contra entrega</span></p>
      </div>
    </div>
  )
}
