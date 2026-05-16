'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useUserStore } from '@/store/user'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

const DELIVERY_FEE = 20

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const clearCart = useCartStore((s) => s.clearCart)
  const user = useUserStore((s) => s.user)

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone?.replace('+502', '') || '',
    address: '',
    notes: '',
    delivery_type: 'delivery' as 'delivery' | 'pickup',
  })
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')

  const grandTotal = total + DELIVERY_FEE

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleConfirm() {
    setLoading(true)
    // En producción esto llamaría a /api/orders con Supabase
    await new Promise((r) => setTimeout(r, 1200))
    const id = `CRM-${Date.now().toString().slice(-6)}`
    setOrderId(id)
    clearCart()
    setStep('success')
    setLoading(false)
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🛒</span>
        <h2 className="font-display text-2xl text-cafe mb-4">No hay nada en tu carrito</h2>
        <Link href="/menu" className="px-6 py-3 bg-cafe text-crema rounded-full font-bold">Ver menú</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="font-display text-3xl font-bold text-cafe mb-6">Confirmar pedido</h1>

            {!user && (
              <div className="bg-dorado/10 border border-dorado/20 rounded-2xl p-4 mb-6">
                <p className="text-cafe text-sm">
                  <Link href="/login" className="font-bold underline">Iniciá sesión</Link> para guardar tu historial de pedidos. O podés continuar como invitado.
                </p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-cafe mb-1 block">Tu nombre *</label>
                <input value={form.name} onChange={(e) => update('name', e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full bg-gris-suave rounded-2xl px-4 py-3 text-cafe outline-none focus:ring-2 focus:ring-dorado/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-cafe mb-1 block">Teléfono *</label>
                <div className="flex items-center bg-gris-suave rounded-2xl overflow-hidden">
                  <span className="px-3 text-cafe-medio text-sm border-r border-dorado/20 py-3">🇬🇹 +502</span>
                  <input value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="5555-5555"
                    className="flex-1 bg-transparent px-3 py-3 text-cafe outline-none" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-cafe mb-1 block">Tipo de entrega *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'delivery', label: '🚚 Delivery', desc: '+Q20.00' },
                    { value: 'pickup', label: '🏪 Retiro', desc: 'Sin costo adicional' },
                  ].map(({ value, label, desc }) => (
                    <button key={value} onClick={() => update('delivery_type', value)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all ${form.delivery_type === value ? 'border-cafe bg-cafe/5' : 'border-transparent bg-gris-suave hover:border-dorado/40'}`}>
                      <p className="font-medium text-cafe text-sm">{label}</p>
                      <p className="text-xs text-cafe-medio">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {form.delivery_type === 'delivery' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="text-sm font-medium text-cafe mb-1 block">Dirección de entrega *</label>
                  <textarea value={form.address} onChange={(e) => update('address', e.target.value)}
                    placeholder="Zona, colonia, calle, número de casa..."
                    className="w-full bg-gris-suave rounded-2xl px-4 py-3 text-cafe outline-none resize-none"
                    rows={2} />
                </motion.div>
              )}

              <div>
                <label className="text-sm font-medium text-cafe mb-1 block">Notas adicionales <span className="text-cafe-medio font-normal">(opcional)</span></label>
                <input value={form.notes} onChange={(e) => update('notes', e.target.value)}
                  placeholder="Indicaciones especiales, referencia..."
                  className="w-full bg-gris-suave rounded-2xl px-4 py-3 text-cafe outline-none" />
              </div>
            </div>

            {/* Resumen de pedido */}
            <div className="bg-gris-suave rounded-3xl p-4 mb-6 space-y-2">
              <h2 className="font-medium text-cafe mb-3">Tu pedido</h2>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-cafe">{item.product.name} ×{item.quantity}</span>
                  <span className="font-medium text-cafe">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              {form.delivery_type === 'delivery' && (
                <div className="flex justify-between text-sm text-cafe-medio border-t border-dorado/10 pt-2 mt-2">
                  <span>Envío</span><span>{formatPrice(DELIVERY_FEE)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-cafe border-t border-dorado/10 pt-2">
                <span>Total</span>
                <span className="text-dorado">{formatPrice(form.delivery_type === 'delivery' ? grandTotal : total)}</span>
              </div>
            </div>

            {/* Métodos de pago */}
            <div className="mb-6">
              <h2 className="font-medium text-cafe mb-3">Método de pago</h2>
              <div className="bg-cafe/5 border-2 border-cafe rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-medium text-cafe">Contra entrega</p>
                  <p className="text-xs text-cafe-medio">Pagás al recibir tu pedido</p>
                </div>
                <div className="ml-auto w-5 h-5 rounded-full bg-cafe flex items-center justify-center">
                  <div className="w-2 h-2 bg-crema rounded-full" />
                </div>
              </div>
              <div className="mt-2 bg-gris-suave border-2 border-dashed border-cafe-medio/20 rounded-2xl p-4 flex items-center gap-3 opacity-60">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="font-medium text-cafe">Tarjeta de crédito/débito</p>
                  <p className="text-xs text-cafe-medio">Visa, Mastercard, American Express</p>
                </div>
                <span className="ml-auto px-2 py-0.5 bg-dorado/20 text-dorado text-xs font-medium rounded-full">Próximamente</span>
              </div>
            </div>

            <p className="text-xs text-cafe-medio text-center mb-4 bg-amber-50 rounded-xl p-3">
              ⚠️ Una vez confirmado, el pedido no puede modificarse
            </p>

            <button
              onClick={() => setStep('confirm')}
              disabled={!form.name || !form.phone || (form.delivery_type === 'delivery' && !form.address)}
              className="w-full py-4 bg-cafe text-crema rounded-2xl font-bold text-lg disabled:opacity-50 hover:bg-cafe-medio transition-colors"
            >
              Revisar pedido →
            </button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <h1 className="font-display text-3xl font-bold text-cafe mb-6">¿Todo está bien? 👀</h1>
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3 mb-6">
              <div className="flex justify-between text-sm"><span className="text-cafe-medio">Nombre</span><span className="font-medium text-cafe">{form.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-cafe-medio">Teléfono</span><span className="font-medium text-cafe">+502 {form.phone}</span></div>
              <div className="flex justify-between text-sm"><span className="text-cafe-medio">Entrega</span><span className="font-medium text-cafe">{form.delivery_type === 'delivery' ? '🚚 Delivery' : '🏪 Retiro'}</span></div>
              {form.delivery_type === 'delivery' && (
                <div className="flex justify-between text-sm"><span className="text-cafe-medio">Dirección</span><span className="font-medium text-cafe text-right max-w-48">{form.address}</span></div>
              )}
              <div className="flex justify-between text-sm"><span className="text-cafe-medio">Pago</span><span className="font-medium text-cafe">💵 Contra entrega</span></div>
              <div className="flex justify-between text-sm font-bold border-t pt-3 border-dorado/10">
                <span className="text-cafe">Total a pagar</span>
                <span className="text-dorado font-display text-lg">{formatPrice(form.delivery_type === 'delivery' ? grandTotal : total)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('form')} className="flex-1 py-3.5 border-2 border-cafe text-cafe rounded-2xl font-medium">
                ← Editar
              </button>
              <button onClick={handleConfirm} disabled={loading} className="flex-1 py-3.5 bg-cafe text-crema rounded-2xl font-bold disabled:opacity-50">
                {loading ? 'Procesando...' : '✓ Confirmar pedido'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-8xl block mb-6"
            >
              🍪
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-cafe mb-3">¡Pedido recibido!</h1>
            <p className="text-cafe-medio mb-2">Tu número de pedido es:</p>
            <p className="font-display text-4xl font-bold text-dorado mb-6">{orderId}</p>
            <div className="bg-gris-suave rounded-2xl p-4 mb-8 text-sm text-cafe-medio">
              <p>📱 Te contactaremos al <strong className="text-cafe">+502 {form.phone}</strong></p>
              <p className="mt-1">⏱️ Tiempo estimado: <strong className="text-cafe">45–60 minutos</strong></p>
              <p className="mt-1">💵 Recordá tener el efectivo listo al recibir</p>
            </div>
            <div className="flex gap-3">
              <Link href="/pedidos" className="flex-1 py-3.5 bg-cafe text-crema rounded-2xl font-bold text-center">
                Ver mis pedidos
              </Link>
              <Link href="/" className="flex-1 py-3.5 border-2 border-cafe text-cafe rounded-2xl font-medium text-center">
                Ir al inicio
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
