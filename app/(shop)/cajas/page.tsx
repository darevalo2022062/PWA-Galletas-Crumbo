'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import type { BoxType } from '@/types'

const BoxScene = dynamic(() => import('@/components/3d/BoxScene'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gris-suave rounded-3xl animate-pulse" />,
})

const BOX_OPTIONS: { type: BoxType; label: string; emoji: string; price: number; desc: string; count: number }[] = [
  { type: 'individual', label: 'Caja Individual', emoji: '🎁', price: 45, desc: '1 galleta personalizada', count: 1 },
  { type: 'x6', label: 'Caja x6', emoji: '📦', price: 220, desc: '6 galletas a tu elección', count: 6 },
  { type: 'x12', label: 'Caja x12', emoji: '🎀', price: 420, desc: '12 galletas — el regalo perfecto', count: 12 },
  { type: 'surprise', label: 'Caja Sorpresa', emoji: '✨', price: 180, desc: 'Nosotros elegimos lo mejor para vos', count: 0 },
]

const BOX_COLORS = [
  { color: '#E8596A', label: 'Rosa' },
  { color: '#3D1C02', label: 'Café' },
  { color: '#D4A017', label: 'Dorado' },
  { color: '#2C3E50', label: 'Azul noche' },
  { color: '#27AE60', label: 'Verde' },
  { color: '#8E44AD', label: 'Morado' },
]

const RIBBON_COLORS = [
  { color: '#D4A017', label: 'Dorado' },
  { color: '#FFFFFF', label: 'Blanco' },
  { color: '#E8596A', label: 'Rosa' },
  { color: '#3D1C02', label: 'Café' },
]

const BASE_PRODUCT_BOX = { id: 'gift-box', name: 'Caja de Regalo Crumbo', base_price: 0, category_id: 'box', image_url: null, active: true, is_daily_special: false, stock_limit: null, description: null }

export default function CajasPage() {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  const [selectedBox, setSelectedBox] = useState<BoxType>('x6')
  const [boxColor, setBoxColor] = useState('#E8596A')
  const [ribbonColor, setRibbonColor] = useState('#D4A017')
  const [hasRibbon, setHasRibbon] = useState(true)
  const [message, setMessage] = useState('')
  const [added, setAdded] = useState(false)

  const boxOption = BOX_OPTIONS.find((b) => b.type === selectedBox)!

  function handleAdd() {
    BASE_PRODUCT_BOX.base_price = boxOption.price
    BASE_PRODUCT_BOX.name = boxOption.label
    addItem(BASE_PRODUCT_BOX, 1, [], message || undefined, selectedBox)
    setAdded(true)
    setTimeout(() => router.push('/carrito'), 1200)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-cafe mb-1">Armar caja de regalo 📦</h1>
        <p className="text-cafe-medio text-sm mb-6">El regalo perfecto, personalizado desde el lazo hasta la galleta</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Vista 3D de la caja */}
        <div className="md:sticky md:top-24">
          <div className="bg-gradient-to-b from-cafe to-cafe-medio rounded-3xl p-4 md:p-6">
            <BoxScene interactive />
            <div className="mt-4 text-center">
              <p className="font-display text-2xl font-bold text-dorado">{formatPrice(boxOption.price)}</p>
              <p className="text-crema/60 text-xs">{boxOption.desc}</p>
            </div>
          </div>
        </div>

        {/* Opciones */}
        <div className="space-y-6">
          {/* Tipo de caja */}
          <div>
            <h2 className="font-medium text-cafe mb-3">Tipo de caja</h2>
            <div className="grid grid-cols-2 gap-3">
              {BOX_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.type}
                  onClick={() => setSelectedBox(opt.type)}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-2xl text-left border-2 transition-all ${
                    selectedBox === opt.type ? 'border-cafe bg-cafe/5' : 'border-transparent bg-gris-suave hover:border-dorado/40'
                  }`}
                >
                  <span className="text-2xl block mb-1">{opt.emoji}</span>
                  <p className="font-medium text-cafe text-sm">{opt.label}</p>
                  <p className="text-xs text-cafe-medio">{opt.desc}</p>
                  <p className="font-bold text-dorado text-sm mt-1">{formatPrice(opt.price)}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color de la caja */}
          <div>
            <h2 className="font-medium text-cafe mb-3">Color de la caja</h2>
            <div className="flex gap-3 flex-wrap">
              {BOX_COLORS.map(({ color, label }) => (
                <button
                  key={color}
                  onClick={() => setBoxColor(color)}
                  title={label}
                  className={`w-10 h-10 rounded-full border-4 transition-all ${
                    boxColor === color ? 'border-cafe scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Lazo */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-cafe">Lazo decorativo</h2>
              <button
                onClick={() => setHasRibbon(!hasRibbon)}
                className={`w-12 h-6 rounded-full transition-colors relative ${hasRibbon ? 'bg-cafe' : 'bg-gris-suave'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${hasRibbon ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            {hasRibbon && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex gap-3 flex-wrap">
                {RIBBON_COLORS.map(({ color, label }) => (
                  <button
                    key={color}
                    onClick={() => setRibbonColor(color)}
                    title={label}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      ribbonColor === color ? 'border-cafe scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color, border: color === '#FFFFFF' ? '4px solid #e0d8cc' : undefined }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Mensaje */}
          <div>
            <h2 className="font-medium text-cafe mb-3">Tarjeta de regalo <span className="font-normal text-cafe-medio text-sm">(opcional)</span></h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribí tu mensaje especial aquí... 💌"
              className="w-full bg-gris-suave rounded-2xl px-4 py-3 text-cafe text-sm outline-none resize-none border border-dorado/10 focus:border-dorado/40"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-cafe-medio text-right mt-1">{message.length}/200</p>
          </div>

          <motion.button
            onClick={handleAdd}
            disabled={added}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
              added ? 'bg-green-500 text-white' : 'bg-cafe text-crema hover:bg-cafe-medio'
            }`}
          >
            {added ? '✓ ¡Agregada al carrito!' : `Agregar caja — ${formatPrice(boxOption.price)}`}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
