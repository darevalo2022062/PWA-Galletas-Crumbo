'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUS_FLOW: OrderStatus[] = ['received', 'preparing', 'ready', 'delivered']

const STATUS_COLORS: Record<OrderStatus, string> = {
  received: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  preparing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  ready: 'bg-green-500/20 text-green-300 border-green-500/30',
  delivered: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const MOCK_ORDERS = [
  { id: 'CRM-001234', status: 'preparing' as OrderStatus, created_at: new Date(Date.now() - 1800000).toISOString(), total: 258, name: 'María García', phone: '+502 55551234', items: '6x Galleta Personalizada, 1x Caja', delivery_type: 'delivery' },
  { id: 'CRM-001233', status: 'received' as OrderStatus, created_at: new Date(Date.now() - 3600000).toISOString(), total: 152, name: 'Carlos López', phone: '+502 44449876', items: '4x Choco Suprema', delivery_type: 'pickup' },
  { id: 'CRM-001232', status: 'ready' as OrderStatus, created_at: new Date(Date.now() - 7200000).toISOString(), total: 420, name: 'Ana Pérez', phone: '+502 33337654', items: '1x Caja x12', delivery_type: 'delivery' },
  { id: 'CRM-001231', status: 'delivered' as OrderStatus, created_at: new Date(Date.now() - 86400000).toISOString(), total: 95, name: 'Luis Méndez', phone: '+502 22223456', items: '2x Red Velvet Dream, 1x Vainilla', delivery_type: 'pickup' },
]

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')

  function advanceStatus(id: string) {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o
      const idx = STATUS_FLOW.indexOf(o.status)
      const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)]
      return { ...o, status: next }
    }))
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const counts = { all: orders.length, received: orders.filter((o) => o.status === 'received').length, preparing: orders.filter((o) => o.status === 'preparing').length, ready: orders.filter((o) => o.status === 'ready').length, delivered: orders.filter((o) => o.status === 'delivered').length }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-crema">Pedidos</h1>
        <span className="text-crema/50 text-sm">{new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Nuevos', value: counts.received, color: 'text-blue-300' },
          { label: 'En preparación', value: counts.preparing, color: 'text-yellow-300' },
          { label: 'Listos', value: counts.ready, color: 'text-green-300' },
          { label: 'Entregados hoy', value: counts.delivered, color: 'text-gray-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-crema/50 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(['all', 'received', 'preparing', 'ready', 'delivered'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f ? 'bg-dorado text-cafe' : 'bg-white/5 text-crema/60 hover:bg-white/10'
            }`}>
            {f === 'all' ? `Todos (${counts.all})` : `${ORDER_STATUS_LABELS[f]} (${counts[f]})`}
          </button>
        ))}
      </div>

      {/* Tabla de pedidos */}
      <div className="space-y-3">
        {filtered.map((order, i) => (
          <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-crema">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-xs text-crema/40 bg-white/5 rounded-full px-2 py-0.5">
                    {order.delivery_type === 'delivery' ? '🚚 Delivery' : '🏪 Retiro'}
                  </span>
                </div>
                <p className="text-crema/80 text-sm">{order.name} · {order.phone}</p>
                <p className="text-crema/50 text-xs mt-0.5">{order.items}</p>
                <p className="text-crema/40 text-xs mt-0.5">{formatDate(order.created_at)}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="font-bold text-dorado">{formatPrice(order.total)}</span>
                {order.status !== 'delivered' && (
                  <button onClick={() => advanceStatus(order.id)}
                    className="px-3 py-1.5 bg-dorado/20 text-dorado text-xs font-medium rounded-xl hover:bg-dorado/30 transition-colors whitespace-nowrap">
                    → {ORDER_STATUS_LABELS[STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]]}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
