'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/utils'

const INITIAL_PRODUCTS = [
  { id: '1', name: 'Choco Suprema', category: 'Clásicas', base_price: 38, emoji: '🍫', active: true, is_daily_special: false },
  { id: '2', name: 'Red Velvet Dream', category: 'Especiales', base_price: 42, emoji: '❤️', active: true, is_daily_special: true },
  { id: '3', name: 'Vainilla & Sprinkles', category: 'Clásicas', base_price: 35, emoji: '🌈', active: true, is_daily_special: false },
  { id: '4', name: 'Mantequilla Clásica', category: 'Clásicas', base_price: 32, emoji: '🧈', active: true, is_daily_special: false },
  { id: '5', name: 'Oreo & Crema', category: 'Rellenas', base_price: 45, emoji: '🖤', active: false, is_daily_special: false },
  { id: '6', name: 'Frambuesa Love', category: 'Rellenas', base_price: 44, emoji: '💗', active: true, is_daily_special: true },
]

export default function AdminProductosPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', category: 'Clásicas', base_price: '', emoji: '🍪', active: true, is_daily_special: false })

  function toggleActive(id: string) {
    setProducts((p) => p.map((item) => item.id === id ? { ...item, active: !item.active } : item))
  }

  function toggleSpecial(id: string) {
    setProducts((p) => p.map((item) => item.id === id ? { ...item, is_daily_special: !item.is_daily_special } : item))
  }

  function handleSave() {
    if (!form.name || !form.base_price) return
    if (editId) {
      setProducts((p) => p.map((item) => item.id === editId ? { ...item, ...form, base_price: Number(form.base_price) } : item))
    } else {
      setProducts((p) => [...p, { ...form, id: Date.now().toString(), base_price: Number(form.base_price) }])
    }
    setShowForm(false)
    setEditId(null)
    setForm({ name: '', category: 'Clásicas', base_price: '', emoji: '🍪', active: true, is_daily_special: false })
  }

  function startEdit(product: typeof INITIAL_PRODUCTS[0]) {
    setEditId(product.id)
    setForm({ name: product.name, category: product.category, base_price: String(product.base_price), emoji: product.emoji, active: product.active, is_daily_special: product.is_daily_special })
    setShowForm(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-crema">Productos</h1>
        <button onClick={() => { setShowForm(true); setEditId(null) }}
          className="px-4 py-2 bg-dorado text-cafe font-bold rounded-xl text-sm hover:bg-dorado-claro transition-colors">
          + Nuevo producto
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-6 grid grid-cols-2 gap-4">
            <h2 className="col-span-2 font-medium text-crema">{editId ? 'Editar producto' : 'Nuevo producto'}</h2>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nombre del producto"
              className="bg-white/10 rounded-xl px-3 py-2.5 text-crema outline-none text-sm col-span-2 placeholder-crema/30" />
            <input value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
              placeholder="Emoji"
              className="bg-white/10 rounded-xl px-3 py-2.5 text-crema outline-none text-sm placeholder-crema/30" />
            <input value={form.base_price} onChange={(e) => setForm((f) => ({ ...f, base_price: e.target.value }))}
              placeholder="Precio base (Q)" type="number"
              className="bg-white/10 rounded-xl px-3 py-2.5 text-crema outline-none text-sm placeholder-crema/30" />
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="bg-white/10 rounded-xl px-3 py-2.5 text-crema outline-none text-sm col-span-2">
              {['Clásicas', 'Especiales', 'Rellenas', 'Sin gluten'].map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
            </select>
            <div className="col-span-2 flex gap-3">
              <button onClick={handleSave} className="px-4 py-2 bg-dorado text-cafe font-bold rounded-xl text-sm">Guardar</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-white/10 text-crema rounded-xl text-sm">Cancelar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {products.map((product) => (
          <div key={product.id}
            className={`flex items-center gap-4 bg-white/5 rounded-2xl p-4 border transition-colors ${product.active ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
            <span className="text-2xl">{product.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-crema text-sm">{product.name}</p>
              <p className="text-crema/40 text-xs">{product.category}</p>
            </div>
            <span className="font-bold text-dorado text-sm">{formatPrice(product.base_price)}</span>
            <button onClick={() => toggleSpecial(product.id)}
              title="Especial del día"
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${product.is_daily_special ? 'bg-rosa/20 text-rosa' : 'bg-white/5 text-crema/30 hover:bg-white/10'}`}>
              ✨ Especial
            </button>
            <button onClick={() => startEdit(product)} className="p-2 rounded-lg bg-white/5 text-crema/50 hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button onClick={() => toggleActive(product.id)}
              className={`w-10 h-5 rounded-full relative transition-colors ${product.active ? 'bg-dorado' : 'bg-white/20'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${product.active ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
